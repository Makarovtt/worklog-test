import { z } from 'zod';

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url().default('http://localhost:3000/api'),
});

const parsed = envSchema.safeParse(import.meta.env);
if (!parsed.success) {
  throw new Error(`Некорректные переменные окружения: ${parsed.error.message}`);
}

export const env = parsed.data;
