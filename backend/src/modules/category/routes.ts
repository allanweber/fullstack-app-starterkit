import { Router } from 'express';
import { accessTokenGuard } from '../../components/guards/access-token.guard';
import { getAllCategories } from './getAll-categories';

export const categoryRoutes = Router();
categoryRoutes.get('/v1/categories', [accessTokenGuard], getAllCategories);
