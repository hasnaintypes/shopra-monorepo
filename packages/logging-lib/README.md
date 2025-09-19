# @shopra/logging

Centralized, production-grade logging library for Shopra monorepo services (NestJS, Winston, Kafka).

## Overview

`@shopra/logging` provides a consistent, structured logging API for all backend services. It supports file, console, and Kafka transports, with log rotation, strict formatting, and integration with `@shopra/config` for environment management.

## Features

- Consistent API across all services
- Structured log formatting (timestamp, service name, level, requestId)
- Centralized log storage in `/logs`
- Optional Kafka integration for real-time log streaming
- Configurable transports: file, console, Kafka
- Contextual logging for service/module scope
- Secure: no sensitive data logged by default

## Installation

```bash
pnpm add @shopra/logging
```

## Usage Example

```typescript
import { Module } from '@nestjs/common';
import { LoggerModule } from '@shopra/logging';

@Module({
  imports: [LoggerModule],
})
export class AppModule {}

import { Injectable } from '@nestjs/common';
import { LoggerService } from '@shopra/logging';

@Injectable()
export class UserService {
  constructor(private readonly logger: LoggerService) {}

  async createUser(userData: { id: string; email: string }) {
    this.logger.info('Creating new user', { userId: userData.id });
    try {
      // ... user creation logic
      this.logger.info('User created successfully', {
        userId: userData.id,
        email: userData.email,
      });
    } catch (error) {
      this.logger.error('Failed to create user', error, {
        userId: userData.id,
      });
      throw error;
    }
  }
}

// Context-specific logging
@Injectable()
export class PaymentService {
  private logger = this.loggerService.setContext('PaymentService');
  constructor(private readonly loggerService: LoggerService) {}
  processPayment(paymentId: string) {
    this.logger.info('Processing payment', { paymentId });
  }
}
```

## Configuration

All configuration is managed via environment variables and validated by `@shopra/config`.

| Variable                | Default         | Description                              |
| ----------------------- | --------------- | ---------------------------------------- |
| SERVICE_NAME            | unknown-service | Name of the service                      |
| LOG_LEVEL               | info            | Log level (debug, info, warn, error)     |
| LOG_TO_CONSOLE          | false           | Enable console logging                   |
| LOG_TO_FILE             | true            | Enable file logging                      |
| LOG_TO_KAFKA            | false           | Enable Kafka logging                     |
| KAFKA_BROKERS           | localhost:9092  | Kafka broker addresses (comma-separated) |
| KAFKA_LOG_TOPIC         | logs            | Kafka topic for logs                     |
| KAFKA_CLIENT_ID         | logging-lib     | Kafka client ID                          |
| LOG_FILE_COMPRESSION    | false           | Compress rotated log files               |
| LOG_FILE_RETENTION_DAYS | 7               | Retention days for log files             |
| KAFKA_RETRY_ATTEMPTS    | 3               | Kafka send retry attempts                |
| KAFKA_RETRY_DELAY_MS    | 1000            | Kafka retry delay (ms)                   |

## Log File Structure

Logs are organized in the `/logs` directory:

```
/logs/
├── info-YYYY-MM-DD.log     # Info level logs
├── warn-YYYY-MM-DD.log     # Warning level logs
├── error-YYYY-MM-DD.log    # Error level logs
└── .audit-*.json           # Rotation audit files
```

### Log Format

Each log entry is a single JSON line:

```json
{
  "timestamp": "2025-09-01T10:00:00.123Z",
  "level": "info",
  "service": "svc-auth",
  "message": "User created successfully",
  "meta": {
    "userId": "user_123",
    "email": "user@example.com"
  },
  "requestId": "req_abc123"
}
```

## API Reference

### LoggerService Methods

```typescript
logger.info(message: string, meta?: Record<string, unknown>): void
logger.warn(message: string, meta?: Record<string, unknown>): void
logger.error(message: string, error?: Error | string, meta?: Record<string, unknown>): void
logger.debug(message: string, meta?: Record<string, unknown>): void
logger.setContext(context: string): LoggerService
```

### Error Logging Examples

```typescript
try {
  // ... some operation
} catch (error) {
  logger.error('Operation failed', error, { operationId: '123' });
}
logger.error('Validation failed', 'Invalid email format', { email: 'invalid-email' });
logger.error('Database connection lost');
```

## Testing

Run tests with:

```bash
pnpm test
pnpm test:watch
pnpm test:coverage
```

## Dependencies

- [winston](https://github.com/winstonjs/winston)
- [winston-daily-rotate-file](https://github.com/winstonjs/winston-daily-rotate-file)
- [kafkajs](https://kafka.js.org/)
- [fs-extra](https://github.com/jprichardson/node-fs-extra)
- [@nestjs/common](https://docs.nestjs.com/)
- [jest](https://jestjs.io/)

## Production Considerations

### Log Rotation

- Files rotate daily automatically
- Retention days configurable via LOG_FILE_RETENTION_DAYS
- Maximum file size: 20MB

### Performance

- Kafka failures do not break application flow
- Transient service scope for optimal memory usage
- Async Kafka operations to prevent blocking

### Security

- No sensitive data logged by default
- Structured logging prevents log injection
- Configurable log levels for production

## Contribution & Development

1. Follow existing code patterns
2. Add tests for new features
3. Update documentation
4. Ensure all tests pass

## License

MIT License - see LICENSE file for details.
