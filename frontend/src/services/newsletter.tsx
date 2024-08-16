import { queryOptions } from '@tanstack/react-query';

export const queryNewsletters = () =>
  queryOptions({
    queryKey: ['newsletters'],
    queryFn: () => fetch('/api/v1/newsletter').then((res) => res.json()),
  });
