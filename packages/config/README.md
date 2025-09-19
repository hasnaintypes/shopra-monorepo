# @shopra/config

Centralized configuration management for Shopra monorepo services and packages. Provides type-safe environment variable loading, validation, and utility functions for consistent, secure configuration across all projects.

**All environment variables must be added in the root `.env` file. Individual services/packages will automatically use them via `@shopra/config`. Do not add or use `.env` files in packages/services except for `.env.example` for documentation. Never access `process.env` directly—always use `@shopra/config`.**

## Features

- Type-safe config loading from `.env` files
- Environment variable validation utilities
- Supports multiple environments (development, test, production)
- Utility functions for config parsing and validation
- Zero external runtime dependencies

## Installation

```sh
pnpm add @shopra/config
```

## Usage

Import and use the config utilities in your service or package:

```ts
import { getEnv, validateEnv } from '@shopra/config';

const env = getEnv();
validateEnv(env);
console.log(env.DATABASE_URL);
```

### Example: Loading and Validating Environment Variables

```ts
import { getEnv, validateEnv } from '@shopra/config';

const env = getEnv();
validateEnv(env); // Throws if required variables are missing or invalid
```

## API Reference

### `getEnv(): Record<string, string>`

Loads environment variables from `.env` files and returns them as a key-value object.

### `validateEnv(env: Record<string, string>): void`

Validates the provided environment object. Throws an error if required variables are missing or invalid.

### Utility Functions

- `parseNumber(value: string): number`
- `isValidUrl(value: string): boolean`
- See `src/utils/validators.ts` for more.

## Project Structure

```
packages/config/
├── src/
│   ├── index.ts
│   └── utils/
│       ├── env.ts
│       └── validators.ts
├── package.json
├── tsconfig.json
└── .env.test
```

## Testing

Run tests using your monorepo's test runner:

```sh
pnpm test -F @shopra/config
```

## Contributing

- Follow monorepo code style and commit conventions
- Add/extend validators in `src/utils/validators.ts`
- Document new config utilities in this README

## License

MIT © Shopra Contributors
