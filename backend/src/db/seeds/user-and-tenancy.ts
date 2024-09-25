import db from '..';
import { hashPassword } from '../../app/authentication/password';
import { createDate, generateId, TimeSpan } from '../../utils/randoms';
import {
  tenancy,
  tenancyPlan,
  user,
  userAccounts,
  userProfile,
  userRoles,
} from '../schema';

export default async function seed(db: db) {
  const email = 'allan@mail.com';
  const password = '12345678';
  const saltPassword = generateId();
  const passwordHash = await hashPassword(saltPassword, password);

  const tenancyId = generateId();
  const userId = generateId();
  await db.transaction(async (tx) => {
    await tx.insert(tenancy).values({
      id: tenancyId,
      name: email,
    });

    await tx.insert(tenancyPlan).values({
      tenancyId,
      isFree: true,
      startsAt: new Date(),
      expiresAt: createDate(new TimeSpan(1, 'y')),
    });

    await tx.insert(user).values({
      id: userId,
      email,
      tenancyId,
      email_verified: true,
    });

    await tx.insert(userAccounts).values({
      userId,
      accountType: 'email',
      passwordHash,
      salt: saltPassword,
    });

    await tx.insert(userRoles).values({
      userId,
      role: 'super-user',
    });

    await tx.insert(userProfile).values({
      userId,
      displayName: email,
      theme: 'light',
      locale: 'en',
    });
  });
}
