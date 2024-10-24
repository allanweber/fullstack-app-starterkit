import { NextFunction, Request, Response } from 'express';
import { messages } from '../../components/utils/messages';
import { prismaClient } from '../../prisma';

export const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tenancyId = req.user?.tenancyId;

    if (!tenancyId) {
      const error: any = new Error(messages.UNAUTHORIZED);
      error.status = 401;
      error.code = messages.UNAUTHORIZED_CODE;
      throw error;
    }

    const categories = await prismaClient.category.findMany({
      where: {
        tenancyId,
      },
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
        type: true,
      },
    });

    return res.json(categories);
  } catch (error: any) {
    error.status = 500;
    error.message = error.message || messages.INTERNAL_SERVER_ERROR;
    error.code = error.code || messages.INTERNAL_SERVER_ERROR_CODE;
    next(error);
  }
};
