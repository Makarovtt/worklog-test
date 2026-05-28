import type { UserRole } from '@prisma/client';

export interface UserEntity {
  id: string;
  login: string;
  passwordHash: string;
  fullName: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicUser {
  id: string;
  login: string;
  fullName: string;
  role: UserRole;
}

export function toPublicUser(user: UserEntity): PublicUser {
  return {
    id: user.id,
    login: user.login,
    fullName: user.fullName,
    role: user.role,
  };
}
