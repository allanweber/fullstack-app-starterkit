import { NextFunction, Request, Response } from 'express';
import { messages } from '../../components/utils/messages';
import { prismaClient } from '../../prisma';

export const getAllTags = async (
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

    const tags = await prismaClient.tag.findMany({
      where: {
        tenancyId,
      },
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
        color: true,
      },
    });

    return res.json(tags);
  } catch (error: any) {
    error.status = 500;
    error.message = error.message || messages.INTERNAL_SERVER_ERROR;
    error.code = error.code || messages.INTERNAL_SERVER_ERROR_CODE;
    next(error);
  }
};
