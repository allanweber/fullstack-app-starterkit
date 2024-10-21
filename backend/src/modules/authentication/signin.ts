import { AccountType } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { validate } from '../../components/lib/validator';
import logger from '../../logger';
import { prismaClient } from '../../prisma';
import { messages } from '../../utils/messages';
import { loginSchema } from './auth.schemas';
import { verifyPassword } from './password';
import { issueToken } from './token';

export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { body: login } = await validate({
      req,
      schema: { body: loginSchema },
    });

    const registeredUser = await prismaClient.user.findFirst({
      where: {
        email: login.email,
      },
    });

    const error401 = {
      status: 401,
      code: messages.INVALID_CREDENTIALS_CODE,
      message: messages.INVALID_CREDENTIALS,
    };

    if (!registeredUser || !registeredUser.emailVerified) {
      logger.error('User not found or email not verified');
      next(error401);
      return;
    }

    const userAccount = await prismaClient.userAccount.findFirst({
      where: {
        userId: registeredUser.id,
      },
    });

    if (!userAccount) {
      logger.error('User account not found');
      next(error401);
      return;
    }

    if (AccountType.EMAIL === userAccount.type) {
      const validPassword = await verifyPassword(
        userAccount.passwordHash!,
        userAccount.salt!,
        login.password
      );

      if (!validPassword) {
        next(error401);
        return;
      }
    } else {
      next(error401);
      return;
    }

    const profile = await prismaClient.userProfile.findFirst({
      where: {
        userId: registeredUser.id,
      },
    });

    const userRole = await prismaClient.userRoles.findMany({
      where: {
        userId: registeredUser.id,
      },
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
    next(error);
  }
};
