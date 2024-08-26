import { Router } from 'express';
import {
  passwordReset,
  registrationNewCode,
  requestPasswordReset,
  signin,
  signup,
  validatePasswordReset,
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
  app.post('/v1/auth/reset-password/request', requestPasswordReset);
  app.post('/v1/auth/reset-password/validate', validatePasswordReset);
  app.post('/v1/auth/reset-password', passwordReset);

  return app;
};
