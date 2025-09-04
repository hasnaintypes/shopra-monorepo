/* global process */
import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';
import { envSchema } from './validators';

declare var __dirname: string;
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
