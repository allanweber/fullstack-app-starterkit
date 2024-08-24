import { Router } from 'express';
import {
  registrationNewCode,
  signin,
  signup,
  verifyRegistration,
} from '../app/authentication';

export default () => {
  const app = Router();

  app.get('/', (req, res) => {
    res.send('Hello from the backend!');
  });

  app.post('/v1/auth/signin', signin);
  app.post('/v1/auth/signup', signup);
  app.post('/v1/auth/verify-registration', verifyRegistration);
  app.post('/v1/auth/registration-new-code', registrationNewCode);

  return app;
};
