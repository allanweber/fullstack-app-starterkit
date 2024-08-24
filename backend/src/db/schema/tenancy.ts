import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const tenancy = sqliteTable('tenancy', {
  id: text('id').notNull().primaryKey(),
  name: text('name').notNull(),
  created_at: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});
