import { verify } from '@node-rs/argon2';
import { VerificationType } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { sendChangePasswordEmail } from '../../components/emails/email-service';
import { validate } from '../../components/lib/validator';
import { prismaClient } from '../../prisma';
import { messages } from '../../utils/messages';
import {
  createDate,
  generateUUID,
  hashPassword,
  passwordConfig,
  TimeSpan,
} from '../../utils/randoms';
import {
  passwordResetRequestSchema,
  passwordResetSchema,
  passwordResetTokenSchema,
} from './auth.schemas';

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

export const requestPasswordReset = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { body: passwordReset } = await validate({
      req,
      schema: { body: passwordResetRequestSchema },
    });

    const existingUser = await prismaClient.user.findFirst({
      where: {
        email: passwordReset.email,
      },
    });

    if (!existingUser) {
      return res.status(200).json({
        code: messages.RESET_PASSWORD_REQUESTED,
        message: messages.RESET_PASSWORD_REQUESTED_CODE,
      });
    }

    const token = generateUUID();
    await prismaClient.$transaction(async (tx) => {
      await tx.emailVerification.deleteMany({
        where: {
          userId: existingUser.id,
        },
      });

      await tx.emailVerification.create({
        data: {
          code: token,
          userId: existingUser.id,
          type: VerificationType.RESET_PASSWORD,
          email: existingUser.email,
          expiresAt: createDate(new TimeSpan(15, 'm')),
        },
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
    const { body: token } = await validate({
      req,
      schema: { body: passwordResetTokenSchema },
    });

    const resetRequested = await prismaClient.emailVerification.findFirst({
      where: {
        code: token.token,
        type: VerificationType.RESET_PASSWORD,
      },
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
    const { body: passwordReset } = await validate({
      req,
      schema: { body: passwordResetSchema },
    });

    const existingUser = await prismaClient.user.findFirst({
      where: {
        email: passwordReset.email,
      },
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

    const resetRequested = await prismaClient.emailVerification.findFirst({
      where: {
        code: passwordReset.token,
        type: VerificationType.RESET_PASSWORD,
        userId: existingUser.id,
      },
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

    const saltPassword = generateUUID();
    const passwordHash = await hashPassword(
      saltPassword,
      passwordReset.password
    );

    await prismaClient.$transaction(async (tx) => {
      await tx.userAccount.update({
        where: {
          userId: existingUser.id,
        },
        data: {
          passwordHash,
          salt: saltPassword,
        },
      });

      await tx.emailVerification.deleteMany({
        where: {
          userId: existingUser.id,
        },
      });
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
