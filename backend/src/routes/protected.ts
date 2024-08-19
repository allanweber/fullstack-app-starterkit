import { NextFunction, Request, Response } from 'express';

export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!res.locals.user || req.headers.cookie === undefined) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  return next();
};
