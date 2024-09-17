import { hash, verify } from '@node-rs/argon2';
import { and, eq } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';
import db from '../../db';
import { emailVerification, userAccounts } from '../../db/schema';
import { messages } from '../../utils/messages';
import { createDate, generateId, TimeSpan } from '../../utils/randoms';
import { sendChangePasswordEmail } from '../emails/email-service';
import { user } from './../../db/schema/user';
import {
  passwordResetRequestSchema,
  passwordResetSchema,
  passwordResetTokenSchema,
} from './auth.schemas';

const passwordConfig = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};

export const verifyPassword = async (
  hashed: string,
  salt: string,
  password: string
) => {
  return await verify(hashed, password, {
    salt: Buffer.from(salt, 'hex'),
    ...passwordConfig,
  });
};

export const hashPassword = async (saltPassword: string, password: string) => {
  return await hash(password, {
    salt: Buffer.from(saltPassword, 'hex'),
    ...passwordConfig,
  });
};

export const requestPasswordReset = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const passwordReset = passwordResetRequestSchema.safeParse(req.body);
    if (!passwordReset.success) {
      return res.status(400).json(passwordReset.error.issues);
    }

    const existingUser = await db.query.user.findFirst({
      where: eq(user.email, passwordReset.data.email),
    });

    if (!existingUser) {
      return res.status(200).json({
        code: messages.RESET_PASSWORD_REQUESTED,
        message: messages.RESET_PASSWORD_REQUESTED_CODE,
      });
    }

    const token = generateId();
    await db.transaction(async (tx) => {
      await tx
        .delete(emailVerification)
        .where(eq(emailVerification.userId, existingUser.id));

      await tx.insert(emailVerification).values({
        code: token,
        userId: existingUser.id,
        verificationType: 'reset-password',
        email: existingUser.email,
        expires_at: createDate(new TimeSpan(15, 'm')),
      });

      await sendChangePasswordEmail(existingUser.email, token);
    });

    return res.status(200).json({
      code: messages.RESET_PASSWORD_REQUESTED,
      message: messages.RESET_PASSWORD_REQUESTED_CODE,
    });
  } catch (error: any) {
    error.status = 500;
    error.message = error.message || messages.INTERNAL_SERVER_ERROR;
    error.code = error.code || messages.INTERNAL_SERVER_ERROR_CODE;
    next(error);
  }
};

export const validatePasswordReset = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = passwordResetTokenSchema.safeParse(req.body);
    if (!token.success) {
      return res.status(400).json(token.error.issues);
    }

    const resetRequested = await db.query.emailVerification.findFirst({
      where: and(
        eq(emailVerification.code, token.data.token),
        eq(emailVerification.verificationType, 'reset-password')
      ),
    });

    if (!resetRequested) {
      const error = {
        status: 400,
        code: messages.VERIFICATION_NOT_FOUND_CODE,
        message: messages.VERIFICATION_NOT_FOUND,
      };
      next(error);
      return;
    }

    return res.status(200).json({
      code: messages.VALID_PASSWORD_RESET_REQUEST_CODE,
      message: messages.VALID_PASSWORD_RESET_REQUEST,
    });
  } catch (error: any) {
    error.status = 500;
    error.message = error.message || messages.INTERNAL_SERVER_ERROR;
    error.code = error.code || messages.INTERNAL_SERVER_ERROR_CODE;
    next(error);
  }
};

export const passwordReset = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const passwordReset = passwordResetSchema.safeParse(req.body);
    if (!passwordReset.success) {
      return res.status(400).json(passwordReset.error.issues);
    }

    const existingUser = await db.query.user.findFirst({
      where: eq(user.email, passwordReset.data.email),
    });

    if (!existingUser) {
      const error = {
        status: 400,
        code: messages.INVALID_USER_OR_TOKEN_CODE,
        message: messages.INVALID_USER_OR_TOKEN,
      };
      next(error);
      return;
    }

    const resetRequested = await db.query.emailVerification.findFirst({
      where: and(
        eq(emailVerification.code, passwordReset.data.token),
        eq(emailVerification.verificationType, 'reset-password'),
        eq(emailVerification.userId, existingUser.id)
      ),
    });

    if (!resetRequested) {
      const error = {
        status: 400,
        code: messages.INVALID_USER_OR_TOKEN_CODE,
        message: messages.INVALID_USER_OR_TOKEN,
      };
      next(error);
      return;
    }

    const saltPassword = generateId();
    const passwordHash = await hash(passwordReset.data.password, {
      salt: Buffer.from(saltPassword, 'hex'),
      ...passwordConfig,
    });

    await db.transaction(async (tx) => {
      await tx
        .update(userAccounts)
        .set({
          passwordHash,
          salt: saltPassword,
        })
        .where(eq(userAccounts.userId, existingUser.id));

      await tx
        .delete(emailVerification)
        .where(eq(emailVerification.id, resetRequested.id));
    });

    return res.status(200).json({
      code: messages.PASSWORD_RESET_SUCCESS_CODE,
      message: messages.PASSWORD_RESET_SUCCESS,
    });
  } catch (error: any) {
    error.status = 500;
    error.message = error.message || messages.INTERNAL_SERVER_ERROR;
    error.code = error.code || messages.INTERNAL_SERVER_ERROR_CODE;
    next(error);
  }
};
