import 'reflect-metadata';

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { NestFactory } from '@nestjs/core';

import { AppModule } from '../src/app.module';
import { buildSwaggerDocument } from '../src/config/swagger';

async function main() {
  process.env.JWT_SECRET ??= 'export-only-secret-placeholder-please-32chars';
  process.env.DATABASE_URL ??= 'postgresql://placeholder:placeholder@localhost:5432/placeholder';

  const app = await NestFactory.create(AppModule, { logger: false });
  await app.init();

  const document = buildSwaggerDocument(app);
  const outputPath = resolve(__dirname, '..', 'openapi.json');
  writeFileSync(outputPath, JSON.stringify(document, null, 2), 'utf-8');

  await app.close();
  console.warn(`OpenAPI schema exported to ${outputPath}`);
}

main().catch((error) => {
  console.error('Failed to export OpenAPI schema', error);
  process.exit(1);
});
