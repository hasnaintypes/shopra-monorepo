# @shopra/kafka

Centralized, production-grade Kafka client for Shopra monorepo services (Node.js, TypeScript, Redpanda/Kafka).

---

## Overview

`@shopra/kafka-client` provides a unified, type-safe API for Kafka producers, consumers, and admin operations. It integrates with `@shopra/config` for environment management and `@shopra/logging` for structured logs. Designed for scalable microservices, it supports both ESM and CJS, and is tested with Redpanda (Kafka-compatible).

---

## Features

- **Unified Producer, Consumer, Admin APIs**: Simple, type-safe interfaces for all core Kafka operations.
- **Centralized Configuration**: Loads all connection and topic settings from `@shopra/config`.
- **Structured Logging**: All logs routed through `@shopra/logging` for consistency and observability.
- **TypeScript-first**: Strong types and autocompletion via shared types.
- **ESM/CJS Compatible**: Works in both module systems.
- **Integration-Tested**: Includes integration tests with Redpanda via Docker Compose.
- **Microservice-Ready**: Designed for scalable, maintainable architectures.

---

## Installation

```bash
pnpm add @shopra/kafka-client
```

> Requires `@shopra/config` and `@shopra/logging` in your workspace.

---

## Usage Example

```typescript
import { KafkaProducer, KafkaConsumer, KafkaAdmin } from '@shopra/kafka-client';

// Producer
const producer = new KafkaProducer();
await producer.connect();
await producer.send({ topic: 'my-topic', messages: [{ key: 'k', value: 'v' }] });
await producer.disconnect();

// Consumer
const consumer = new KafkaConsumer({ groupId: 'my-group' });
await consumer.connect();
await consumer.subscribe({ topic: 'my-topic', fromBeginning: true });
await consumer.run({ eachMessage: async ({ message }) => console.log(message.value?.toString()) });

// Admin
const admin = new KafkaAdmin();
await admin.connect();
const topics = await admin.listTopics();
await admin.disconnect();
```

---

## API Reference

### KafkaProducer

```typescript
constructor(config?: KafkaProducerConfig)
connect(): Promise<void>
send(params: { topic: string; messages: KafkaMessage[] }): Promise<void>
disconnect(): Promise<void>
```

### KafkaConsumer

```typescript
constructor(config: KafkaConsumerConfig)
connect(): Promise<void>
subscribe(params: { topic: string; fromBeginning?: boolean }): Promise<void>
run(params: { eachMessage: (payload: EachMessagePayload) => Promise<void> }): Promise<void>
disconnect(): Promise<void>
```

### KafkaAdmin

```typescript
constructor(config?: KafkaAdminConfig)
connect(): Promise<void>
listTopics(): Promise<string[]>
createTopics(params: { topics: string[] }): Promise<void>
disconnect(): Promise<void>
```

---

## Configuration

All configuration is managed via environment variables and validated by `@shopra/config`.

| Variable        | Default        | Description                              |
| --------------- | -------------- | ---------------------------------------- |
| KAFKA_BROKERS   | localhost:9092 | Kafka broker addresses (comma-separated) |
| KAFKA_CLIENT_ID | shopra-service | Kafka client ID                          |
| KAFKA_GROUP_ID  | shopra-group   | Kafka consumer group ID                  |
| KAFKA_SSL       | false          | Enable SSL connection                    |
| KAFKA_SASL_USER | -              | SASL username (if enabled)               |
| KAFKA_SASL_PASS | -              | SASL password (if enabled)               |
| KAFKA_LOG_LEVEL | info           | Kafka log level                          |

---

## Logging

All logs are routed through the shared `@shopra/logging` library, ensuring consistent, structured, and centralized logging across all services. Log entries include timestamp, service, level, message, and metadata.

---

## Error Handling

All Kafka errors are logged with context. The client will not crash on transient errors; instead, errors are logged and can be handled via callbacks or event listeners. For production, ensure you monitor logs for error patterns.

---

## Advanced Usage

- **Custom Serializers/Deserializers**: Extend producer/consumer classes for custom message formats.
- **Topic Management**: Use `KafkaAdmin` for creating, deleting, and listing topics.
- **Integration with NestJS**: Wrap the client in a NestJS provider for dependency injection.
- **Mocking for Tests**: Use dependency injection to mock Kafka clients in unit tests.

---

## Project Structure

```text
packages/kafka-client/
├── src/
│   ├── client/      # Producer, consumer, admin classes
│   ├── config/      # Kafka config loader
│   ├── types/       # Shared types
│   └── index.ts     # Entry point
├── test/            # Integration tests
├── package.json
├── jest.config.json
└── tsconfig.json
```

---

## Testing

Integration tests require a running Kafka broker (Redpanda recommended):

```bash
docker compose up -d
pnpm test -F kafka-client
```

---

## Dependencies

