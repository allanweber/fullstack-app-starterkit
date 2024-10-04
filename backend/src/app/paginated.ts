import { z } from 'zod';

export class Paginated<T> {
  public data: T[];
  public pagination: Pagination;

  constructor(list: T[], pagination: Pagination) {
    this.data = list;
    this.pagination = pagination;
  }
}

export class Pagination implements PaginatedParams {
  public page: number;
  public pageSize: number;
  public totalPages: number;
  public total: number;

  constructor(pageSize: number, page: number, total: number) {
    this.page = page;
    this.pageSize = pageSize;
    this.totalPages = Math.ceil(total / pageSize);
    this.total = total;
  }
}

export interface PaginatedParams {
  pageSize: number;
  page: number;
  total: number;
  totalPages: number;
}

export const paginatedSchema = z.object({
  pageSize: z.string().regex(/^\d+$/).transform(Number).optional(),
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  sortBy: z.string().optional(),
  sortDirection: z.enum(['asc', 'desc']).optional(),
});
