import { ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { UserRole } from '@prisma/client';

import type { UserEntity } from '../domain/user.entity';
import { USER_REPOSITORY, type UserRepository } from '../domain/user.repository';

import { passwordHasher } from './password-hasher';
import { RegisterUserUseCase } from './register-user.use-case';

const buildUser = (overrides: Partial<UserEntity> = {}): UserEntity => ({
  id: 'user-id',
  login: 'foreman',
  passwordHash: 'hash',
  fullName: 'Петров П.П.',
  role: UserRole.FOREMAN,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

describe('RegisterUserUseCase', () => {
  let useCase: RegisterUserUseCase;
  let repository: jest.Mocked<UserRepository>;
  let jwt: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        RegisterUserUseCase,
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

    useCase = moduleRef.get(RegisterUserUseCase);
    repository = moduleRef.get(USER_REPOSITORY);
    jwt = moduleRef.get(JwtService);
  });

  it('создаёт пользователя с ролью FOREMAN и возвращает токен', async () => {
    repository.findByLogin.mockResolvedValue(null);
    repository.create.mockResolvedValue(buildUser());
    jwt.signAsync.mockResolvedValue('signed-token');
    jest.spyOn(passwordHasher, 'hash').mockResolvedValue('hashed-password');

    const result = await useCase.execute({
      login: 'foreman',
      password: 'secret123',
      fullName: 'Петров П.П.',
    });

    expect(repository.create).toHaveBeenCalledWith({
      login: 'foreman',
      passwordHash: 'hashed-password',
      fullName: 'Петров П.П.',
      role: UserRole.FOREMAN,
    });
    expect(result.accessToken).toBe('signed-token');
    expect(result.user.role).toBe(UserRole.FOREMAN);
  });

  it('бросает Conflict, если логин уже занят', async () => {
    repository.findByLogin.mockResolvedValue(buildUser());

    await expect(
      useCase.execute({ login: 'foreman', password: 'secret123', fullName: 'X' }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(repository.create).not.toHaveBeenCalled();
  });
});
