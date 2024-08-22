import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { user } from './user';

export const userProfile = sqliteTable('user_profile', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: 'cascade' }),
  displayName: text('display_name'),
  firstName: text('first_name'),
  lastName: text('last_name'),
  dateOfBirth: integer('date_of_birth', { mode: 'timestamp' }),
  image: text('image'),
  bio: text('bio').default(''),
  locale: text('locale').notNull().default('en'),
  theme: text('theme').notNull().default('system'),
});

export const profilesRelations = relations(userProfile, ({ one }) => ({
  user: one(user, {
    fields: [userProfile.userId],
    references: [user.id],
  }),
}));
