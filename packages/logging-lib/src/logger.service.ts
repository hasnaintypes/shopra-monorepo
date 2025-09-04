import { Injectable, Scope } from '@nestjs/common';
import { getConfig } from '@shopra/config';
import { createLogger, type Logger as WinstonLogger } from 'winston';
import { jsonFormatter } from './formatters/json-formatter';
import type { LogEntry, LoggerConfig, LogLevel } from './interfaces/log-entry.interface';
import { ConsoleTransport } from './transports/console.transport';
import { FileTransport } from './transports/file.transport';
import { KafkaTransport } from './transports/kafka.transport';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService {
  private logger!: WinstonLogger;
  private kafkaTransport?: KafkaTransport;
  private serviceName: string;
  private config = getConfig();

  constructor() {
    this.serviceName = this.config.SERVICE_NAME;
    this.initializeLogger();
  }

  private initializeLogger(): void {
    const config = this.getConfig();
    const transports = [];

    // NOTE: File transport is enabled by default
    if (config.logToFile) {
      transports.push(...FileTransport.createAllTransports());
    }

    // NOTE: Console transport is optional (controlled by config)
    if (config.logToConsole) {
      transports.push(ConsoleTransport.create());
    }

    this.logger = createLogger({
      level: this.config.LOG_LEVEL,
      format: jsonFormatter,
      defaultMeta: { service: this.serviceName },
      transports,
    });

    // TODO: Add Kafka transport when client is ready
    if (config.logToKafka && config.kafkaConfig) {
      this.kafkaTransport = new KafkaTransport(config.kafkaConfig);
    }
  }

  private getConfig(): LoggerConfig {
    return {
      serviceName: this.serviceName,
      logToConsole: this.config.LOG_TO_CONSOLE,
      logToFile: this.config.LOG_TO_FILE,
      logToKafka: this.config.LOG_TO_KAFKA,
      kafkaConfig: this.config.LOG_TO_KAFKA
        ? {
            brokers: this.config.KAFKA_BROKERS.split(','),
            topic: this.config.KAFKA_LOG_TOPIC,
            clientId: this.config.KAFKA_CLIENT_ID,
            retryAttempts: this.config.KAFKA_RETRY_ATTEMPTS,
            retryDelayMs: this.config.KAFKA_RETRY_DELAY_MS,
          }
        : undefined,
    };
  }

  private async sendToKafka(
    level: LogLevel,
    message: string,
    meta?: Record<string, unknown>,
  ): Promise<void> {
    // NOTE: Kafka disabled, no-op
    if (!this.kafkaTransport) return;

    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      service: this.serviceName,
      message,
      ...(meta && { meta }),
      ...(this.getRequestId() && { requestId: this.getRequestId() }),
    };

    // FIXME: Add retry/error handling if Kafka fails
    await this.kafkaTransport.send(logEntry);
  }

  private getRequestId(): string | undefined {
    // TODO: Implement requestId propagation (e.g. AsyncLocalStorage / CLS)
    return undefined;
  }

  setContext(context: string): LoggerService {
    // REVIEW: This creates a whole new LoggerService instance.
    // OPTIMIZE: Consider reusing the logger with updated context instead.
    const contextLogger = new LoggerService();
    contextLogger.serviceName = `${this.serviceName}:${context}`;
    contextLogger.initializeLogger();
    return contextLogger;
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    this.logger.debug(message, { meta });
    // NOTE: swallow Kafka errors silently
    this.sendToKafka('debug', message, meta).catch(() => {});
  }

  info(message: string, meta?: Record<string, unknown>): void {
    this.logger.info(message, { meta });
    this.sendToKafka('info', message, meta).catch(() => {});
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    this.logger.warn(message, { meta });
    this.sendToKafka('warn', message, meta).catch(() => {});
  }

  error(message: string, error?: Error | string, meta?: Record<string, unknown>): void {
    const errorMeta = { ...meta };

    if (error instanceof Error) {
      errorMeta.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    } else if (typeof error === 'string') {
      errorMeta.error = error;
    }

    this.logger.error(message, { meta: errorMeta });
    // NOTE: ignore Kafka errors for now
    this.sendToKafka('error', message, errorMeta).catch(() => {});
  }

  async onModuleDestroy(): Promise<void> {
    // NOTE: Gracefully close Kafka connection on shutdown
    if (this.kafkaTransport) {
      await this.kafkaTransport.disconnect();
    }
  }
}
