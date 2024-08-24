import { hash, verify } from '@node-rs/argon2';
import { eq } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import db from '../../db';
import {
  emailVerification,
  tenancyPlan,
  userAccounts,
  userProfile,
} from '../../db/schema';
import env from '../../env';
import { messages } from '../../utils/messages';
import {
  createDate,
  generateId,
  generateOTP,
  isWithinExpirationDate,
  TimeSpan,
} from '../../utils/randoms';
import { tenancy } from './../../db/schema/tenancy';
import { user } from './../../db/schema/user';
import { userRoles } from './../../db/schema/user-roles';
import {
  loginSchema,
  registrationNewCodeSchema,
  signupSchema,
  verifyRegistrationSchema,
} from './auth.schemas';

const passwordConfig = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};

export type Payload = {
  email: string;
  roles: string[];
  userId: string;
  tenancyId: string;
};

declare global {
  namespace Express {
    interface Request {
      user: Payload | null;
    }
  }
}

const issueToken = (payload: Payload) => {
  const tokenTTL = process.env.TOKEN_TTL ? process.env.TOKEN_TTL : '2h';
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: tokenTTL });
};

export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const login = loginSchema.safeParse(req.body);
    if (!login.success) {
      return res.status(400).json(login.error.issues);
    }

    const registeredUser = await db.query.user.findFirst({
      where: eq(user.email, login.data.email),
    });

    const error401 = {
      status: 401,
      code: messages.INVALID_CREDENTIALS_CODE,
      message: messages.INVALID_CREDENTIALS,
    };

    if (!registeredUser || !registeredUser.email_verified) {
      next(error401);
      return;
    }

    const userAccount = await db.query.userAccounts.findFirst({
      where: eq(userAccounts.userId, registeredUser.id),
    });

    if (!userAccount) {
      return registeredUser.email_verified;
    }

    if (userAccount.accountType === 'email') {
      const validPassword = await verify(
        userAccount.passwordHash!,
        login.data.password,
        {
          salt: Buffer.from(userAccount.salt!, 'hex'),
          ...passwordConfig,
        }
      );
      if (!validPassword) {
        next(error401);
        return;
      }
    } else {
      next(error401);
      return;
    }

    const profile = await db.query.userProfile.findFirst({
      where: eq(userProfile.userId, registeredUser.id),
    });

    const userRole = await db.query.userRoles.findMany({
      where: eq(userRoles.userId, registeredUser.id),
    });

    const token = issueToken({
      email: registeredUser.email,
      roles: userRole.map((role) => role.role),
      userId: registeredUser.id,
      tenancyId: registeredUser.tenancyId,
    });

    return res.status(200).json({
      user: { name: profile?.displayName, image: profile?.image },
      token: token,
    });
  } catch (error: any) {
    error.status = 500;
    error.message = error.message || messages.INTERNAL_SERVER_ERROR;
    error.code = error.code || messages.INTERNAL_SERVER_ERROR_CODE;
    next(error);
  }
};

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const register = signupSchema.safeParse(req.body);
    if (!register.success) {
      return res.status(400).json(register.error.issues);
    }

    const existingUser = await db.query.user.findFirst({
      where: eq(user.email, register.data.email),
    });

    if (existingUser) {
      const error = {
        status: 409,
        code: messages.USER_ALREADY_EXISTS_CODE,
        message: messages.USER_ALREADY_EXISTS,
      };
      next(error);
      return;
    }

    const { email, password } = register.data;
    const saltPassword = generateId();

    const passwordHash = await hash(password, {
      salt: Buffer.from(saltPassword, 'hex'),
      ...passwordConfig,
    });

    const registrationCode = generateOTP();
    const tenancyId = generateId();
    const userId = generateId();
    const registeredUser = await db.transaction(async (tx) => {
      await tx.insert(tenancy).values({
        id: tenancyId,
        name: email,
      });

      await tx.insert(tenancyPlan).values({
        tenancyId,
        isFree: true,
        startsAt: new Date(),
        expiresAt: createDate(new TimeSpan(1, 'y')),
      });

      const [newUser] = await tx
        .insert(user)
        .values({
          id: userId,
          email,
          tenancyId,
          email_verified: false,
        })
        .returning();

      await tx.insert(userAccounts).values({
        userId,
        accountType: 'email',
        passwordHash,
        salt: saltPassword,
      });

      await tx.insert(userProfile).values({
        userId,
        displayName: email,
        theme: 'light',
        locale: 'en',
      });

      await tx.insert(emailVerification).values({
        code: registrationCode,
        userId,
        verificationType: 'registration',
        email: email,
        expires_at: createDate(new TimeSpan(15, 'm')),
      });

      await tx.insert(userRoles).values({
        userId,
        role: 'super-user',
      });

      return {
        user: newUser,
        tenancyId,
        displayName: email,
        role: 'super-user',
      };
    });

    if (registeredUser.user.email_verified) {
      const profile = await db.query.userProfile.findFirst({
        where: eq(userProfile.userId, registeredUser.user.id),
      });

      const token = issueToken({
        email: registeredUser.user.email,
        userId: registeredUser.user.id,
        roles: [registeredUser.role],
        tenancyId: registeredUser.tenancyId,
      });
      return res.status(200).json({
        enabled: true,
        user: { name: profile?.displayName, image: profile?.image },
        token: token,
      });
    }

    return res.status(200).json({
      enabled: false,
      code: messages.SIGNUP_SUCCESS_CODE,
      message: messages.SIGNUP_SUCCESS,
    });
  } catch (error: any) {
    error.status = 500;
    error.message = error.message || messages.INTERNAL_SERVER_ERROR;
    error.code = error.code || messages.INTERNAL_SERVER_ERROR_CODE;
    next(error);
  }
};

