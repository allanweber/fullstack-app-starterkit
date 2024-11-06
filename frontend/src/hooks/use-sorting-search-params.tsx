import { useMemo } from 'react';
import useKeyPairSearchParams from './use-key-pair-search-params';

export function useSortingSearchParams() {
  const entries = useKeyPairSearchParams();

  return useMemo(() => {
    const sorting = Object.entries(entries)
      .filter(([key]) => key === 'sortBy' || key === 'sortDirection')
      .reduce((acc, [key, value]) => {
        return {
          ...acc,
          [key]: value,
        };
      }, {});

    if (Object.keys(sorting).length === 0) {
      return undefined;
    }

    return sorting;
  }, [entries]);
}
