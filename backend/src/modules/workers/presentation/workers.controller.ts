import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CreateWorkerUseCase } from '../application/create-worker.use-case';
import { ListWorkersUseCase } from '../application/list-workers.use-case';

import { CreateWorkerDto, WorkerResponseDto } from './dto/worker.dto';
import { toWorkerResponse } from './worker.mapper';

@ApiTags('Workers')
@ApiBearerAuth('bearer')
@Controller({ path: 'workers', version: '1' })
export class WorkersController {
  constructor(
    private readonly listWorkers: ListWorkersUseCase,
    private readonly createWorker: CreateWorkerUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Список исполнителей' })
  @ApiOkResponse({ type: WorkerResponseDto, isArray: true })
  async list(): Promise<WorkerResponseDto[]> {
    const items = await this.listWorkers.execute();
    return items.map(toWorkerResponse);
  }

  @Post()
  @ApiOperation({ summary: 'Создание исполнителя' })
  @ApiOkResponse({ type: WorkerResponseDto })
  async create(@Body() dto: CreateWorkerDto): Promise<WorkerResponseDto> {
    const created = await this.createWorker.execute(dto);
    return toWorkerResponse(created);
  }
}
