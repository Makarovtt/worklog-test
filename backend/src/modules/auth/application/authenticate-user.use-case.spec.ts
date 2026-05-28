import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { UserRole } from '@prisma/client';

import type { UserEntity } from '../domain/user.entity';
import { USER_REPOSITORY, type UserRepository } from '../domain/user.repository';

import { AuthenticateUserUseCase } from './authenticate-user.use-case';
import { passwordHasher } from './password-hasher';

const buildUser = (overrides: Partial<UserEntity> = {}): UserEntity => ({
  id: 'user-id',
  login: 'admin',
  passwordHash: 'hash',
  fullName: 'Иванов И.И.',
  role: UserRole.ADMIN,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

describe('AuthenticateUserUseCase', () => {
  let useCase: AuthenticateUserUseCase;
  let repository: jest.Mocked<UserRepository>;
  let jwt: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthenticateUserUseCase,
        {
          provide: USER_REPOSITORY,
          useValue: {
            findById: jest.fn(),
            findByLogin: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: { signAsync: jest.fn() },
        },
      ],
    }).compile();

    useCase = moduleRef.get(AuthenticateUserUseCase);
    repository = moduleRef.get(USER_REPOSITORY);
    jwt = moduleRef.get(JwtService);
  });

  it('возвращает токен и публичный профиль при корректных учётных данных', async () => {
    const user = buildUser();
    repository.findByLogin.mockResolvedValue(user);
    jwt.signAsync.mockResolvedValue('signed-token');
    jest.spyOn(passwordHasher, 'compare').mockResolvedValue(true);

    const result = await useCase.execute({ login: 'admin', password: 'admin123' });

    expect(result.accessToken).toBe('signed-token');
    expect(result.user).toEqual({
      id: 'user-id',
      login: 'admin',
      fullName: 'Иванов И.И.',
      role: UserRole.ADMIN,
    });
  });

  it('бросает Unauthorized, если пользователь не найден', async () => {
    repository.findByLogin.mockResolvedValue(null);

    await expect(
      useCase.execute({ login: 'unknown', password: 'whatever' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(jwt.signAsync).not.toHaveBeenCalled();
  });

  it('бросает Unauthorized при неверном пароле', async () => {
    repository.findByLogin.mockResolvedValue(buildUser());
    jest.spyOn(passwordHasher, 'compare').mockResolvedValue(false);

    await expect(
      useCase.execute({ login: 'admin', password: 'wrong' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(jwt.signAsync).not.toHaveBeenCalled();
  });
});
