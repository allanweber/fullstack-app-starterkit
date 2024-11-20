import { z } from 'zod';

export interface Account {
  id: number;
  name: string;
}

export const filterSchema = z.object({
  name: z.string().optional(),
});

export type AccountFilters = z.infer<typeof filterSchema>;
