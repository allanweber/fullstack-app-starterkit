export interface Paginated<T> {
  pagination: PaginatedParams;
  data: T[];
}

export interface PaginatedParams {
  pageSize: number;
  page: number;
  total: number;
  totalPages: number;
}

export interface PageRequest<T> {
  page: number;
  pageSize: number;
  filters: T | undefined;
}
