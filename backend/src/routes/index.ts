import { Router } from 'express';
import { NewsletterRoutes } from '../newsletter/newsletter.routes';

export default () => {
  const app = Router();

  app.get('/', (req, res) => {
    res.send('Hello from the backend!');
  });

  new NewsletterRoutes(app);

  return app;
};
