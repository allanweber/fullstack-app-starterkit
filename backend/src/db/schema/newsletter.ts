import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

const newsletter = sqliteTable('newsletter', {
  id: integer('id').primaryKey(),
  email: text('email').notNull(),
  createdAt: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export default newsletter;
