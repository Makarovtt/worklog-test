import { execSync } from 'node:child_process';

const DEFAULT_TEST_DATABASE_URL =
  'postgresql://worklog:worklog@localhost:5433/worklog_test?schema=public';

export default async function globalSetup(): Promise<void> {
  const env = {
    ...process.env,
    DATABASE_URL: process.env.DATABASE_URL ?? DEFAULT_TEST_DATABASE_URL,
  };

  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    env,
  });
}
