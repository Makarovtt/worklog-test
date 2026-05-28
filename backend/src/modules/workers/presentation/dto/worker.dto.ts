import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class WorkerResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'Сидоров Алексей Викторович' })
  fullName!: string;

  @ApiPropertyOptional({ example: 'Бригада №1', nullable: true })
  brigade!: string | null;

  @ApiProperty()
  isActive!: boolean;
}

export class CreateWorkerDto {
  @ApiProperty({ minLength: 3, maxLength: 128 })
  @IsString()
  @MinLength(3)
  @MaxLength(128)
  fullName!: string;

  @ApiPropertyOptional({ nullable: true, maxLength: 64 })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  brigade?: string | null;
}
