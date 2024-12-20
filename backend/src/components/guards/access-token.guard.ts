import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import env from '../../env';
import { Payload } from '../types/request';
import { messages } from '../utils/messages';

const error = {
  status: 401,
  message: messages.UNAUTHORIZED,
  code: messages.UNAUTHORIZED_CODE,
};

const TOKEN_PREFIX = 'Bearer ';

export const accessTokenGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers['authorization'];
  if (!token) {
    next(error);
    return;
  }

  if (!token.startsWith(TOKEN_PREFIX)) {
    next(error);
    return;
  }

  const parsedToken = token.slice(TOKEN_PREFIX.length, token.length);

  return jwt.verify(parsedToken, env.JWT_SECRET, (err, decoded) => {
    if (err) {
      error.status = 401;
      error.message = error.message || messages.INTERNAL_SERVER_ERROR;
      error.code = error.code || messages.INTERNAL_SERVER_ERROR_CODE;
      next(error);
    }
    req.user = decoded as Payload;
    next();
  });
};
