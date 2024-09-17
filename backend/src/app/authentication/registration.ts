import { and, eq } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';
import db from '../../db';
import { emailVerification } from '../../db/schema';
import { messages } from '../../utils/messages';
import {
  createDate,
  generateOTP,
  isWithinExpirationDate,
  TimeSpan,
} from '../../utils/randoms';
import { sendActivationEmail } from '../emails/email-service';
import { user } from './../../db/schema/user';
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
    const register = verifyRegistrationSchema.safeParse(req.body);
    if (!register.success) {
      return res.status(400).json(register.error.issues);
    }

    const verification = await db.query.emailVerification.findFirst({
      where: and(
        eq(emailVerification.code, register.data.code),
        eq(emailVerification.verificationType, 'registration')
      ),
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
      return res.status(200).json({
        code: messages.NEW_CODE_SENT_CODE,
        message: messages.NEW_CODE_SENT,
      });
    }

    await db.transaction(async (tx) => {
      await tx
        .delete(emailVerification)
        .where(eq(emailVerification.userId, existingUser.id));

      const registrationCode = generateOTP();
      await tx.insert(emailVerification).values({
        code: registrationCode,
        userId: existingUser.id,
        verificationType: 'registration',
        email: existingUser.email,
        expires_at: createDate(new TimeSpan(15, 'm')),
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
