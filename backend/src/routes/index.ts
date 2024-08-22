import { Router } from 'express';
import { signin, signup } from '../app/authentication';
import { getNewsletter, postNewsletter } from '../app/newsletter';
import { protectRoute } from './protected';

export default () => {
  const app = Router();

  app.get('/', (req, res) => {
    res.send('Hello from the backend!');
  });

  app.post('/v1/auth/signin', signin);
  app.post('/v1/auth/signup', signup);

  app.get('/v1/newsletter', [protectRoute], getNewsletter);
  app.post('/v1/newsletter', [protectRoute], postNewsletter);

  return app;
};
