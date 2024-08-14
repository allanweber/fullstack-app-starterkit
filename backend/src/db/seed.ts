import { Table, getTableName, sql } from 'drizzle-orm';
import { client, db } from '.';
import * as schema from './schema';
import * as seeds from './seeds';

async function resetTable(db: db, table: Table) {
  return db.run(
    sql.raw(
      `DELETE FROM ${getTableName(
        table
      )}; DELETE FROM sqlite_sequence WHERE name='${getTableName(table)}';`
    )
  );
}

(async () => {
  for (const table of [schema.newsletter]) {
    await resetTable(db, table);
  }

  await seeds.newsletter(db);

  await client.close();
})();
