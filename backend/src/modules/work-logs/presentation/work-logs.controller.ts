import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CurrentUser } from '@/modules/auth/presentation/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@/modules/auth/presentation/strategies/jwt.strategy';

import { CreateWorkLogUseCase } from '../application/create-work-log.use-case';
import { CreateWorkLogsBulkUseCase } from '../application/create-work-logs-bulk.use-case';
import { DeleteWorkLogsUseCase } from '../application/delete-work-logs.use-case';
import { ListWorkLogsUseCase } from '../application/list-work-logs.use-case';
import { RestoreWorkLogsUseCase } from '../application/restore-work-logs.use-case';
import { UpdateWorkLogUseCase } from '../application/update-work-log.use-case';
import { UpdateWorkLogsBulkDateUseCase } from '../application/update-work-logs-bulk-date.use-case';

import {
  CreateWorkLogDto,
  CreateWorkLogsBulkDto,
  DeleteWorkLogsResponseDto,
  ListWorkLogsQueryDto,
  RestoreWorkLogsResponseDto,
  UpdateWorkLogDto,
  UpdateWorkLogsBulkDateDto,
  WorkLogIdsDto,
  WorkLogListResponseDto,
  WorkLogResponseDto,
} from './dto/work-log.dto';
import { toWorkLogResponse } from './work-log.mapper';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;

@ApiTags('Work Logs')
@ApiBearerAuth('bearer')
@Controller({ path: 'work-logs', version: '1' })
export class WorkLogsController {
  constructor(
    private readonly listWorkLogs: ListWorkLogsUseCase,
    private readonly createWorkLog: CreateWorkLogUseCase,
    private readonly createWorkLogsBulk: CreateWorkLogsBulkUseCase,
    private readonly updateWorkLog: UpdateWorkLogUseCase,
    private readonly updateWorkLogsBulkDate: UpdateWorkLogsBulkDateUseCase,
    private readonly deleteWorkLogs: DeleteWorkLogsUseCase,
    private readonly restoreWorkLogs: RestoreWorkLogsUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Список записей журнала с фильтрацией и пагинацией' })
  @ApiOkResponse({ type: WorkLogListResponseDto })
  async list(@Query() query: ListWorkLogsQueryDto): Promise<WorkLogListResponseDto> {
    const page = query.page ?? DEFAULT_PAGE;
    const pageSize = query.pageSize ?? DEFAULT_PAGE_SIZE;

    const result = await this.listWorkLogs.execute({
      dateFrom: query.dateFrom ? new Date(query.dateFrom) : undefined,
      dateTo: query.dateTo ? new Date(query.dateTo) : undefined,
      workTypeId: query.workTypeId,
      workerId: query.workerId,
      page,
      pageSize,
      sortBy: query.sortBy ?? 'performedAt',
      sortDirection: query.sortDirection ?? 'desc',
    });

    return {
      items: result.items.map(toWorkLogResponse),
      total: result.total,
      page,
      pageSize,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Создание новой записи' })
  @ApiCreatedResponse({ type: WorkLogResponseDto })
  async create(
    @Body() dto: CreateWorkLogDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<WorkLogResponseDto> {
    const created = await this.createWorkLog.execute({
      performedAt: new Date(dto.performedAt),
      workTypeId: dto.workTypeId,
      volume: dto.volume,
      workerId: dto.workerId,
      note: dto.note ?? null,
      createdById: user.id,
    });
    return toWorkLogResponse(created);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Массовое создание записей в одной транзакции' })
  @ApiCreatedResponse({ type: WorkLogResponseDto, isArray: true })
  async createBulk(
    @Body() dto: CreateWorkLogsBulkDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<WorkLogResponseDto[]> {
    const created = await this.createWorkLogsBulk.execute({
      createdById: user.id,
      entries: dto.entries.map((entry) => ({
        performedAt: new Date(entry.performedAt),
        workTypeId: entry.workTypeId,
        volume: entry.volume,
        workerId: entry.workerId,
        note: entry.note ?? null,
      })),
    });
    return created.map(toWorkLogResponse);
  }

  @Patch('bulk/date')
  @ApiOperation({ summary: 'Массовое изменение даты выполнения для выбранных записей' })
  @ApiOkResponse({ type: WorkLogResponseDto, isArray: true })
  async updateBulkDate(@Body() dto: UpdateWorkLogsBulkDateDto): Promise<WorkLogResponseDto[]> {
    const updated = await this.updateWorkLogsBulkDate.execute({
      ids: dto.ids,
      performedAt: new Date(dto.performedAt),
    });
    return updated.map(toWorkLogResponse);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Редактирование записи' })
  @ApiOkResponse({ type: WorkLogResponseDto })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateWorkLogDto,
  ): Promise<WorkLogResponseDto> {
    const updated = await this.updateWorkLog.execute({
      id,
      performedAt: dto.performedAt ? new Date(dto.performedAt) : undefined,
      workTypeId: dto.workTypeId,
      volume: dto.volume,
      workerId: dto.workerId,
      note: dto.note,
    });
    return toWorkLogResponse(updated);
  }

  @Delete()
  @ApiOperation({ summary: 'Массовое удаление записей (soft delete)' })
  @ApiOkResponse({ type: DeleteWorkLogsResponseDto })
  @HttpCode(HttpStatus.OK)
  async deleteMany(@Body() dto: WorkLogIdsDto): Promise<DeleteWorkLogsResponseDto> {
    return this.deleteWorkLogs.execute({ ids: dto.ids });
  }

  @Post('restore')
  @ApiOperation({ summary: 'Восстановление ранее удалённых записей' })
  @ApiOkResponse({ type: RestoreWorkLogsResponseDto })
  @HttpCode(HttpStatus.OK)
  async restore(@Body() dto: WorkLogIdsDto): Promise<RestoreWorkLogsResponseDto> {
    return this.restoreWorkLogs.execute({ ids: dto.ids });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удаление одной записи (soft delete)' })
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.deleteWorkLogs.execute({ ids: [id] });
  }
}
