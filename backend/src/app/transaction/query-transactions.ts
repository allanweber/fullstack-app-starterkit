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
import {
  account,
  category,
  tag,
  transactions,
  transactionsTag,
} from '../../db/schema';
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
        ? asc(sql.identifier(sortColumn))
        : desc(sql.identifier(sortColumn));

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

    const transactionsRows = await db
      .select({
        id: transactions.id,
        date: transactions.date,
        amount: transactions.amount,
        description: transactions.description,
        type: transactions.type,
        account: {
          id: account.id,
          name: account.name,
        },
        category: {
          id: category.id,
          name: category.name,
          type: category.type,
        },
        count: sql<number>`count(*) over()`,
      })
      .from(transactions)
      .innerJoin(account, eq(transactions.accountId, account.id))
      .innerJoin(category, eq(transactions.categoryId, category.id))
      .orderBy(orderBy)
      .where(and(...conditions))
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    const tags = await db
      .select({
        transactionId: transactionsTag.transactionId,
        tagId: transactionsTag.tagId,
        name: tag.name,
        color: tag.color,
      })
      .from(transactionsTag)
      .innerJoin(tag, eq(transactionsTag.tagId, tag.id))
      .where(
        inArray(
          transactionsTag.transactionId,
          transactionsRows.map((t) => t.id)
        )
      );

    const tagsMap = tags.reduce((acc, tag) => {
      if (!acc[tag.transactionId]) {
        acc[tag.transactionId] = [];
      }
      acc[tag.transactionId].push({
        id: tag.tagId,
        name: tag.name,
        color: tag.color,
      });
      return acc;
    }, {} as Record<number, any[]>);

    const result = transactionsRows.map((t) => ({
      ...Object.fromEntries(
        Object.entries(t).filter(([key]) => key !== 'count')
      ),
      tags: tagsMap[t.id] || [],
    }));

    const counter = transactionsRows.length > 0 ? transactionsRows[0].count : 0;

    return res
      .status(200)
      .json(new Paginated(result, new Pagination(pageSize, page, counter)));
  } catch (error: any) {
    error.status = 500;
    error.message = error.message || messages.INTERNAL_SERVER_ERROR;
    error.code = error.code || messages.INTERNAL_SERVER_ERROR_CODE;
    next(error);
  }
};
