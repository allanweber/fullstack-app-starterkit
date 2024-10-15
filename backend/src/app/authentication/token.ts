import jwt from 'jsonwebtoken';
import env from '../../env';
export type Payload = {
  email: string;
  roles: string[];
  userId: number;
  tenancyId: number;
};

export const issueToken = (payload: Payload) => {
  const tokenTTL = env.TOKEN_TTL || '2h';
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: tokenTTL });
};
