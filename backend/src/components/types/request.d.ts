import { Payload } from '../../modules/authentication/token';

declare global {
  namespace Express {
    interface Request {
      user: Payload | null;
    }
  }
}

export type Payload = {
  email: string;
  roles: string[];
  userId: number;
  tenancyId: number;
};
