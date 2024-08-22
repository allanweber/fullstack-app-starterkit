import { hash, verify } from '@node-rs/argon2';
import { eq } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import db from '../../db';
import { organization, user, userAccounts, userProfile } from '../../db/schema';
import env from '../../env';
import { loginSchema, signupSchema } from './auth.schemas';

const passwordConfig = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};

export type Payload = {
  email: string;
  role: string;
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

    if (!registeredUser || !registeredUser.email_verified) {
      return res.status(401).json({ message: 'Invalid email or password' });
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
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const profile = await db.query.userProfile.findFirst({
      where: eq(userProfile.userId, registeredUser.id),
    });

    const token = issueToken({ email: registeredUser.email, role: 'user' });

    return res.status(200).json({
      user: { name: profile?.displayName, image: profile?.image },
      token: token,
    });
  } catch (error: any) {
    error.status = 500;
    error.message = error.message || 'Internal Server Error';
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
      return res.status(409).json({ message: 'User already exists' });
    }

    const { email, password } = register.data;
    const saltPassword = password;

    const passwordHash = await hash(password, {
      salt: Buffer.from(saltPassword, 'hex'),
      ...passwordConfig,
    });

    const registeredUser = await db.transaction(async (tx) => {
      const [org] = await tx
        .insert(organization)
        .values({
          name: email,
        })
        .returning();

      const [newUser] = await tx
        .insert(user)
        .values({
          email,
          organizationId: org.id,
          email_verified: false,
        })
        .returning();

      await tx
        .insert(userAccounts)
        .values({
          userId: newUser.id,
          accountType: 'email',
          passwordHash,
          salt: saltPassword,
        })
        .returning();

      await tx
        .insert(userProfile)
        .values({
          userId: newUser.id,
          displayName: email,
          theme: 'light',
          locale: 'en',
        })
        .returning();

      return {
        user: newUser,
        organizationId: org.id,
        displayName: email,
      };
    });

    if (registeredUser.user.email_verified) {
      const profile = await db.query.userProfile.findFirst({
        where: eq(userProfile.userId, registeredUser.user.id),
      });

      const token = issueToken({
        email: registeredUser.user.email,
        role: 'user',
      });
      return res.status(200).json({
        enabled: true,
        user: { name: profile?.displayName, image: profile?.image },
        token: token,
      });
    }

    return res.status(200).json({
      enabled: false,
      message: 'User created successfully. Please verify your email to login',
    });
  } catch (error: any) {
    error.status = 500;
    error.message = error.message || 'Internal Server Error';
    next(error);
  }
};
