import type { Prisma } from '@prisma/client';

export interface WorkLogEntity {
  id: string;
  performedAt: Date;
  workTypeId: string;
  volume: Prisma.Decimal;
  workerId: string;
  note: string | null;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  workType: { id: string; name: string; unit: string };
  worker: { id: string; fullName: string; brigade: string | null };
  createdBy: { id: string; fullName: string };
}
