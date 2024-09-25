import { eq } from 'drizzle-orm';
import db from '..';
import { tag } from '../schema';
import { tenancy } from '../schema/tenancy';
import tags from './data/tags.json';

export default async function seed(db: db) {
  const tenancyId = await db.query.tenancy.findFirst({
    where: eq(tenancy.name, 'allan@mail.com'),
  });
  if (!tenancyId) {
    throw new Error('Tenancy not found');
  }

  const values = tags.map((tg) => {
    return {
      tenancyId: tenancyId.id,
      name: tg.name,
      color: tg.color,
    };
  });

  await db.insert(tag).values(values);
}
