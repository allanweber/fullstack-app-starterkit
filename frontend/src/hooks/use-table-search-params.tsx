import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ZodSchema } from 'zod';

export default function useTableSearchParams(filterSchema: ZodSchema) {
  const [searchParams] = useSearchParams();

  return useMemo(() => {
    const keyValuePairs = Array.from(searchParams.entries()).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: value,
      }),
      {},
    );
    const parsedFilterSchema = filterSchema.safeParse(keyValuePairs);

    const columnsFiltered = Object.entries(parsedFilterSchema.data || {}).map(
      ([key, value]) => ({
        id: key,
        value,
      }),
    );

    const paginationParams = {
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      pageSize: searchParams.get('pageSize')
        ? Number(searchParams.get('pageSize'))
        : 15,
      sortBy: searchParams.get('sortBy') || undefined,
      sortDirection: searchParams.get('sortDirection') || undefined,
    };

    const pageRequest = {
      page: paginationParams.page,
      pageSize: paginationParams.pageSize,
      sortBy: paginationParams.sortBy,
      sortDirection: paginationParams.sortDirection,
      filters:
        parsedFilterSchema.success &&
        Object.keys(parsedFilterSchema.data || {}).length > 0
          ? parsedFilterSchema.data
          : undefined,
    };
    return { pageRequest, paginationParams, columnsFiltered };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);
}
