import { ARRAY_DELIMITER } from '@/components/data-table/types';

export const filterToUrlSearchParams = (filter: any) => {
  const params = new URLSearchParams();

  Object.entries(filter || {}).forEach(([key, value]) => {
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
