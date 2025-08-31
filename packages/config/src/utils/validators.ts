import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
  PORT: z.string().regex(/^\d+$/).default('3000'),
  LOG_LEVEL: z.enum(['info', 'warn', 'error', 'debug']).default('info'),
  API_URL: z.string().url().default('http://localhost:3000'),
});
