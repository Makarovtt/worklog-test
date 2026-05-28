import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin', minLength: 3, maxLength: 64 })
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  login!: string;

  @ApiProperty({ example: 'admin123', minLength: 6, maxLength: 128 })
  @IsString()
  @MinLength(6)
  @MaxLength(128)
  password!: string;
}
