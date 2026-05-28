import type { UserRole } from '@prisma/client';

import type { UserEntity } from './user.entity';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface CreateUserData {
  login: string;
  passwordHash: string;
  fullName: string;
  role: UserRole;
}

export interface UserRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByLogin(login: string): Promise<UserEntity | null>;
  create(data: CreateUserData): Promise<UserEntity>;
}