- [kafkajs](https://kafka.js.org/)
- [@shopra/config](../config/README.md)
- [@shopra/logging](../logging-lib/README.md)

---

## Contribution & Development

1. Follow existing code patterns
2. Add tests for new features
3. Update documentation
4. Ensure all tests pass

---

## License

MIT License - see LICENSE file for details.

---

## See Also

- [`@shopra/config`](../config)
- [`@shopra/logging`](../logging-lib)
- [`@shopra/prisma-client`](../prisma-client)

---

## Maintainers

- [Hasnain](https://github.com/hasnaintypes)

---

## Acknowledgements

- [kafkajs](https://kafka.js.org/) – Underlying Kafka client library
- [Redpanda](https://redpanda.com/) – Fast, Kafka-compatible streaming platform

Centralized, production-grade Kafka client for Shopra monorepo services (Node.js, TypeScript, Redpanda/Kafka).

---

## Overview

`@shopra/kafka-client` provides a unified, type-safe API for Kafka producers, consumers, and admin operations. It integrates with `@shopra/config` for environment management and `@shopra/logging` for structured logs. Designed for scalable microservices, it supports both ESM and CJS, and is tested with Redpanda (Kafka-compatible).

---

## Features

- **Unified Producer, Consumer, Admin APIs**: Simple, type-safe interfaces for all core Kafka operations.
- **Centralized Configuration**: Loads all connection and topic settings from `@shopra/config`.
- **Structured Logging**: All logs routed through `@shopra/logging` for consistency and observability.
- **TypeScript-first**: Strong types and autocompletion via shared types.
- **ESM/CJS Compatible**: Works in both module systems.
- **Integration-Tested**: Includes integration tests with Redpanda via Docker Compose.
- **Microservice-Ready**: Designed for scalable, maintainable architectures.

---

## Installation

```bash
pnpm add @shopra/kafka-client
```

> Requires `@shopra/config` and `@shopra/logging` in your workspace.

---

## Usage Example

```typescript
import { KafkaProducer, KafkaConsumer, KafkaAdmin } from '@shopra/kafka-client';

// Producer
const producer = new KafkaProducer();
await producer.connect();
await producer.send({ topic: 'my-topic', messages: [{ key: 'k', value: 'v' }] });
await producer.disconnect();

// Consumer
const consumer = new KafkaConsumer({ groupId: 'my-group' });
await consumer.connect();
await consumer.subscribe({ topic: 'my-topic', fromBeginning: true });
await consumer.run({ eachMessage: async ({ message }) => console.log(message.value?.toString()) });

// Admin
const admin = new KafkaAdmin();
await admin.connect();
const topics = await admin.listTopics();
await admin.disconnect();
```

---

## API Reference

### KafkaProducer

```typescript
constructor(config?: KafkaProducerConfig)
connect(): Promise<void>
send(params: { topic: string; messages: KafkaMessage[] }): Promise<void>
disconnect(): Promise<void>
```

### KafkaConsumer

```typescript
constructor(config: KafkaConsumerConfig)
connect(): Promise<void>
subscribe(params: { topic: string; fromBeginning?: boolean }): Promise<void>
run(params: { eachMessage: (payload: EachMessagePayload) => Promise<void> }): Promise<void>
disconnect(): Promise<void>
```

### KafkaAdmin

```typescript
constructor(config?: KafkaAdminConfig)
connect(): Promise<void>
listTopics(): Promise<string[]>
createTopics(params: { topics: string[] }): Promise<void>
disconnect(): Promise<void>
```

---

## Configuration

All configuration is managed via environment variables and validated by `@shopra/config`.

| Variable        | Default        | Description                              |
| --------------- | -------------- | ---------------------------------------- |
| KAFKA_BROKERS   | localhost:9092 | Kafka broker addresses (comma-separated) |
| KAFKA_CLIENT_ID | shopra-service | Kafka client ID                          |
| KAFKA_GROUP_ID  | shopra-group   | Kafka consumer group ID                  |
| KAFKA_SSL       | false          | Enable SSL connection                    |
| KAFKA_SASL_USER | -              | SASL username (if enabled)               |
| KAFKA_SASL_PASS | -              | SASL password (if enabled)               |
| KAFKA_LOG_LEVEL | info           | Kafka log level                          |

---

## Logging

All logs are routed through the shared `@shopra/logging` library, ensuring consistent, structured, and centralized logging across all services. Log entries include timestamp, service, level, message, and metadata.

---

## Error Handling

All Kafka errors are logged with context. The client will not crash on transient errors; instead, errors are logged and can be handled via callbacks or event listeners. For production, ensure you monitor logs for error patterns.

---

## Advanced Usage

- **Custom Serializers/Deserializers**: Extend producer/consumer classes for custom message formats.
- **Topic Management**: Use `KafkaAdmin` for creating, deleting, and listing topics.
- **Integration with NestJS**: Wrap the client in a NestJS provider for dependency injection.
- **Mocking for Tests**: Use dependency injection to mock Kafka clients in unit tests.

---

## Project Structure

```
packages/kafka-client/
├── src/
│   ├── client/      # Producer, consumer, admin classes
│   ├── config/      # Kafka config loader
│   ├── types/       # Shared types
│   └── index.ts     # Entry point
├── test/            # Integration tests
├── package.json
├── jest.config.json
└── tsconfig.json
```

---

## Testing

Integration tests require a running Kafka broker (Redpanda recommended):

```bash
docker compose up -d
pnpm test -F kafka-client
```

---

## Dependencies

- [kafkajs](https://kafka.js.org/)
- [@shopra/config](../config/README.md)
- [@shopra/logging](../logging-lib/README.md)

---

## Contribution & Development

1. Follow existing code patterns
2. Add tests for new features
3. Update documentation
4. Ensure all tests pass

---

## License

MIT License - see LICENSE file for details.

---

## See Also

- [`@shopra/config`](../config)
- [`@shopra/logging`](../logging-lib)
- [`@shopra/prisma-client`](../prisma-client)

---

## Maintainers

- [Hasnain](https://github.com/hasnaintypes)

---

## Acknowledgements

- [kafkajs](https://kafka.js.org/) – Underlying Kafka client library
- [Redpanda](https://redpanda.com/) – Fast, Kafka-compatible streaming platform
