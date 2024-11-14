import { useAuth } from '@/hooks/use-auth';
import { Category } from '@/types/transaction';
import { useQuery } from '@tanstack/react-query';
import { responseOrError } from './utils/response-or-error';

export const useCategories = () => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: [`categories`],
    queryFn: async (): Promise<Category[]> => {
      return fetch('/api/v1/categories', {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }).then(responseOrError);
    },
  });
};
