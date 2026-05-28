import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'foreman2', minLength: 3, maxLength: 64 })
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  login!: string;

  @ApiProperty({ example: 'secret123', minLength: 6, maxLength: 128 })
  @IsString()
  @MinLength(6)
  @MaxLength(128)
  password!: string;

  @ApiProperty({ example: 'Иванов Сергей Петрович', minLength: 3, maxLength: 128 })
  @IsString()
  @MinLength(3)
  @MaxLength(128)
  fullName!: string;
}
