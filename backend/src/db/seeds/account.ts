import { eq } from 'drizzle-orm';
import db from '..';
import { account } from '../schema';
import { tenancy } from './../schema/tenancy';
import accounts from './data/accounts.json';

export default async function seed(db: db) {
  const tenancyId = await db.query.tenancy.findFirst({
    where: eq(tenancy.name, 'allan@mail.com'),
  });
  if (!tenancyId) {
    throw new Error('Tenancy not found');
  }

  const values = accounts.map((acc) => {
    return {
      tenancyId: tenancyId.id,
      name: acc.name,
    };
  });

  await db.insert(account).values(values);
}
