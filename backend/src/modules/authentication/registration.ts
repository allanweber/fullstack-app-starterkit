import { VerificationType } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { sendActivationEmail } from '../../components/emails/email-service';
import { validate } from '../../components/lib/validator';
import {
  createDate,
  isWithinExpirationDate,
  TimeSpan,
} from '../../components/utils/date-time';
import { messages } from '../../components/utils/messages';
import { generateOTP } from '../../components/utils/password';
import { prismaClient } from '../../prisma';
import {
  registrationNewCodeSchema,
  verifyRegistrationSchema,
} from './auth.schemas';

export const verifyRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { body: register } = await validate({
      req,
      schema: { body: verifyRegistrationSchema },
    });

    const verification = await prismaClient.emailVerification.findFirst({
      where: {
        code: register.code,
        type: VerificationType.REGISTRATION,
      },
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

    if (!isWithinExpirationDate(verification.expiresAt)) {
      const error = {
        status: 400,
        code: messages.VERIFICATION_EXPIRED_CODE,
        message: messages.VERIFICATION_EXPIRED,
      };
      next(error);
      return;
    }

    await prismaClient.$transaction(async (tx) => {
      await tx.user.update({
        where: {
          id: verification.userId,
        },
        data: {
          emailVerified: true,
        },
      });

      await tx.emailVerification.delete({
        where: {
          userId: verification.userId,
        },
      });
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
    const { body: newCode } = await validate({
      req,
      schema: { body: registrationNewCodeSchema },
    });

    const existingUser = await prismaClient.user.findFirst({
      where: {
        email: newCode.email,
      },
    });

    if (!existingUser) {
      return res.status(200).json({
        code: messages.NEW_CODE_SENT_CODE,
        message: messages.NEW_CODE_SENT,
      });
    }

    await prismaClient.$transaction(async (tx) => {
      await tx.emailVerification.deleteMany({
        where: {
          userId: existingUser.id,
        },
      });

      const registrationCode = generateOTP();
      await tx.emailVerification.create({
        data: {
          code: registrationCode,
          userId: existingUser.id,
          type: VerificationType.REGISTRATION,
          email: existingUser.email,
          expiresAt: createDate(new TimeSpan(15, 'm')),
        },
      });

      await sendActivationEmail(existingUser.email, registrationCode);
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
