import { Router } from 'express';
import { accessTokenGuard } from '../../components/guards/access-token.guard';
import { getAllAccounts } from './getAll-accounts';

export const accountRoutes = Router();

accountRoutes.get('/v1/accounts', [accessTokenGuard], getAllAccounts);
