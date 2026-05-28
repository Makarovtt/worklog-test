import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@prisma/client';

import { toPublicUser, type PublicUser } from '../domain/user.entity';
import { USER_REPOSITORY, type UserRepository } from '../domain/user.repository';

import { passwordHasher } from './password-hasher';

export interface RegisterUserInput {
  login: string;
  password: string;
  fullName: string;
}

export interface RegisterUserResult {
  accessToken: string;
  user: PublicUser;
}

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    private readonly jwt: JwtService,
  ) {}

  async execute(input: RegisterUserInput): Promise<RegisterUserResult> {
    const existing = await this.users.findByLogin(input.login);
    if (existing) {
      throw new ConflictException('Пользователь с таким логином уже существует');
    }

    const passwordHash = await passwordHasher.hash(input.password);
    const created = await this.users.create({
      login: input.login,
      passwordHash,
      fullName: input.fullName,
      role: UserRole.FOREMAN,
    });

    const accessToken = await this.jwt.signAsync({ sub: created.id, role: created.role });

    return { accessToken, user: toPublicUser(created) };
  }
}
