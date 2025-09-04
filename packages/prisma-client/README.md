# @shopra/prisma

Centralized Prisma client for the Shopra monorepo (NestJS, MongoDB)

## Overview

`@shopra/prisma` provides a reusable, production-grade Prisma client for all Shopra backend services. It integrates with NestJS, supports MongoDB, and enforces strict configuration and logging via `@shopra/config` and `@shopra/logging`.

## Features

- Global NestJS module for dependency injection
- Extends PrismaClient with lifecycle hooks (`onModuleInit`, `onModuleDestroy`)
- All environment variables accessed via `@shopra/config` (never directly from `process.env`)
- All logging routed through `@shopra/logging` (query, connection, errors)
- MongoDB support via Prisma
- Strong TypeScript types
- Unit tests with Jest and mocks

## Installation

```bash
pnpm add @shopra/prisma --workspace=<your-service>
pnpm add @shopra/config --workspace=<your-service>
pnpm add @shopra/logging --workspace=<your-service>
```

## Usage Example

```typescript
import { ConfigModule } from '@shopra/config';
import { LoggerModule } from '@shopra/logging';
import { PrismaModule, PrismaService } from '@shopra/prisma';

@Module({
  imports: [ConfigModule, LoggerModule, PrismaModule],
})
export class AppModule {
  constructor(private readonly prisma: PrismaService) {}

  async findUsers() {
    return this.prisma.user.findMany();
  }
}
```

## Migrations

Run migrations for the shared client:

```bash
cd packages/prisma-client
pnpm prisma migrate dev
```

## Generate Prisma Client

```bash
cd packages/prisma-client
pnpm prisma generate
```

## Testing

Run unit tests:

```bash
pnpm test --workspace=prisma-client
```

## Dependencies

- [NestJS](https://nestjs.com/)
- [Prisma](https://www.prisma.io/)
- [MongoDB](https://www.mongodb.com/)
- [@shopra/config](../config/README.md)
- [@shopra/logging](../logging-lib/README.md)

## Contribution & Development

Contributions are welcome. Please ensure new features are covered by unit tests. See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## Architecture

The Prisma client is shared across all backend services and is integrated with centralized config and logging:

```
svc-auth      svc-product      svc-order
    \             |             /
                @shopra/prisma
                /         \
      @shopra/config   @shopra/logging
```
