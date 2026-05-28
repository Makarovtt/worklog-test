import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MeasurementUnit } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

const PAGE_SIZE_MAX = 200;
const BULK_MAX = 100;

export class WorkLogWorkTypeBriefDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ enum: MeasurementUnit })
  unit!: MeasurementUnit;
}

export class WorkLogWorkerBriefDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  fullName!: string;

  @ApiPropertyOptional({ nullable: true })
  brigade!: string | null;
}

export class WorkLogCreatedByBriefDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  fullName!: string;
}

export class WorkLogResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'date', example: '2026-05-28' })
  performedAt!: string;

  @ApiProperty({ type: WorkLogWorkTypeBriefDto })
  workType!: WorkLogWorkTypeBriefDto;

  @ApiProperty({ type: WorkLogWorkerBriefDto })
  worker!: WorkLogWorkerBriefDto;

  @ApiProperty({ type: WorkLogCreatedByBriefDto })
  createdBy!: WorkLogCreatedByBriefDto;

  @ApiProperty({ example: '24.500', description: 'Объём в виде строки для сохранения точности' })
  volume!: string;

  @ApiPropertyOptional({ nullable: true })
  note!: string | null;

  @ApiProperty({ format: 'date-time' })
  createdAt!: string;

  @ApiProperty({ format: 'date-time' })
  updatedAt!: string;
}

export class WorkLogListResponseDto {
  @ApiProperty({ type: WorkLogResponseDto, isArray: true })
  items!: WorkLogResponseDto[];

  @ApiProperty({ example: 42 })
  total!: number;

  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 20 })
  pageSize!: number;
}

export class ListWorkLogsQueryDto {
  @ApiPropertyOptional({ format: 'date' })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional({ format: 'date' })
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  workTypeId?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  workerId?: string;

  @ApiPropertyOptional({ minimum: 1, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ minimum: 1, maximum: PAGE_SIZE_MAX, default: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(PAGE_SIZE_MAX)
  pageSize?: number;

  @ApiPropertyOptional({ enum: ['performedAt', 'createdAt'], default: 'performedAt' })
  @IsOptional()
  @IsString()
  sortBy?: 'performedAt' | 'createdAt';

  @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  @IsString()
  sortDirection?: 'asc' | 'desc';
}

export class CreateWorkLogDto {
  @ApiProperty({ format: 'date', example: '2026-05-28' })
  @IsDateString()
  performedAt!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  workTypeId!: string;

  @ApiProperty({ example: 24.5, minimum: 0.001 })
  @IsNumber({ maxDecimalPlaces: 3 })
  @IsPositive()
  volume!: number;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  workerId!: string;

  @ApiPropertyOptional({ nullable: true, maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string | null;
}

export class UpdateWorkLogDto {
  @ApiPropertyOptional({ format: 'date' })
  @IsOptional()
  @IsDateString()
  performedAt?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  workTypeId?: string;

  @ApiPropertyOptional({ minimum: 0.001 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 3 })
  @IsPositive()
  volume?: number;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  workerId?: string;

  @ApiPropertyOptional({ nullable: true, maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string | null;
}

export class CreateWorkLogsBulkItemDto {
  @ApiProperty({ format: 'date' })
  @IsDateString()
  performedAt!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  workTypeId!: string;

  @ApiProperty({ minimum: 0.001 })
  @IsNumber({ maxDecimalPlaces: 3 })
  @IsPositive()
  volume!: number;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  workerId!: string;

  @ApiPropertyOptional({ nullable: true, maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string | null;
}

export class CreateWorkLogsBulkDto {
  @ApiProperty({ type: CreateWorkLogsBulkItemDto, isArray: true, minItems: 1, maxItems: BULK_MAX })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(BULK_MAX)
  @ValidateNested({ each: true })
  @Type(() => CreateWorkLogsBulkItemDto)
  entries!: CreateWorkLogsBulkItemDto[];
}

export class WorkLogIdsDto {
  @ApiProperty({ type: String, isArray: true, minItems: 1, maxItems: BULK_MAX, format: 'uuid' })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(BULK_MAX)
  @IsUUID('4', { each: true })
  ids!: string[];
}

export class UpdateWorkLogsBulkDateDto {
  @ApiProperty({ type: String, isArray: true, minItems: 1, maxItems: BULK_MAX, format: 'uuid' })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(BULK_MAX)
  @IsUUID('4', { each: true })
  ids!: string[];

  @ApiProperty({ format: 'date' })
  @IsDateString()
  performedAt!: string;
}

export class DeleteWorkLogsResponseDto {
  @ApiProperty({ example: 3 })
  deletedCount!: number;
}

export class RestoreWorkLogsResponseDto {
  @ApiProperty({ example: 3 })
  restoredCount!: number;
}

class MeasurementUnitOptionDto {
  @ApiProperty({ enum: MeasurementUnit })
  unit!: MeasurementUnit;
}

export { MeasurementUnitOptionDto };
