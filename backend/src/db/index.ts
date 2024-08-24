import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import env from '../env';
import * as schema from './schema';

export const client = createClient({
  url: env.DATABASE_URL!,
  authToken: env.DATABASE_AUTH_TOKEN!,
});

export const db = drizzle(client, {
  schema,
  logger: env.NODE_ENV === 'development',
});

export type db = typeof db;

export default db;
