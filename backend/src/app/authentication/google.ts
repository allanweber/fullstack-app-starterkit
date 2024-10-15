import { prismaClient } from '@/prisma';
import { AccountType, Role } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../../logger';
import { messages } from '../../utils/messages';
import { createDate, TimeSpan } from '../../utils/randoms';
import { googleSigninSchema, GoogleUser } from './auth.schemas';
import { issueToken } from './token';

export const authGoogle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const googleSignin = googleSigninSchema.safeParse(req.body);
    if (!googleSignin.success) {
      return res.status(400).json(googleSignin.error.issues);
    }

    const googleData = jwt.decode(googleSignin.data.code) as GoogleUser;

    if (!googleData) {
      logger.error('Google Signin: Invalid token');
      const error = {
        status: 401,
        code: messages.INVALID_CREDENTIALS_CODE,
        message: messages.INVALID_CREDENTIALS,
      };
      next(error);
    }

    if (!googleData.email_verified) {
      logger.error('Google Signin: Email not verified');
      const error = {
        status: 401,
        code: messages.INVALID_CREDENTIALS_CODE,
        message: messages.INVALID_CREDENTIALS,
      };
      next(error);
    }

    const registeredUser = await prismaClient.user.findFirst({
      where: {
        email: googleData.email,
      },
    });

    let signInUser = null;
    if (!registeredUser) {
      signInUser = await prismaClient.$transaction(async (tx) => {
        const tenancy = await tx.tenancy.create({
          data: {
            name: googleData.email,
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

        const newUser = await tx.user.create({
          data: {
            email: googleData.email,
            tenancyId: tenancy.id,
            emailVerified: true,
          },
        });

        await tx.userAccount.create({
          data: {
            userId: newUser.id,
            type: AccountType.GOOGLE,
            googleId: googleData.sub,
          },
        });

        const profile = await tx.userProfile.create({
          data: {
            userId: newUser.id,
            displayName: googleData.given_name || googleData.email,
            firstName: googleData.given_name,
            lastName: googleData.family_name,
            image: googleData.picture,
            theme: 'light',
            locale: 'en',
          },
        });

        await tx.userRoles.create({
          data: {
            userId: newUser.id,
            role: Role.SUPER_USER,
          },
        });

        return {
          user: newUser,
          tenancyId: tenancy.id,
          displayName: googleData.email,
          role: [Role.SUPER_USER],
          profile,
        };
      });
    } else {
      const userAccount = await prismaClient.userAccount.findFirst({
        where: {
          userId: registeredUser.id,
        },
      });

      if (!userAccount) {
        logger.error('Account not found');
        const error = {
          status: 401,
          code: messages.INVALID_CREDENTIALS_CODE,
          message: messages.INVALID_CREDENTIALS,
        };
        next(error);
      }

      if (userAccount?.type !== AccountType.GOOGLE) {
        logger.info('Transforming email account to google account');
        await prismaClient.$transaction(async (tx) => {
          await tx.userAccount.update({
            where: {
              userId: registeredUser.id,
            },
            data: {
              type: AccountType.GOOGLE,
              googleId: googleData.sub,
              salt: null,
              passwordHash: null,
            },
          });

          await tx.userProfile.update({
            where: {
              userId: registeredUser.id,
            },
            data: {
              displayName: googleData.email,
              image: googleData.picture,
            },
          });
        });
      }

      const profile = await prismaClient.userProfile.findFirst({
        where: {
          userId: registeredUser.id,
        },
      });

      const userRoles = await prismaClient.userRoles.findMany({
        where: {
          userId: registeredUser.id,
        },
      });

      signInUser = {
        user: registeredUser,
        tenancyId: registeredUser.tenancyId,
        displayName: googleData.email,
        role: userRoles.map((role) => role.role),
        profile,
      };
    }

    const token = issueToken({
      email: signInUser.user.email,
      roles: signInUser.role.map((role) => role.toString()),
      userId: signInUser.user.id,
      tenancyId: signInUser.tenancyId,
    });

    return res.status(200).json({
      user: {
        name: signInUser.profile?.displayName,
        image: signInUser.profile?.image,
      },
      token: token,
    });
  } catch (error: any) {
    error.status = 500;
    error.message = error.message || messages.INTERNAL_SERVER_ERROR;
    error.code = error.code || messages.INTERNAL_SERVER_ERROR_CODE;
    next(error);
  }
};
