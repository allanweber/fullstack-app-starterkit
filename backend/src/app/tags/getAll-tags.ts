import { eq } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';
import db from '../../db';
import { tag } from '../../db/schema';
import { messages } from '../../utils/messages';

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

    const tags = await db.query.tag.findMany({
      where: eq(tag.tenancyId, tenancyId),
      orderBy: [tag.name],
      columns: {
        tenancyId: false,
        created_at: false,
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
