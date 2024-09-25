import { eq } from 'drizzle-orm';
import db from '..';
import { category } from '../schema';
import { tenancy } from '../schema/tenancy';
import categories from './data/categories.json';

export default async function seed(db: db) {
  const tenancyId = await db.query.tenancy.findFirst({
    where: eq(tenancy.name, 'allan@mail.com'),
  });
  if (!tenancyId) {
    throw new Error('Tenancy not found');
  }

  const values = categories.map((cat) => {
    return {
      tenancyId: tenancyId.id,
      name: cat.name,
      type: cat.type as 'income' | 'expense' | 'investment',
    };
  });

  await db.insert(category).values(values);
}
