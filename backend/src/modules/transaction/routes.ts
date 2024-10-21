import { Router } from 'express';
import { accessTokenGuard } from '../../components/guards/access-token.guard';
import { queryTransactions } from './query-transactions';

export const transactionRoutes = Router();
transactionRoutes.get(
  '/v1/transactions',
  [accessTokenGuard],
  queryTransactions
);
