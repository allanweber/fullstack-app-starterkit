import express from 'express';
import { verifyRequestOrigin } from 'lucia';
import env from '../env';
import { lucia } from '../lib/auth';

export default (app: express.Application) => {
  app.use((req, res, next) => {
    if (req.method === 'GET') {
      return next();
    }
    const originHeader = req.headers.origin ?? null;
    const hostHeader = req.headers.host ?? null;
    console.log('originHeader', originHeader);
    console.log('hostHeader', hostHeader);
    if (
      !originHeader ||
      !hostHeader ||
      !verifyRequestOrigin(originHeader, [hostHeader, env.HOST])
    ) {
      return res.status(403).end();
    }
    return next();
  });

  app.use(async (req, res, next) => {
    const sessionId = lucia.readSessionCookie(req.headers.cookie ?? '');
    if (!sessionId) {
      res.locals.user = null;
      res.locals.session = null;
      return next();
    }

    const { session, user } = await lucia.validateSession(sessionId);
    if (session && session.fresh) {
      res.appendHeader(
        'Set-Cookie',
        lucia.createSessionCookie(session.id).serialize()
      );
    }
    if (!session) {
      res.appendHeader(
        'Set-Cookie',
        lucia.createBlankSessionCookie().serialize()
      );
    }
    res.locals.session = session;
    res.locals.user = user;
    return next();
  });
};
