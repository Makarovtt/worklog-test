import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CreateWorkTypeUseCase } from '../application/create-work-type.use-case';
import { ListWorkTypesUseCase } from '../application/list-work-types.use-case';

import { CreateWorkTypeDto, WorkTypeResponseDto } from './dto/work-type.dto';
import { toWorkTypeResponse } from './work-type.mapper';

@ApiTags('Work Types')
@ApiBearerAuth('bearer')
@Controller({ path: 'work-types', version: '1' })
export class WorkTypesController {
  constructor(
    private readonly listWorkTypes: ListWorkTypesUseCase,
    private readonly createWorkType: CreateWorkTypeUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Список видов работ' })
  @ApiOkResponse({ type: WorkTypeResponseDto, isArray: true })
  async list(): Promise<WorkTypeResponseDto[]> {
    const items = await this.listWorkTypes.execute();
    return items.map(toWorkTypeResponse);
  }

  @Post()
  @ApiOperation({ summary: 'Создание вида работ' })
  @ApiOkResponse({ type: WorkTypeResponseDto })
  async create(@Body() dto: CreateWorkTypeDto): Promise<WorkTypeResponseDto> {
    const created = await this.createWorkType.execute(dto);
    return toWorkTypeResponse(created);
  }
}
