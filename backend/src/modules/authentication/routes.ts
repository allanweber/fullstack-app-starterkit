import { Router } from 'express';
import { authGoogle } from './google';
import {
  passwordReset,
  requestPasswordReset,
  validatePasswordReset,
} from './password';
import { registrationNewCode, verifyRegistration } from './registration';
import { signin } from './signin';
import { signup } from './signup';

export const authenticationRoutes = Router();

/**
 * @swagger
 * /api/v1/auth/signin:
 *  post:
 *    tags: [Auth/User]
 *    summary: Signin to the application
 *    description: Signin to the application
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *    responses:
 *      '200':
 *        description: OK
 *      '400':
 *        description: Invalid Inputs
 *      '401':
 *        description: Unauthorized
 */
authenticationRoutes.post('/v1/auth/signin', signin);

// /**
//  * @swagger
//  */
authenticationRoutes.post('/v1/auth/signup', signup);
authenticationRoutes.post('/v1/auth/google', authGoogle);
authenticationRoutes.post('/v1/auth/verify-registration', verifyRegistration);
authenticationRoutes.post(
  '/v1/auth/registration-new-code',
  registrationNewCode
);
authenticationRoutes.post(
  '/v1/auth/reset-password/request',
  requestPasswordReset
);
authenticationRoutes.post(
  '/v1/auth/reset-password/validate',
  validatePasswordReset
);
authenticationRoutes.post('/v1/auth/reset-password', passwordReset);
