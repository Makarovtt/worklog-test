import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/shared/prisma/prisma.service';

import type { WorkerEntity } from '../domain/worker.entity';
import type { CreateWorkerData, WorkerRepository } from '../domain/worker.repository';

@Injectable()
export class WorkerPrismaRepository implements WorkerRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<WorkerEntity[]> {
    return this.prisma.worker.findMany({
      where: { isActive: true },
      orderBy: { fullName: 'asc' },
    });
  }

  findById(id: string): Promise<WorkerEntity | null> {
    return this.prisma.worker.findUnique({ where: { id } });
  }

  create(data: CreateWorkerData): Promise<WorkerEntity> {
    return this.prisma.worker.create({ data });
  }
}
