import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class PublicUserDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  login!: string;

  @ApiProperty()
  fullName!: string;

  @ApiProperty({ enum: UserRole })
  role!: UserRole;
}

export class AuthResponseDto {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty({ type: PublicUserDto })
  user!: PublicUserDto;
}
