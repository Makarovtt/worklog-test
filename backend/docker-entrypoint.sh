#!/bin/sh
set -e

echo "Applying Prisma migrations..."
npx prisma migrate deploy

if [ "${RUN_SEED}" = "true" ]; then
  echo "Running database seed..."
  npx tsx prisma/seed.ts || true
fi

exec "$@"
