import { getConfig } from '@shopra/config';
import * as fs from 'fs-extra';
import type { TransformableInfo } from 'logform';
import process from 'node:process';
import * as path from 'path';
import DailyRotateFile from 'winston-daily-rotate-file';

// HACK: Patch DailyRotateFile to ensure logs directory exists before writing
class PatchedDailyRotateFile extends DailyRotateFile {
  log(info: TransformableInfo, callback: () => void) {
    try {
      const logsDir = path.resolve(process.cwd(), 'logs');
      fs.ensureDirSync(logsDir);
    } catch (err) {
      // NOTE: Log to console only if available
      if (typeof console !== 'undefined') {
        // eslint-disable-next-line no-undef
        console.error('Failed to ensure logs directory:', err);
      }
    }
    if (typeof super.log === 'function') {
      super.log(info, callback);
    }
  }
}

export class FileTransport {
  private static ensureLogsDirectory(): void {
    const logsDir = path.resolve(process.cwd(), 'logs');
    fs.ensureDirSync(logsDir);
  }

  private static getLoggingConfig() {
    const config = getConfig();
    return {
      compression: config.LOG_FILE_COMPRESSION,
      retentionDays: config.LOG_FILE_RETENTION_DAYS,
    };
  }

  static createInfoTransport(): InstanceType<typeof DailyRotateFile> {
    this.ensureLogsDirectory();
    const { compression, retentionDays } = this.getLoggingConfig();
    return new PatchedDailyRotateFile({
      filename: path.resolve(process.cwd(), 'logs', 'info-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'info',
      maxSize: '20m',
      zippedArchive: compression,
      maxFiles: `${retentionDays}d`,
      auditFile: path.resolve(process.cwd(), 'logs', '.audit-info.json'),
    });
  }

  static createWarnTransport(): InstanceType<typeof DailyRotateFile> {
    this.ensureLogsDirectory();
    const { compression, retentionDays } = this.getLoggingConfig();
    return new PatchedDailyRotateFile({
      filename: path.resolve(process.cwd(), 'logs', 'warn-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'warn',
      maxSize: '20m',
      zippedArchive: compression,
      maxFiles: `${retentionDays}d`,
      auditFile: path.resolve(process.cwd(), 'logs', '.audit-warn.json'),
    });
  }

  static createErrorTransport(): InstanceType<typeof DailyRotateFile> {
    this.ensureLogsDirectory();
    const { compression, retentionDays } = this.getLoggingConfig();
    return new PatchedDailyRotateFile({
      filename: path.resolve(process.cwd(), 'logs', 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      zippedArchive: compression,
      maxFiles: `${retentionDays}d`,
      auditFile: path.resolve(process.cwd(), 'logs', '.audit-error.json'),
    });
  }

  static createAllTransports(): Array<InstanceType<typeof DailyRotateFile>> {
    // NOTE: Create info, warn, and error transports for local logs
    return [this.createInfoTransport(), this.createWarnTransport(), this.createErrorTransport()];
  }
}
