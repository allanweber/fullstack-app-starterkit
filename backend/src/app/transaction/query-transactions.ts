import { endOfDay, startOfDay } from 'date-fns';
import {
  and,
  asc,
  between,
  desc,
  eq,
  gte,
  inArray,
  like,
  sql,
} from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';
import db from '../../db';
import { transactions } from '../../db/schema';
import logger from '../../logger';
import { messages } from '../../utils/messages';
import { Paginated, Pagination } from '../paginated';
import { columnFilterSchema } from './schemas';

export const queryTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let search = columnFilterSchema.safeParse(req.query);
    if (!search.success) {
      logger.error('Invalid request', search.error.errors);
      search = columnFilterSchema.safeParse({
        page: 1,
        pageSize: 15,
        sortBy: 'date',
        sortDirection: 'desc',
      });
    }

    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 15;
    const tenancyId = req.user?.tenancyId;
    const conditions = [eq(transactions.tenancyId, tenancyId!)];

    const sortColumn = search.data?.sortBy || 'date';
    const orderBy =
      search.data?.sortDirection === 'asc'
        ? [asc(sql.identifier(sortColumn))]
        : [desc(sql.identifier(sortColumn))];

    if (search.data?.description) {
      conditions.push(
        like(transactions.description, `%${search.data.description}%`)
      );
    }

    if (search.data?.account) {
      if (Array.isArray(search.data.account)) {
        conditions.push(
          inArray(transactions.accountId, search.data.account.map(Number))
        );
      } else {
        conditions.push(eq(transactions.accountId, search.data.account));
      }
    }

    if (search.data?.date) {
      if (Array.isArray(search.data.date)) {
        conditions.push(
          between(
            transactions.date,
            search.data.date[0].getTime(),
            search.data.date[1].getTime()
          )
        );
      } else {
        const from = startOfDay(search.data.date);
        const to = endOfDay(search.data.date);
        conditions.push(
          between(transactions.date, from.getTime(), to.getTime())
        );
      }
    }

    if (search.data?.amount) {
      if (Array.isArray(search.data.amount)) {
        conditions.push(
          between(
            transactions.amount,
            search.data.amount[0],
            search.data.amount[1]
          )
        );
      } else {
        conditions.push(gte(transactions.amount, search.data.amount));
      }
    }

    if (search.data?.category) {
      if (Array.isArray(search.data.category)) {
        conditions.push(
          inArray(transactions.categoryId, search.data.category.map(Number))
        );
      } else {
        conditions.push(eq(transactions.categoryId, search.data.category));
      }
    }

    if (search.data?.tags) {
      const tags = Array.isArray(search.data.tags)
        ? search.data.tags.map(Number)
        : [search.data.tags as number];

      conditions.push(
        sql`EXISTS (SELECT 1 FROM transactions_tags WHERE transactions_tags.transaction_id = transactions.id AND transactions_tags.tag_id IN ${tags})`
      );
    }

    const trans = await db.query.transactions.findMany({
      where: and(...conditions),
      orderBy,
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
      offset: (page - 1) * pageSize,
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
