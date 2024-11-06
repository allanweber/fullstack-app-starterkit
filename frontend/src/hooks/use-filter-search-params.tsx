import { useMemo } from 'react';
import useKeyPairSearchParams from './use-key-pair-search-params';

export function useFilterSearchParams() {
  const entries = useKeyPairSearchParams();

  return useMemo(() => {
    const filters = Object.entries(entries)
      .filter(
        ([key]) =>
          key !== 'sortBy' &&
          key !== 'sortDirection' &&
          key !== 'page' &&
          key !== 'pageSize',
      )
      .reduce((acc, [key, value]) => {
        return {
          ...acc,
          [key]: value,
        };
      }, {});

    if (Object.keys(filters).length === 0) {
      return undefined;
    }

    return filters;
  }, [entries]);
}
