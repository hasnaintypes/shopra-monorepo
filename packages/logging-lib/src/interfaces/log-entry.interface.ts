export interface LogEntry {
  timestamp: string | number;
  level: string;
  service: string;
  message: string;
  meta?: Record<string, unknown>;
  requestId?: string;
}

export interface LoggerConfig {
  serviceName: string;
  logToConsole?: boolean;
  logToFile?: boolean;
  logToKafka?: boolean;
  kafkaConfig?: {
    brokers: string[];
    topic: string;
    clientId?: string;
    retryAttempts?: number;
    retryDelayMs?: number;
  };
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
