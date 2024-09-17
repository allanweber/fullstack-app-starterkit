import { Payload } from './token';
export { authGoogle } from './google';
export {
  passwordReset,
  requestPasswordReset,
  validatePasswordReset,
} from './password';
export { registrationNewCode, verifyRegistration } from './registration';
export { signin } from './signin';
export { signup } from './signup';

declare global {
  namespace Express {
    interface Request {
      user: Payload | null;
    }
  }
}
