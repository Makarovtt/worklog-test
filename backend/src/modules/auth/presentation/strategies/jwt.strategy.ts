import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { UserRole } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { loadEnv } from '@/config/env';

export interface JwtPayload {
  sub: string;
  role: UserRole;
}

export interface AuthenticatedUser {
  id: string;
  role: UserRole;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: loadEnv().JWT_SECRET,
    });
  }

  validate(payload: JwtPayload): AuthenticatedUser {
    return { id: payload.sub, role: payload.role };
  }
}
