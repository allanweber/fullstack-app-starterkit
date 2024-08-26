import { useMutation, useQuery } from "@tanstack/react-query";
import { AuthResponse, Login, Register, RegisterResponse } from "../types/Auth";
import { responseOrError } from "./response";

export const useSignIn = () => {
  return useMutation({
    mutationFn: async (login: Login): Promise<AuthResponse> => {
      return fetch("/api/v1/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(login),
      }).then(responseOrError);
    },
  });
};

export const useSignUp = () => {
  return useMutation({
    mutationFn: async (register: Register): Promise<RegisterResponse> => {
      return fetch("/api/v1/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(register),
      }).then(responseOrError);
    },
  });
};

export const useVerifyRegistration = () => {
  return useMutation({
    mutationFn: async ({ code }: { code: string }): Promise<any> => {
      return fetch("/api/v1/auth/verify-registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      }).then(responseOrError);
    },
  });
};

export const useNewRegistrationCode = () => {
  return useMutation({
    mutationFn: async ({ email }: { email: string }): Promise<any> => {
      return fetch("/api/v1/auth/registration-new-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }).then(responseOrError);
    },
  });
};

export const useRequestResetPassword = () => {
  return useMutation({
    mutationFn: async ({ email }: { email: string }): Promise<any> => {
      return fetch("/api/v1/auth/reset-password/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }).then(responseOrError);
    },
  });
};

export const useValidateResetPassword = (token: string) => {
  return useQuery({
    queryKey: [`validate-reset-password-${token}`],
    queryFn: async () => {
      return fetch("/api/v1/auth/reset-password/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      }).then(responseOrError);
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async ({
      email,
      token,
      password,
    }: {
      email: string;
      token: string;
      password: string;
    }): Promise<any> => {
      return fetch("/api/v1/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, token, password }),
      }).then(responseOrError);
    },
  });
};
