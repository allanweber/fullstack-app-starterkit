import { z } from 'zod';

export interface Tags {
  tag: Tag;
}

export interface Tag {
  id: number;
  name: string;
  color: string;
}

export const filterSchema = z.object({
  name: z.string().optional(),
  color: z.string().optional(),
});

export type TagFilters = z.infer<typeof filterSchema>;
