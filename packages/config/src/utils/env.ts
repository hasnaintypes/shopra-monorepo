declare const __dirname: string | undefined;
/* global process */
import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';
import { envSchema } from './validators';

// Get __dirname in both ESM and CJS

function getDirname() {
  if (typeof __dirname !== 'undefined') {
    // CJS (Jest, Node)
    return __dirname;
  }
  // ESM
  // ESM: use eval to avoid static reference to import.meta
  try {
    return path.dirname(eval('import.meta.url && require("url").fileURLToPath(import.meta.url)'));
  } catch {
    throw new Error('Cannot determine __dirname');
  }
}

// Always load root .env
dotenv.config({ path: path.resolve(getDirname(), '../../../../.env') });

export function getConfig(): EnvConfig {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    throw result.error;
  }
  return result.data;
}
export type EnvConfig = z.infer<typeof envSchema>;
