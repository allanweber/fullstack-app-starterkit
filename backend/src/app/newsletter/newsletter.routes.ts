import { Request, Response, Router } from 'express';
import db from '../../db';
import { newsletter } from '../../db/schema';
import { insertNewsletterSchema } from '../../db/schema/newsletter';
import { protectRoute } from '../../routes/protected';
import { Route } from '../../routes/route';

export class NewsletterRoutes extends Route {
  constructor(app: Router) {
    super(app, 'newsletter');
    this.route.get('/', [protectRoute], this.getNewsletter);
    this.route.post('/', [protectRoute], this.postNewsletter);
  }

  private getNewsletter = async (req: Request, res: Response) => {
    const news = await db.select().from(newsletter);
    res.json(news);
  };

  private postNewsletter = async (req: Request, res: Response) => {
    const insert = insertNewsletterSchema.safeParse(req.body);
    if (!insert.success) {
      return res.status(400).json(insert.error.issues);
    }

    const [news] = await db.insert(newsletter).values(insert.data).returning();

    res.json(news);
  };
}
