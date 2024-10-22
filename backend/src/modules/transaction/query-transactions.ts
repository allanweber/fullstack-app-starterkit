import { NextFunction, Request, Response } from 'express';

import { endOfDay, startOfDay } from 'date-fns';
import logger from '../../logger';
import { prismaClient } from '../../prisma';
import { messages } from '../../utils/messages';
import { Paginated, Pagination } from '../paginated';
import { columnFilterSchema } from './schemas';

export const queryTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = columnFilterSchema.safeParse(req.query);
    let { data: search } = result;
    const { success, error } = result;
    if (!success) {
      logger.error('Invalid request', error.errors);
      search = {
        page: 1,
        pageSize: 15,
        sortBy: 'date',
        sortDirection: 'desc',
      };
    }

    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 15;
    const tenancyId = req.user?.tenancyId;
    const sortColumn = search.sortBy || 'date';
    const sortDirection = search.sortDirection || 'desc';

    let conditions = {};

    if (search.description) {
      conditions = {
        description: { contains: search.description, mode: 'insensitive' },
      };
    }

    if (search.account) {
      if (Array.isArray(search.account)) {
        conditions = {
          ...conditions,
          accountId: { in: search.account.map(Number) },
        };
      } else {
        conditions = {
          ...conditions,
          accountId: { equals: search.account },
        };
      }
    }

    if (search.date) {
      if (Array.isArray(search.date)) {
        conditions = {
          ...conditions,
          date: {
            gte: search.date[0],
            lte: search.date[1],
          },
        };
      } else {
        const from = startOfDay(search.date);
        const to = endOfDay(search.date);
        conditions = {
          ...conditions,
          date: {
            gte: from,
            lte: to,
          },
        };
      }
    }

    if (search.amount) {
      if (Array.isArray(search.amount)) {
        conditions = {
          ...conditions,
          amount: {
            gte: search.amount[0],
            lte: search.amount[1],
          },
        };
      } else {
        conditions = {
          ...conditions,
          amount: {
            gte: search.amount,
          },
        };
      }
    }

    if (search.category) {
      if (Array.isArray(search.category)) {
        conditions = {
          ...conditions,
          categoryId: { in: search.category.map(Number) },
        };
      } else {
        conditions = {
          ...conditions,
          categoryId: { equals: search.category },
        };
      }
    }

    if (search.tags) {
      const tags = Array.isArray(search.tags)
        ? search.tags.map(Number)
        : [search.tags as number];

      conditions = {
        ...conditions,
        tags: {
          some: {
            id: {
              in: tags,
            },
          },
        },
      };
    }

    const { data: transactions, count } =
      await prismaClient.transaction.findManyAndCount({
        where: {
          tenancyId,
          ...conditions,
        },
        orderBy: {
          [sortColumn]: sortDirection,
        },
        skip: pageSize * (page - 1),
        take: pageSize,
        select: {
          id: true,
          date: true,
          description: true,
          amount: true,
          account: {
            select: {
              id: true,
              name: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
          tags: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
        },
      });

    return res
      .status(200)
      .json(new Paginated(transactions, new Pagination(pageSize, page, count)));
  } catch (error: any) {
    error.status = 500;
    error.message = error.message || messages.INTERNAL_SERVER_ERROR;
    error.code = error.code || messages.INTERNAL_SERVER_ERROR_CODE;
    next(error);
  }
};