export const verifyRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const register = verifyRegistrationSchema.safeParse(req.body);
    if (!register.success) {
      return res.status(400).json(register.error.issues);
    }

    const verification = await db.query.emailVerification.findFirst({
      where: eq(emailVerification.code, register.data.code),
    });

    if (!verification) {
      const error = {
        status: 400,
        code: messages.VERIFICATION_NOT_FOUND_CODE,
        message: messages.VERIFICATION_NOT_FOUND,
      };
      next(error);
      return;
    }

    if (!isWithinExpirationDate(verification.expires_at)) {
      const error = {
        status: 400,
        code: messages.VERIFICATION_EXPIRED_CODE,
        message: messages.VERIFICATION_EXPIRED,
      };
      next(error);
      return;
    }

    await db.transaction(async (tx) => {
      await tx
        .update(user)
        .set({
          email_verified: true,
        })
        .where(eq(user.id, verification.userId));

      await tx
        .delete(emailVerification)
        .where(eq(emailVerification.id, verification.id));
    });

    return res.status(200).json({
      code: messages.VERIFICATION_SUCCESS_CODE,
      message: messages.VERIFICATION_SUCCESS,
    });
  } catch (error: any) {
    error.status = 500;
    error.message = error.message || messages.INTERNAL_SERVER_ERROR;
    error.code = error.code || messages.INTERNAL_SERVER_ERROR_CODE;
    next(error);
  }
};

export const registrationNewCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newCode = registrationNewCodeSchema.safeParse(req.body);
    if (!newCode.success) {
      return res.status(400).json(newCode.error.issues);
    }

    const existingUser = await db.query.user.findFirst({
      where: eq(user.email, newCode.data.email),
    });

    if (!existingUser) {
      const error = {
        status: 404,
        code: messages.USER_NOT_FOUND_CODE,
        message: messages.USER_NOT_FOUND,
      };
      next(error);
      return;
    }

    await db
      .delete(emailVerification)
      .where(eq(emailVerification.userId, existingUser.id));

    const registrationCode = generateOTP();
    await db.insert(emailVerification).values({
      code: registrationCode,
      userId: existingUser.id,
      verificationType: 'registration',
      email: existingUser.email,
      expires_at: createDate(new TimeSpan(15, 'm')),
    });

    return res.status(200).json({
      code: messages.NEW_CODE_SENT_CODE,
      message: messages.NEW_CODE_SENT,
    });
  } catch (error: any) {
    error.status = 500;
    error.message = error.message || messages.INTERNAL_SERVER_ERROR;
    error.code = error.code || messages.INTERNAL_SERVER_ERROR_CODE;
    next(error);
  }
};
