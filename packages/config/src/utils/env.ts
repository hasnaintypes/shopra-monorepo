/* global process */
import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';
import { envSchema } from './validators';

declare const __dirname: string | undefined;

// Get __dirname in both ESM and CJS

// Always load root .env (CJS/Jest compatible)
dotenv.config({
  path: path.resolve(typeof __dirname !== 'undefined' ? __dirname : '.', '../../../../.env'),
});

export function getConfig(): EnvConfig {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    throw result.error;
  }
  return result.data;
}
export type EnvConfig = z.infer<typeof envSchema>;
