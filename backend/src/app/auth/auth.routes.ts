import { hash, verify } from '@node-rs/argon2';
import { eq } from 'drizzle-orm';
import { Request, Response, Router } from 'express';
import { generateIdFromEntropySize } from 'lucia';
import db from '../../db';
import { organization, user, userAccounts } from '../../db/schema';
import { lucia } from '../../lib/auth';
import { Route } from '../../routes/route';
import { loginSchema, signupSchema } from './auth.schemas';

const passwordConfig = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};

export class AuthRoutes extends Route {
  constructor(app: Router) {
    super(app, 'auth');
    this.route.post('/signin', this.signin);
    this.route.post('/signup', this.signup);
    this.route.post('/logout', this.logout);
  }

  private signin = async (req: Request, res: Response) => {
    const login = loginSchema.safeParse(req.body);
    if (!login.success) {
      return res.status(400).json(login.error.issues);
    }

    const registeredUser = await db.query.user.findFirst({
      where: eq(user.email, login.data.email),
    });

    if (!registeredUser || !registeredUser.email_verified) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const userAccount = await db.query.userAccounts.findFirst({
      where: eq(userAccounts.userId, registeredUser.id),
    });

    if (!userAccount) {
      return registeredUser.email_verified;
    }

    if (userAccount.accountType === 'email') {
      const validPassword = verify(
        userAccount.passwordHash!,
        login.data.password,
        {
          salt: Buffer.from(userAccount.salt!, 'hex'),
          ...passwordConfig,
        }
      );
      if (!validPassword) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const session = await lucia.createSession(registeredUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    return res
      .appendHeader('Set-Cookie', sessionCookie.serialize())
      .appendHeader('Location', '/')
      .json({ user: registeredUser.email, expires: session.expiresAt });
  };

  private signup = async (req: Request, res: Response) => {
    const register = signupSchema.safeParse(req.body);
    if (!register.success) {
      return res.status(400).json(register.error.issues);
    }

    const existingUser = await db.query.user.findFirst({
      where: eq(user.email, register.data.email),
    });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const { email, password } = register.data;
    const saltPassword = generateIdFromEntropySize(16);

    const passwordHash = await hash(password, {
      salt: Buffer.from(saltPassword, 'hex'),
      ...passwordConfig,
    });

    const registeredUser = await db.transaction(async (tx) => {
      const [org] = await tx
        .insert(organization)
        .values({
          name: email,
        })
        .returning();

      const userId = generateIdFromEntropySize(16);
      const [newUser] = await tx
        .insert(user)
        .values({
          id: userId,
          email,
          organizationId: org.id,
          email_verified: false,
        })
        .returning();

      await tx
        .insert(userAccounts)
        .values({
          userId,
          accountType: 'email',
          passwordHash,
          salt: saltPassword,
        })
        .returning();

      return newUser;
    });

    const session = await lucia.createSession(registeredUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    return res
      .appendHeader('Set-Cookie', sessionCookie.serialize())
      .appendHeader('Location', '/')
      .json({ user: registeredUser.email, expires: session.expiresAt });
  };

  private logout = async (req: Request, res: Response) => {
    if (res.locals.session) {
      await lucia.invalidateSession(res.locals.session.id);
    }
    return res
      .setHeader('Set-Cookie', lucia.createBlankSessionCookie().serialize())
      .json({ message: 'Logged out' });
  };
}
