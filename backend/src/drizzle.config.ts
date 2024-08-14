import type { Config } from 'drizzle-kit';
import env from './env';

export default {
  schema: './src/db/schema',
  out: './src/db/migrations',
  dialect: 'sqlite',
  driver: env.NODE_ENV === 'production' ? 'turso' : undefined,
  dbCredentials: {
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
  },
  verbose: true,
  strict: true,
} satisfies Config;
