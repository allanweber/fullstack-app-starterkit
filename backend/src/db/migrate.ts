import { migrate } from 'drizzle-orm/libsql/migrator';
import { client, db } from '.';
import config from '../drizzle.config';

(async () => {
  await migrate(db, { migrationsFolder: config.out! });

  await client.close();
  console.log('Migrations done');
})();
