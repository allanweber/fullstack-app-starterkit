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
    const sortColumn = search.data?.sortBy || 'date';
    const sortDirection = search.data?.sortDirection || 'desc';

    let conditions = {};

    if (search.data?.description) {
      conditions = {
        description: { contains: search.data.description, mode: 'insensitive' },
      };
    }

    if (search.data?.account) {
      if (Array.isArray(search.data.account)) {
        conditions = {
          ...conditions,
          accountId: { in: search.data.account.map(Number) },
        };
      } else {
        conditions = {
          ...conditions,
          accountId: { equals: search.data.account },
        };
      }
    }

    if (search.data?.date) {
      if (Array.isArray(search.data.date)) {
        conditions = {
          ...conditions,
          date: {
            gte: search.data.date[0],
            lte: search.data.date[1],
          },
        };
      } else {
        const from = startOfDay(search.data.date);
        const to = endOfDay(search.data.date);
        conditions = {
          ...conditions,
          date: {
            gte: from,
            lte: to,
          },
        };
      }
    }

    if (search.data?.amount) {
      if (Array.isArray(search.data.amount)) {
        conditions = {
          ...conditions,
          amount: {
            gte: search.data.amount[0],
            lte: search.data.amount[1],
          },
        };
      } else {
        conditions = {
          ...conditions,
          amount: {
            gte: search.data.amount,
          },
        };
      }
    }

    if (search.data?.category) {
      if (Array.isArray(search.data.category)) {
        conditions = {
          ...conditions,
          categoryId: { in: search.data.category.map(Number) },
        };
      } else {
        conditions = {
          ...conditions,
          categoryId: { equals: search.data.category },
        };
      }
    }

    if (search.data?.tags) {
      const tags = Array.isArray(search.data.tags)
        ? search.data.tags.map(Number)
        : [search.data.tags as number];

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

    const transactions = await prismaClient.transaction.findMany({
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

    const counter = await prismaClient.transaction.count({
      where: {
        tenancyId,
        ...conditions,
      },
    });

    return res
      .status(200)
      .json(
        new Paginated(transactions, new Pagination(pageSize, page, counter))
      );
  } catch (error: any) {
    error.status = 500;
    error.message = error.message || messages.INTERNAL_SERVER_ERROR;
    error.code = error.code || messages.INTERNAL_SERVER_ERROR_CODE;
    next(error);
  }
};
