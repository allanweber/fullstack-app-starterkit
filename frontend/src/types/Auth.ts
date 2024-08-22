import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type Login = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type Register = z.infer<typeof registerSchema>;

export type AuthResponse = {
  user: UserResponse;
  token: string;
};

export type RegisterResponse = AuthResponse & { enabled: boolean; message: string };

export type UserResponse = {
  name: string;
  image: string;
};
