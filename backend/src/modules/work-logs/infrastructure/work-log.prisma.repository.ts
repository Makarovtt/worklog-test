import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import { PrismaService } from '@/shared/prisma/prisma.service';

import type { WorkLogEntity } from '../domain/work-log.entity';
import type {
  CreateWorkLogData,
  ListWorkLogsFilter,
  ListWorkLogsResult,
  UpdateWorkLogData,
  WorkLogRepository,
} from '../domain/work-log.repository';

const INCLUDE_RELATIONS = {
  workType: { select: { id: true, name: true, unit: true } },
  worker: { select: { id: true, fullName: true, brigade: true } },
  createdBy: { select: { id: true, fullName: true } },
} as const;

@Injectable()
export class WorkLogPrismaRepository implements WorkLogRepository {
  constructor(private readonly prisma: PrismaService) {}

  async list(filter: ListWorkLogsFilter): Promise<ListWorkLogsResult> {
    const where = this.buildWhere(filter);

    const [total, items] = await this.prisma.$transaction([
      this.prisma.workLog.count({ where }),
      this.prisma.workLog.findMany({
        where,
        include: INCLUDE_RELATIONS,
        orderBy: [{ performedAt: filter.sortDirection }, { id: filter.sortDirection }],
        skip: (filter.page - 1) * filter.pageSize,
        take: filter.pageSize,
      }),
    ]);

    return { items, total };
  }

  findById(id: string): Promise<WorkLogEntity | null> {
    return this.prisma.workLog.findFirst({
      where: { id, deletedAt: null },
      include: INCLUDE_RELATIONS,
    });
  }

  create(data: CreateWorkLogData): Promise<WorkLogEntity> {
    return this.prisma.workLog.create({
      data: this.toCreateInput(data),
      include: INCLUDE_RELATIONS,
    });
  }

  async createMany(data: CreateWorkLogData[]): Promise<WorkLogEntity[]> {
    if (data.length === 0) {
      return [];
    }
    return this.prisma.$transaction(
      data.map((entry) =>
        this.prisma.workLog.create({
          data: this.toCreateInput(entry),
          include: INCLUDE_RELATIONS,
        }),
      ),
    );
  }

  update(id: string, data: UpdateWorkLogData): Promise<WorkLogEntity> {
    return this.prisma.workLog.update({
      where: { id },
      data,
      include: INCLUDE_RELATIONS,
    });
  }

  async updateManyDate(ids: string[], performedAt: Date): Promise<WorkLogEntity[]> {
    if (ids.length === 0) {
      return [];
    }
    await this.prisma.workLog.updateMany({
      where: { id: { in: ids }, deletedAt: null },
      data: { performedAt },
    });
    return this.prisma.workLog.findMany({
      where: { id: { in: ids } },
      include: INCLUDE_RELATIONS,
    });
  }

  async softDelete(ids: string[]): Promise<number> {
    if (ids.length === 0) {
      return 0;
    }
    const result = await this.prisma.workLog.updateMany({
      where: { id: { in: ids }, deletedAt: null },
      data: { deletedAt: new Date() },
    });
    return result.count;
  }

  async restore(ids: string[]): Promise<number> {
    if (ids.length === 0) {
      return 0;
    }
    const result = await this.prisma.workLog.updateMany({
      where: { id: { in: ids }, deletedAt: { not: null } },
      data: { deletedAt: null },
    });
    return result.count;
  }

  private buildWhere(filter: ListWorkLogsFilter): Prisma.WorkLogWhereInput {
    const where: Prisma.WorkLogWhereInput = { deletedAt: null };
    if (filter.dateFrom || filter.dateTo) {
      where.performedAt = {};
      if (filter.dateFrom) {
        where.performedAt.gte = filter.dateFrom;
      }
      if (filter.dateTo) {
        where.performedAt.lte = filter.dateTo;
      }
    }
    if (filter.workTypeId) {
      where.workTypeId = filter.workTypeId;
    }
    if (filter.workerId) {
      where.workerId = filter.workerId;
    }
    return where;
  }

  private toCreateInput(data: CreateWorkLogData): Prisma.WorkLogCreateInput {
    return {
      performedAt: data.performedAt,
      volume: data.volume,
      note: data.note ?? null,
      workType: { connect: { id: data.workTypeId } },
      worker: { connect: { id: data.workerId } },
      createdBy: { connect: { id: data.createdById } },
    };
  }
}
