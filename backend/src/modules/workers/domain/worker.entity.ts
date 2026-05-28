export interface WorkerEntity {
  id: string;
  fullName: string;
  brigade: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
