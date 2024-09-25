import { Table, getTableName, sql } from 'drizzle-orm';
import { client, db } from '.';
import * as schema from './schema';
import * as seeds from './seeds';

async function resetTable(db: db, table: Table) {
  await db.run(sql.raw(`DELETE FROM ${getTableName(table)};`));
  await db.run(
    sql.raw(`DELETE FROM sqlite_sequence WHERE name='${getTableName(table)}';`)
  );
}
(async () => {
  for (const table of [
    schema.tenancy,
    schema.tenancyPlan,
    schema.user,
    schema.userRoles,
    schema.userProfile,
    schema.userAccounts,
    schema.tenancyPlan,
    schema.emailVerification,
    schema.account,
    schema.category,
    schema.tag,
    schema.transactions,
    schema.transactionsTag,
  ]) {
    await resetTable(db, table);
  }
  await seeds.user(db);
  await seeds.account(db);
  await seeds.category(db);
  await seeds.tag(db);
  await seeds.transactions(db);
  await client.close();
})();
