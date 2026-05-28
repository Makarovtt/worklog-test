import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/shared/prisma/prisma.service';

import type { WorkTypeEntity } from '../domain/work-type.entity';
import type { CreateWorkTypeData, WorkTypeRepository } from '../domain/work-type.repository';

@Injectable()
export class WorkTypePrismaRepository implements WorkTypeRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<WorkTypeEntity[]> {
    return this.prisma.workType.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  findById(id: string): Promise<WorkTypeEntity | null> {
    return this.prisma.workType.findUnique({ where: { id } });
  }

  create(data: CreateWorkTypeData): Promise<WorkTypeEntity> {
    return this.prisma.workType.create({ data });
  }
}
