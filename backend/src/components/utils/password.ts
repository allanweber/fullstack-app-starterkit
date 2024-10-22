import { hash, verify } from '@node-rs/argon2';

export const passwordConfig = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};

export const verifyPassword = async (
  hashed: string,
  salt: string,
  password: string
) => {
  return await verify(hashed, password, {
    salt: Buffer.from(salt, 'hex'),
    ...passwordConfig,
  });
};

export const hashPassword = async (saltPassword: string, password: string) => {
  return await hash(password, {
    salt: Buffer.from(saltPassword, 'hex'),
    ...passwordConfig,
  });
};

export function generateOTP(): string {
  const digits = '0123456789';
  let OTP = '';
  const len = digits.length;
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * len)];
  }
  return OTP;
}
