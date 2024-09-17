import { eq } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';
import db from '../../db';
import {
  emailVerification,
  tenancyPlan,
  userAccounts,
  userProfile,
} from '../../db/schema';
import { messages } from '../../utils/messages';
import {
  createDate,
  generateId,
  generateOTP,
  TimeSpan,
} from '../../utils/randoms';
import { sendActivationEmail } from '../emails/email-service';
import { tenancy } from './../../db/schema/tenancy';
import { user } from './../../db/schema/user';
import { userRoles } from './../../db/schema/user-roles';
import { signupSchema } from './auth.schemas';
import { hashPassword } from './password';
import { issueToken } from './token';

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
    const passwordHash = await hashPassword(saltPassword, password);

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

      await sendActivationEmail(email, registrationCode);

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
