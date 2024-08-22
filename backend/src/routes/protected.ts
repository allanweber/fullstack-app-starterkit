import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Payload } from '../app/authentication';
import env from '../env';
import { messages } from '../utils/messages';

const error = {
  status: 401,
  message: messages.UNAUTHORIZED,
  code: messages.UNAUTHORIZED_CODE,
};

const TOKEN_PREFIX = 'Bearer ';

export const protectRoute = async (
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
      error.message = err.message || 'Internal Server Error';
      error.code = err.name || 'INTERNAL_SERVER_ERROR';
      next(error);
    }
    req.user = decoded as Payload;
    next();
  });
};
