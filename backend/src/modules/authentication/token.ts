import jwt from 'jsonwebtoken';
import { Payload } from '../../components/types/request';
import env from '../../env';

export const issueToken = (payload: Payload) => {
  const tokenTTL = env.TOKEN_TTL || '2h';
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: tokenTTL });
};
