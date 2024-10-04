export interface Paginated<T> {
  pagination: PaginatedState;
  data: T[];
}

export interface PaginatedState {
  pageSize: number;
  page: number;
  total: number;
  totalPages: number;
}

export interface PageRequest<T> {
  page: number;
  pageSize: number;
  sortBy?: string | undefined;
  sortDirection?: string | undefined;
  filters?: T | undefined;
}
