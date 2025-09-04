import { Format } from 'logform';
import { format } from 'winston';
import type { LogEntry } from '../interfaces/log-entry.interface';

export const jsonFormatter: Format = format.combine(
  format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
  format.errors({ stack: true }),
  format.printf((info) => {
    const logEntry: LogEntry = {
      timestamp: String(info.timestamp),
      level: info.level,
      service: typeof info.service === 'string' ? info.service : 'unknown',
      message: String(info.message),
      ...(typeof info.meta === 'object' && info.meta !== null
        ? { meta: info.meta as Record<string, unknown> }
        : {}),
      ...(typeof info.requestId === 'string' ? { requestId: info.requestId } : {}),
    };

    // Include stack trace for errors
    if (info.stack) {
      logEntry.meta = { ...(logEntry.meta as Record<string, unknown>), stack: info.stack };
    }

    return JSON.stringify(logEntry);
  }),
);
