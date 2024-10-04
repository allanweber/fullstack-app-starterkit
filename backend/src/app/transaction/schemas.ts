import { z } from 'zod';
import { ARRAY_DELIMITER } from '../../utils/types';
import { paginatedSchema } from '../paginated';

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
    .refine((value) => ['Expense', 'Income'].includes(value))
    .optional(),
});
