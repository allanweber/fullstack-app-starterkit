import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import { ZodError, z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.string().default('3001'),
  DATABASE_URL: z.string(),
  TOKEN_TTL: z.string().default('1h'),
  JWT_SECRET: z.string(),
  LOG_LEVEL: z.string().default('info'),
  HOST_NAME: z.string(),
  APP_NAME: z.string(),
  EMAIL_SERVER_PASSWORD: z.string(),
  EMAIL_FROM: z.string(),
  BCC_EMAIL: z.string(),
});

export type EnvSchema = z.infer<typeof EnvSchema>;

expand(config());

try {
  EnvSchema.parse(process.env);
} catch (error) {
  if (error instanceof ZodError) {
    let message = 'Missing required values in .env:\n';
    error.issues.forEach((issue) => {
      message += issue.path[0] + '\n';
    });
    const e = new Error(message);
    e.stack = '';
    throw e;
  } else {
    console.error(error);
  }
}

export default EnvSchema.parse(process.env);
