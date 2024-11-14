import { ContactData } from '@/types/landing';
import { useMutation } from '@tanstack/react-query';
import { responseOrError } from './utils/response-or-error';

export const useSendContact = () => {
  return useMutation({
    mutationFn: async (contact: ContactData): Promise<any> => {
      return fetch('/api/v1/landing/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contact),
      }).then(responseOrError);
    },
  });
};
