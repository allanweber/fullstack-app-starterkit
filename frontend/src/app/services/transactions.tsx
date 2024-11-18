import { useAuth } from '@/hooks/use-auth';
import { PageRequest, Paginated } from '@/types/paginated';
import { Transaction, TransactionFilters } from '@/types/transaction';
import { useQuery } from '@tanstack/react-query';
import { pageRequestToUrlSearchParams } from './utils/filter-to-url-search-params';
import { responseOrError } from './utils/response-or-error';

export const useTransactions = (
  pageRequest: PageRequest<TransactionFilters>,
) => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: [`transactions-${JSON.stringify(pageRequest)}`],
    queryFn: async (): Promise<Paginated<Transaction>> => {
      const url = ['/api/v1/transactions'];

      const params = pageRequestToUrlSearchParams(pageRequest);

      url.push(`?${params.toString()}`);

      return fetch(url.join(''), {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }).then(responseOrError);
    },
  });
};
