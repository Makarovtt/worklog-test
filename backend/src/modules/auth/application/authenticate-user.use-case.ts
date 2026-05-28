import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { toPublicUser, type PublicUser } from '../domain/user.entity';
import { USER_REPOSITORY, type UserRepository } from '../domain/user.repository';

import { passwordHasher } from './password-hasher';

export interface AuthenticateUserInput {
  login: string;
  password: string;
}

export interface AuthenticateUserResult {
  accessToken: string;
  user: PublicUser;
}

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    private readonly jwt: JwtService,
  ) {}

  async execute(input: AuthenticateUserInput): Promise<AuthenticateUserResult> {
    const user = await this.users.findByLogin(input.login);
    if (!user) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    const passwordMatches = await passwordHasher.compare(input.password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    const accessToken = await this.jwt.signAsync({ sub: user.id, role: user.role });

    return { accessToken, user: toPublicUser(user) };
  }
}
