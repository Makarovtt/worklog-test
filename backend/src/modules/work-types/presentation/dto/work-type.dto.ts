import { ApiProperty } from '@nestjs/swagger';
import { MeasurementUnit } from '@prisma/client';
import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';

export class WorkTypeResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'Кладка перегородок' })
  name!: string;

  @ApiProperty({ enum: MeasurementUnit })
  unit!: MeasurementUnit;

  @ApiProperty()
  isActive!: boolean;
}

export class CreateWorkTypeDto {
  @ApiProperty({ minLength: 2, maxLength: 128, example: 'Устройство кровли' })
  @IsString()
  @MinLength(2)
  @MaxLength(128)
  name!: string;

  @ApiProperty({ enum: MeasurementUnit })
  @IsEnum(MeasurementUnit)
  unit!: MeasurementUnit;
}
