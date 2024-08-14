import newsletters from './data/newsletter.json';

import db from '..';
import { newsletter } from '../schema';

export default async function seed(db: db) {
  await db.insert(newsletter).values(newsletters);
}
