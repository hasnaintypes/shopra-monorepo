/* global process */
import { envSchema } from './validators';
import { z } from 'zod';
/**
 * Validates and returns the environment configuration object.
 * @return {EnvConfig} The validated and typed environment config.
 * @throws If validation fails.
 * @example
 * const config = getConfig();
 */
export function getConfig(): EnvConfig {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    throw result.error;
  }
  return result.data;
}
export type EnvConfig = z.infer<typeof envSchema>;
