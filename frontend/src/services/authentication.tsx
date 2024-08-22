import { useMutation } from '@tanstack/react-query';
import { AuthResponse, Login, Register } from '../types/Auth';
import { responseOrError } from './response';

export const useSignIn = () => {
  return useMutation({
    mutationFn: async (login: Login): Promise<AuthResponse> => {
      return fetch('/api/v1/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(login),
      }).then(responseOrError);
    },
  });
};

export const useSignUp = () => {
  return useMutation({
    mutationFn: async (register: Register): Promise<AuthResponse> => {
      return fetch('/api/v1/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(register),
      }).then(responseOrError);
    },
  });
};
