import { eq } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';
import db from '../../db';
import { userAccounts, userProfile } from '../../db/schema';
import { messages } from '../../utils/messages';
import { user } from './../../db/schema/user';
import { userRoles } from './../../db/schema/user-roles';
import { loginSchema } from './auth.schemas';
import { verifyPassword } from './password';
import { issueToken } from './token';

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

    const error401 = {
      status: 401,
      code: messages.INVALID_CREDENTIALS_CODE,
      message: messages.INVALID_CREDENTIALS,
    };

    if (!registeredUser || !registeredUser.email_verified) {
      next(error401);
      return;
    }

    const userAccount = await db.query.userAccounts.findFirst({
      where: eq(userAccounts.userId, registeredUser.id),
    });

    if (!userAccount) {
      return registeredUser.email_verified;
    }

    if (userAccount.accountType === 'email') {
      const validPassword = await verifyPassword(
        userAccount.passwordHash!,
        userAccount.salt!,
        login.data.password
      );
      if (!validPassword) {
        next(error401);
        return;
      }
    } else {
      next(error401);
      return;
    }

    const profile = await db.query.userProfile.findFirst({
      where: eq(userProfile.userId, registeredUser.id),
    });

    const userRole = await db.query.userRoles.findMany({
      where: eq(userRoles.userId, registeredUser.id),
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
    error.status = 500;
    error.message = error.message || messages.INTERNAL_SERVER_ERROR;
    error.code = error.code || messages.INTERNAL_SERVER_ERROR_CODE;
    next(error);
  }
};
