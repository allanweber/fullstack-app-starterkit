import { eq } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import db from '../../db';
import { tenancyPlan, userAccounts, userProfile } from '../../db/schema';
import logger from '../../logger';
import { messages } from '../../utils/messages';
import { createDate, generateId, TimeSpan } from '../../utils/randoms';
import { tenancy } from './../../db/schema/tenancy';
import { user } from './../../db/schema/user';
import { userRoles } from './../../db/schema/user-roles';
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

    const registeredUser = await db.query.user.findFirst({
      where: eq(user.email, googleData.email),
    });

    let signInUser = null;
    if (!registeredUser) {
      const tenancyId = generateId();
      const userId = generateId();
      signInUser = await db.transaction(async (tx) => {
        await tx.insert(tenancy).values({
          id: tenancyId,
          name: googleData.email,
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
            email: googleData.email,
            tenancyId,
            email_verified: true,
          })
          .returning();

        await tx.insert(userAccounts).values({
          userId,
          accountType: 'google',
          googleId: googleData.sub,
        });

        const [profile] = await tx
          .insert(userProfile)
          .values({
            userId,
            displayName: googleData.email,
            image: googleData.picture,
            theme: 'light',
            locale: 'en',
          })
          .returning();

        await tx.insert(userRoles).values({
          userId,
          role: 'super-user',
        });

        return {
          user: newUser,
          tenancyId,
          displayName: googleData.email,
          role: 'super-user',
          profile,
        };
      });
    } else {
      const userAccount = await db.query.userAccounts.findFirst({
        where: eq(userAccounts.userId, registeredUser.id),
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

      if (userAccount?.accountType !== 'google') {
        logger.info('Transforming email account to google account');
        await db.transaction(async (tx) => {
          await tx
            .update(userAccounts)
            .set({
              accountType: 'google',
              googleId: googleData.sub,
              salt: null,
              passwordHash: null,
            })
            .where(eq(userAccounts.userId, registeredUser.id));

          await tx
            .update(userProfile)
            .set({
              displayName: googleData.email,
              image: googleData.picture,
            })
            .where(eq(userProfile.userId, registeredUser.id));

          await tx
            .update(userRoles)
            .set({
              role: 'super-user',
            })
            .where(eq(userRoles.userId, registeredUser.id));
        });
      }

      const profile = await db.query.userProfile.findFirst({
        where: eq(userProfile.userId, registeredUser.id),
      });

      signInUser = {
        user: registeredUser,
        tenancyId: registeredUser.tenancyId,
        displayName: googleData.email,
        role: 'super-user',
        profile,
      };
    }

    const token = issueToken({
      email: signInUser.user.email,
      roles: [signInUser.role],
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
