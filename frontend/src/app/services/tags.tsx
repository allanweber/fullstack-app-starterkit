import { useAuth } from '@/hooks/use-auth';
import { Tag } from '@/types/transaction';
import { useQuery } from '@tanstack/react-query';
import { responseOrError } from './response';

export const useTags = () => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: [`tags`],
    queryFn: async (): Promise<Tag[]> => {
      return fetch('/api/v1/tags', {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }).then(responseOrError);
    },
  });
};
