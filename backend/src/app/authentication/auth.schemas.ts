import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type Login = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export type Signup = z.infer<typeof signupSchema>;

export const verifyRegistrationSchema = z.object({
  code: z.string(),
});

export const registrationNewCodeSchema = z.object({
  email: z.string().email(),
});

export const passwordResetRequestSchema = z.object({
  email: z.string().email(),
});

export const passwordResetTokenSchema = z.object({
  token: z.string(),
});

export const passwordResetSchema = z.object({
  email: z.string().email(),
  token: z.string(),
  password: z.string().min(8).max(100),
});
