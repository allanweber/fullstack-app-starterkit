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
