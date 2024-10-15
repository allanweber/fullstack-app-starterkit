import { NextFunction, Request, Response } from 'express';

import { sendActivationEmail } from '@/app/emails/email-service';
import { messages } from '@/utils/messages';
import {
  createDate,
  generateOTP,
  generateUUID,
  hashPassword,
  TimeSpan,
} from '@/utils/randoms';

import { signupSchema } from './auth.schemas';

import { prismaClient } from '@/prisma';
import { AccountType, Role, VerificationType } from '@prisma/client';
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

    const existingUser = await prismaClient.user.findFirst({
      where: {
        email: register.data.email,
      },
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
    const saltPassword = generateUUID();
    const passwordHash = await hashPassword(saltPassword, password);
    const registrationCode = generateOTP();

    const registeredUser = await prismaClient.$transaction(async (tx) => {
      const tenancy = await tx.tenancy.create({
        data: {
          name: email,
        },
      });

      await tx.tenancyPlan.create({
        data: {
          tenancyId: tenancy.id,
          isFree: true,
          startsAt: new Date(),
          expiresAt: createDate(new TimeSpan(1, 'y')),
        },
      });

      const user = await tx.user.create({
        data: {
          email,
          tenancyId: tenancy.id,
          emailVerified: false,
        },
      });

      await tx.userAccount.create({
        data: {
          userId: user.id,
          type: AccountType.EMAIL,
          passwordHash,
          salt: saltPassword,
        },
      });

      await tx.userRoles.create({
        data: {
          userId: user.id,
          role: Role.SUPER_USER,
        },
      });

      await tx.userProfile.create({
        data: {
          userId: user.id,
          displayName: email,
          theme: 'light',
          locale: 'en',
        },
      });

      await tx.emailVerification.create({
        data: {
          code: registrationCode,
          userId: user.id,
          type: VerificationType.REGISTRATION,
          email: email,
          expiresAt: createDate(new TimeSpan(15, 'm')),
        },
      });

      await sendActivationEmail(email, registrationCode);

      return {
        user: user,
        tenancyId: tenancy.id,
        displayName: email,
        role: Role.SUPER_USER,
      };
    });

    if (registeredUser.user.emailVerified) {
      const token = issueToken({
        email: registeredUser.user.email,
        userId: registeredUser.user.id,
        roles: [registeredUser.role],
        tenancyId: registeredUser.tenancyId,
      });

      return res.status(200).json({
        enabled: true,
        user: { name: registeredUser.displayName, image: null },
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
