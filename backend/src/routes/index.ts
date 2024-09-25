import { Router } from 'express';
import { getAllAccounts } from '../app/accounts';
import {
  authGoogle,
  passwordReset,
  registrationNewCode,
  requestPasswordReset,
  signin,
  signup,
  validatePasswordReset,
  verifyRegistration,
} from '../app/authentication';
import { getAllCategories } from '../app/category';
import { contact } from '../app/landing';
import { getAllTags } from '../app/tags';
import { queryTransactions } from '../app/transaction';
import { protectRoute } from './protected';

export default () => {
  const app = Router();

  app.get('/', (req, res) => {
    res.send('Hello from the backend!');
  });

  app.post('/v1/auth/signin', signin);
  app.post('/v1/auth/signup', signup);
  app.post('/v1/auth/google', authGoogle);
  app.post('/v1/auth/verify-registration', verifyRegistration);
  app.post('/v1/auth/registration-new-code', registrationNewCode);
  app.post('/v1/auth/reset-password/request', requestPasswordReset);
  app.post('/v1/auth/reset-password/validate', validatePasswordReset);
  app.post('/v1/auth/reset-password', passwordReset);

  app.get('/v1/transactions', [protectRoute], queryTransactions);

  app.get('/v1/categories', [protectRoute], getAllCategories);

  app.get('/v1/accounts', [protectRoute], getAllAccounts);

  app.get('/v1/tags', [protectRoute], getAllTags);

  app.post('/v1/landing/contact', contact);

  return app;
};
