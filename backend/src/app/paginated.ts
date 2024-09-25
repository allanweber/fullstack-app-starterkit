export class Paginated<T> {
  public pagination: Pagination;

  public data: T[];

  constructor(list: T[], pagination: Pagination) {
    this.data = list;
    this.pagination = pagination;
  }
}

export class Pagination implements PaginatedParams {
  public pageSize: number;
  public page: number;
  public total: number;
  public totalPages: number;

  constructor(pageSize: number, page: number, total: number) {
    this.page = page;
    this.pageSize = pageSize;
    this.total = total;
    this.totalPages = Math.ceil(total / pageSize);
  }
}

export interface PaginatedParams {
  pageSize: number;
  page: number;
  total: number;
  totalPages: number;
}
