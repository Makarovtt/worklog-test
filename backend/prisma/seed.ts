import { MeasurementUnit, PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const PASSWORD_HASH_ROUNDS = 10;

const DEFAULT_ADMIN = {
  login: 'admin',
  password: 'admin123',
  fullName: 'Иванов Иван Иванович',
  role: UserRole.ADMIN,
};

const DEFAULT_FOREMAN = {
  login: 'foreman',
  password: 'foreman123',
  fullName: 'Петров Пётр Петрович',
  role: UserRole.FOREMAN,
};

const WORK_TYPES: Array<{ name: string; unit: MeasurementUnit }> = [
  { name: 'Кладка перегородок', unit: MeasurementUnit.CUBIC_METER },
  { name: 'Монтаж опалубки', unit: MeasurementUnit.SQUARE_METER },
  { name: 'Заливка бетона', unit: MeasurementUnit.CUBIC_METER },
  { name: 'Армирование плиты', unit: MeasurementUnit.TON },
  { name: 'Штукатурка стен', unit: MeasurementUnit.SQUARE_METER },
  { name: 'Устройство стяжки пола', unit: MeasurementUnit.SQUARE_METER },
  { name: 'Монтаж металлоконструкций', unit: MeasurementUnit.TON },
  { name: 'Прокладка кабеля', unit: MeasurementUnit.LINEAR_METER },
  { name: 'Установка окон', unit: MeasurementUnit.PIECE },
  { name: 'Демонтажные работы', unit: MeasurementUnit.HOUR },
];

const WORKERS: Array<{ fullName: string; brigade: string }> = [
  { fullName: 'Сидоров Алексей Викторович', brigade: 'Бригада №1' },
  { fullName: 'Кузнецов Михаил Сергеевич', brigade: 'Бригада №1' },
  { fullName: 'Смирнов Денис Александрович', brigade: 'Бригада №2' },
  { fullName: 'Васильев Олег Юрьевич', brigade: 'Бригада №2' },
  { fullName: 'Морозов Сергей Иванович', brigade: 'Бригада №3' },
];

function buildPerformedAt(daysAgo: number): Date {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() - daysAgo);
  return date;
}

async function seedUsers() {
  const passwordHashAdmin = await bcrypt.hash(DEFAULT_ADMIN.password, PASSWORD_HASH_ROUNDS);
  const passwordHashForeman = await bcrypt.hash(DEFAULT_FOREMAN.password, PASSWORD_HASH_ROUNDS);

  const admin = await prisma.user.upsert({
    where: { login: DEFAULT_ADMIN.login },
    update: {},
    create: {
      login: DEFAULT_ADMIN.login,
      passwordHash: passwordHashAdmin,
      fullName: DEFAULT_ADMIN.fullName,
      role: DEFAULT_ADMIN.role,
    },
  });

  const foreman = await prisma.user.upsert({
    where: { login: DEFAULT_FOREMAN.login },
    update: {},
    create: {
      login: DEFAULT_FOREMAN.login,
      passwordHash: passwordHashForeman,
      fullName: DEFAULT_FOREMAN.fullName,
      role: DEFAULT_FOREMAN.role,
    },
  });

  return { admin, foreman };
}

async function seedWorkTypes() {
  await Promise.all(
    WORK_TYPES.map((workType) =>
      prisma.workType.upsert({
        where: { name: workType.name },
        update: {},
        create: workType,
      }),
    ),
  );
  return prisma.workType.findMany();
}

async function seedWorkers() {
  const existing = await prisma.worker.count();
  if (existing === 0) {
    await prisma.worker.createMany({ data: WORKERS });
  }
  return prisma.worker.findMany();
}

async function seedWorkLogs(params: {
  createdById: string;
  workTypeIds: string[];
  workerIds: string[];
}) {
  const existing = await prisma.workLog.count();
  if (existing > 0) {
    return;
  }

  const totalEntries = 30;
  const entries = Array.from({ length: totalEntries }, (_, index) => {
    const workTypeId = params.workTypeIds[index % params.workTypeIds.length] ?? params.workTypeIds[0];
    const workerId = params.workerIds[index % params.workerIds.length] ?? params.workerIds[0];
    const daysAgo = Math.floor(index / 3);
    const volume = Number((5 + Math.random() * 40).toFixed(2));
    return {
      performedAt: buildPerformedAt(daysAgo),
      workTypeId: workTypeId as string,
      workerId: workerId as string,
      volume,
      createdById: params.createdById,
    };
  });

  await prisma.workLog.createMany({ data: entries });
}

async function main() {
  const { admin } = await seedUsers();
  const workTypes = await seedWorkTypes();
  const workers = await seedWorkers();

  await seedWorkLogs({
    createdById: admin.id,
    workTypeIds: workTypes.map((workType) => workType.id),
    workerIds: workers.map((worker) => worker.id),
  });

  console.warn('Seed completed successfully');
}

main()
  .catch((error) => {
    console.error('Seed failed', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
