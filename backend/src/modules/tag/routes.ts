import { Router } from 'express';
import { accessTokenGuard } from '../../components/guards/access-token.guard';
import { getAllTags } from './getAll-tags';

export const tagRoutes = Router();

tagRoutes.get('/v1/tags', [accessTokenGuard], getAllTags);
