import {
  ARRAY_DELIMITER,
  RANGE_DELIMITER,
  SLIDER_DELIMITER,
} from '@/components/data-table/types';
import { z } from 'zod';

export interface Transaction {
  id: number;
  accountId: number;
  date: string;
  amount: number;
  categoryId: number;
  type: string;
  description: string;
  account: Account;
  category: Category;
  tags: Tags[];
}

export interface Account {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
  type: string;
}

export interface Tags {
  tag: Tag;
}

export interface Tag {
  id: number;
  name: string;
  color: string;
}

export const filterSchema = z.object({
  date: z.coerce
    .number()
    .pipe(z.coerce.date())
    .or(
      z
        .string()
        .transform((val) => val.split(RANGE_DELIMITER).map(Number))
        .pipe(z.coerce.date().array()),
    )
    .optional(),
  amount: z.coerce
    .number()
    .or(
      z
        .string()
        .transform((val) => val.split(SLIDER_DELIMITER))
        .pipe(z.coerce.number().array().length(2)),
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

export type TransactionFilters = z.infer<typeof filterSchema>;
