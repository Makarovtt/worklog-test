process.env.NODE_ENV = 'test';
process.env.DATABASE_URL =
  process.env.DATABASE_URL ?? 'postgresql://worklog:worklog@localhost:5433/worklog_test?schema=public';
process.env.JWT_SECRET = 'e2e-test-secret-please-ignore-32characters';
process.env.JWT_EXPIRES_IN = '1h';
process.env.CORS_ORIGIN = 'http://localhost:5173';
process.env.PORT = '3001';
