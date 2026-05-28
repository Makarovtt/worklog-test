import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/shared/prisma/prisma.service';

import type { UserEntity } from '../domain/user.entity';
import type { CreateUserData, UserRepository } from '../domain/user.repository';

@Injectable()
export class UserPrismaRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string): Promise<UserEntity | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findByLogin(login: string): Promise<UserEntity | null> {
    return this.prisma.user.findUnique({ where: { login } });
  }

  create(data: CreateUserData): Promise<UserEntity> {
    return this.prisma.user.create({ data });
  }
}
