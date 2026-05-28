import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { loadEnv } from '@/config/env';

import { AuthenticateUserUseCase } from './application/authenticate-user.use-case';
import { GetCurrentUserUseCase } from './application/get-current-user.use-case';
import { RegisterUserUseCase } from './application/register-user.use-case';
import { USER_REPOSITORY } from './domain/user.repository';
import { UserPrismaRepository } from './infrastructure/user.prisma.repository';
import { AuthController } from './presentation/auth.controller';
import { JwtStrategy } from './presentation/strategies/jwt.strategy';

const env = loadEnv();

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: env.JWT_SECRET,
      signOptions: { expiresIn: env.JWT_EXPIRES_IN },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthenticateUserUseCase,
    RegisterUserUseCase,
    GetCurrentUserUseCase,
    JwtStrategy,
    { provide: USER_REPOSITORY, useClass: UserPrismaRepository },
  ],
  exports: [USER_REPOSITORY],
})
export class AuthModule {}
