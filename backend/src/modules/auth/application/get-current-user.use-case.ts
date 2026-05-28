import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { toPublicUser, type PublicUser } from '../domain/user.entity';
import { USER_REPOSITORY, type UserRepository } from '../domain/user.repository';

@Injectable()
export class GetCurrentUserUseCase {
  constructor(@Inject(USER_REPOSITORY) private readonly users: UserRepository) {}

  async execute(userId: string): Promise<PublicUser> {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return toPublicUser(user);
  }
}
