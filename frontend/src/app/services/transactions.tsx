import { ARRAY_DELIMITER } from '@/components/data-table/types';
import { useAuth } from '@/hooks/use-auth';
import { PageRequest, Paginated } from '@/types/paginated';
import { Transaction, TransactionFilters } from '@/types/transaction';
import { useQuery } from '@tanstack/react-query';
import { responseOrError } from './response';

export const useTransactions = (
  pageRequest: PageRequest<TransactionFilters>,
) => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: [`transactions-${JSON.stringify(pageRequest)}`],
    queryFn: async (): Promise<Paginated<Transaction>> => {
      const url = ['/api/v1/transactions'];

      const params = new URLSearchParams();
      params.append('page', `${pageRequest.page}`);
      params.append('pageSize', `${pageRequest.pageSize}`);
      params.append('sortBy', pageRequest.sortBy || 'date');
      params.append('sortDirection', pageRequest.sortDirection || 'desc');

      if (pageRequest.filters) {
        Object.entries(pageRequest.filters).forEach(([key, value]) => {
          if (value instanceof Date) {
            params.append(key, value.getTime().toString());
          } else {
            params.append(key, value.toString());
          }
          if (Array.isArray(value)) {
            params.set(
              key,
              value
                .map((v) => {
                  if (v instanceof Date) {
                    return v.getTime().toString();
                  }
                  return v.toString();
                })
                .join(ARRAY_DELIMITER),
            );
          }
        });
      }
      url.push(`?${params.toString()}`);

      return fetch(url.join(''), {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }).then(responseOrError);
    },
  });
};
