import { ARRAY_DELIMITER } from '@/components/data-table/types';
import { PageRequest } from '@/types/paginated';

export const pageRequestToUrlSearchParams = <TBody>(
  pageRequest: PageRequest<TBody>,
) => {
  const params = new URLSearchParams();

  params.append('page', `${pageRequest.page}`);
  params.append('pageSize', `${pageRequest.pageSize}`);
  params.append('sortBy', pageRequest.sortBy || 'date');
  params.append('sortDirection', pageRequest.sortDirection || 'desc');

  Object.entries(pageRequest.filters || {}).forEach(([key, value]) => {
    if (value instanceof Date) {
      params.append(key, value.getTime().toString());
    } else if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      params.append(key, value.toString());
    }

    if (Array.isArray(value)) {
      params.set(
        key,
        value
          .map((v: string | number | Date) => {
            if (v instanceof Date) {
              return v.getTime().toString();
            }
            return v.toString();
          })
          .join(ARRAY_DELIMITER),
      );
    }
  });
  return params;
};
