import { and, desc, eq, sql } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';
import db from '../../db';
import { transactions } from '../../db/schema';
import { messages } from '../../utils/messages';
import { Paginated, Pagination } from '../paginated';
import { columnFilterSchema } from './schemas';

export const queryTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 15;
    const tenancyId = req.user?.tenancyId;
    const conditions = [eq(transactions.tenancyId, tenancyId!)];

    //transforming the query parameters into a key-value pair

    console.log('Date', req.query.date);

    const search = columnFilterSchema.safeParse(req.query);
    console.log('Search', search);

    // if (req.query.account) {
    //   conditions.push(eq(transactions.accountId, Number(req.query.account)));
    // }

    // if (req.query.category) {
    //   conditions.push(eq(transactions.categoryId, Number(req.query.category)));
    // }

    // if (req.query.type) {
    //   conditions.push(
    //     eq(
    //       transactions.type,
    //       req.query.type as 'income' | 'expense' | 'investment'
    //     )
    //   );
    // }

    const trans = await db.query.transactions.findMany({
      where: and(...conditions),
      orderBy: [desc(transactions.date)],
      columns: {
        tenancyId: false,
        created_at: false,
      },
      with: {
        account: {
          columns: {
            tenancyId: false,
            created_at: false,
          },
        },
        category: {
          columns: {
            tenancyId: false,
            created_at: false,
          },
        },
        tags: {
          columns: {
            transactionId: false,
            tagId: false,
          },
          with: {
            tag: {
              columns: {
                tenancyId: false,
                created_at: false,
              },
            },
          },
        },
      },
      limit: pageSize,
      offset: (page - 1) * 100,
    });

    const [{ count }] = await db
      .select({
        count: sql`COUNT(*)`.mapWith(Number).as('count'),
      })
      .from(transactions)
      .where(and(...conditions));

    return res
      .status(200)
      .json(new Paginated(trans, new Pagination(pageSize, page, count)));
  } catch (error: any) {
    error.status = 500;
    error.message = error.message || messages.INTERNAL_SERVER_ERROR;
    error.code = error.code || messages.INTERNAL_SERVER_ERROR_CODE;
    next(error);
  }
};
