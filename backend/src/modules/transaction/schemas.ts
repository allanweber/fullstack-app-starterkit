import { TransactionType } from '@prisma/client';
import { z } from 'zod';
import { paginatedSchema } from '../../components/types/paginated';
import { ARRAY_DELIMITER } from '../../components/types/search';

export const columnFilterSchema = paginatedSchema.extend({
  date: z.coerce
    .number()
    .pipe(z.coerce.date())
    .or(
      z
        .string()
        .transform((val) => val.split(ARRAY_DELIMITER).map(Number))
        .pipe(z.coerce.date().array())
    )
    .optional(),
  amount: z.coerce
    .number()
    .or(
      z
        .string()
        .transform((val) => val.split(ARRAY_DELIMITER))
        .pipe(z.coerce.number().array().length(2))
    )
    .optional(),
  category: z
    .string()
    .transform((val) => val.split(ARRAY_DELIMITER))
    .pipe(z.array(z.string()))
    .optional(),
  account: z
    .string()
    .transform((val) => val.split(ARRAY_DELIMITER))
    .pipe(z.array(z.string()))
    .optional(),
  tags: z
    .string()
    .transform((val) => val.split(ARRAY_DELIMITER))
    .pipe(z.array(z.string()))
    .optional(),
  description: z.string().optional(),
  type: z
    .string()
    .refine((value) =>
      [
        TransactionType.EXPENSE.toString(),
        TransactionType.INCOME.toString(),
        TransactionType.INVESTMENT.toString(),
      ].includes(value)
    )
    .optional(),
});
