import { useAuth } from '@/hooks/use-auth';
import { Account } from '@/types/transaction';
import { useQuery } from '@tanstack/react-query';
import { responseOrError } from './utils/response-or-error';

export const useAccounts = () => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: [`accounts`],
    queryFn: async (): Promise<Account[]> => {
      return fetch('/api/v1/accounts', {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }).then(responseOrError);
    },
  });
};
