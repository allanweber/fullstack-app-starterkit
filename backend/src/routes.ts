import { Router } from 'express';
import { accountRoutes } from './modules/account/routes';
import { authenticationRoutes } from './modules/authentication/routes';
import { categoryRoutes } from './modules/category/routes';
import { tagRoutes } from './modules/tag/routes';
import { transactionRoutes } from './modules/transaction/routes';

export const apiRouter = Router();
apiRouter.use(authenticationRoutes);
apiRouter.use(accountRoutes);
apiRouter.use(categoryRoutes);
apiRouter.use(tagRoutes);
apiRouter.use(transactionRoutes);
