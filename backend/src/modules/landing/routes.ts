import { Router } from 'express';
import { contact } from './contact';

export const landingRoutes = Router();
landingRoutes.post('/v1/landing/contact', contact);
