import { useMutation } from '@tanstack/react-query';
import { AuthResponse, Login, Register } from '../types/Auth';

export const useSignIn = () => {
  return useMutation({
    mutationFn: async (login: Login): Promise<AuthResponse> => {
      return fetch('/api/v1/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(login),
      }).then((res) => res.json());
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
      }).then((res) => res.json());
    },
  });
};

export const useSignOut = () => {
  return useMutation({
    mutationFn: async () => {
      return fetch('/api/v1/auth/logout', {
        method: 'POST',
      }).then((res) => res.json());
    },
  });
};
