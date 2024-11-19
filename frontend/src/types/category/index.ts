import { ARRAY_DELIMITER } from '@/components/data-table/types';
import { z } from 'zod';

export enum CategoryType {
  Expense = 'EXPENSE',
  Income = 'INCOME',
  Investment = 'INVESTMENT',
}

export interface Category {
  id: number;
  name: string;
  type: string;
}

export const filterSchema = z.object({
  name: z.string().optional(),
  type: z
    .string()
    .refine((value) =>
      Object.values(CategoryType).includes(value as CategoryType),
    )
    .or(
      z
        .string()
        .transform((val) => val.split(ARRAY_DELIMITER))
        .pipe(z.array(z.string())),
    )
    .optional(),
});

export type CategoryFilters = z.infer<typeof filterSchema>;
