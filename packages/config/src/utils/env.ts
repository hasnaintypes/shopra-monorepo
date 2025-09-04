/* global process */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';
import { envSchema } from './validators';

// Get __dirname in ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Always load root .env
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

export function getConfig(): EnvConfig {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    throw result.error;
  }
  return result.data;
}
export type EnvConfig = z.infer<typeof envSchema>;
