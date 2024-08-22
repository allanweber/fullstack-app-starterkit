import { Request, Response } from 'express';
import db from '../../db';
import { newsletter } from '../../db/schema';
import { insertNewsletterSchema } from '../../db/schema/newsletter';

export const getNewsletter = async (req: Request, res: Response) => {
  const news = await db.select().from(newsletter);
  res.json(news);
};

export const postNewsletter = async (req: Request, res: Response) => {
  const insert = insertNewsletterSchema.safeParse(req.body);
  if (!insert.success) {
    return res.status(400).json(insert.error.issues);
  }

  const [news] = await db.insert(newsletter).values(insert.data).returning();

  res.json(news);
};
