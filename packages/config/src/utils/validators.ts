import { z } from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  LOG_LEVEL: z.enum(['info', 'warn', 'error', 'debug']).default('info'),
  LOG_TO_CONSOLE: z.preprocess((v) => v === 'true' || v === true, z.boolean()).default(false),
  LOG_TO_FILE: z.preprocess((v) => v !== 'false' && v !== false, z.boolean()).default(true),
  LOG_TO_KAFKA: z.preprocess((v) => v === 'true' || v === true, z.boolean()).default(false),
  SERVICE_NAME: z.string().default('logging-lib'),
  KAFKA_BROKERS: z.string().default('localhost:9092'),
  KAFKA_LOG_TOPIC: z.string().default('logs'),
  KAFKA_CLIENT_ID: z.string().default('logging-lib'),
  LOG_FILE_COMPRESSION: z.preprocess((v) => v === 'true' || v === true, z.boolean()).default(false),
  LOG_FILE_RETENTION_DAYS: z.preprocess((v) => Number(v), z.number().int().min(1)).default(7),
  KAFKA_RETRY_ATTEMPTS: z.preprocess((v) => Number(v), z.number().int().min(0)).default(3),
  KAFKA_RETRY_DELAY_MS: z.preprocess((v) => Number(v), z.number().int().min(0)).default(1000),
  ENABLE_QUERY_LOGGING: z.preprocess((v) => v === 'true' || v === true, z.boolean()).default(false),
});
