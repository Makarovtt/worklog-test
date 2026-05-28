import * as bcrypt from 'bcrypt';

const HASH_ROUNDS = 10;

export const passwordHasher = {
  hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, HASH_ROUNDS);
  },
  compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  },
};
