import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';

import { loadEnv } from './config/env';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/presentation/guards/jwt-auth.guard';
import { HealthModule } from './modules/health/health.module';
import { WorkLogsModule } from './modules/work-logs/work-logs.module';
import { WorkTypesModule } from './modules/work-types/work-types.module';
import { WorkersModule } from './modules/workers/workers.module';
import { PrismaModule } from './shared/prisma/prisma.module';

const env = loadEnv();

const isPrettyLogs = env.NODE_ENV !== 'production' && env.NODE_ENV !== 'test';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: isPrettyLogs
        ? {
            transport: {
              target: 'pino-pretty',
              options: { singleLine: true, translateTime: 'SYS:standard' },
            },
            redact: ['req.headers.authorization'],
          }
        : {
            redact: ['req.headers.authorization'],
          },
    }),
    PrismaModule,
    HealthModule,
    AuthModule,
    WorkTypesModule,
    WorkersModule,
    WorkLogsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
