import { INestApplication, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import type { EnvConfig } from '@shopra/config';
import { getConfig } from '@shopra/config';
import type { LoggerService as ILoggerService } from '@shopra/logging';

interface QueryEvent {
  timestamp: Date;
  query: string;
  params: string;
  duration: number;
  target: string;
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger: ILoggerService;
  private readonly config: EnvConfig;

  constructor(logger: ILoggerService) {
    const config: EnvConfig = getConfig();

    if (!config.DATABASE_URL || config.DATABASE_URL.trim() === '') {
      // SECURITY: fail fast if DB URL is missing
      logger?.error?.(
        '[@shopra/prisma] Missing DATABASE_URL. Please set it in .env or CI environment.',
      );
      throw new Error('[@shopra/prisma] DATABASE_URL is required but missing.');
    }

    super({
      datasources: {
        db: { url: config.DATABASE_URL },
      },
      log:
        config.NODE_ENV !== 'production'
          ? ['info', 'warn', 'error'] // NOTE: removed "query" from default
          : ['info', 'warn', 'error'],
    });

    this.logger = logger;
    this.config = config;

    // REVIEW: attach query logger only if explicitly enabled (safer than NODE_ENV check)
    if (config.NODE_ENV !== 'production' && config.ENABLE_QUERY_LOGGING === true) {
      this.attachQueryLogger();
    }
  }

  /**
   * REVIEW: Query logger for debugging (do not use in production).
   */
  private attachQueryLogger(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.$on as any)('query', (e: QueryEvent) => {
      this.logger.debug(`[Prisma Query] ${e.query} ${JSON.stringify(e.params)} (${e.duration}ms)`);
    });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
    this.logger.info('[@shopra/prisma] Connected to database');
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    this.logger.info('[@shopra/prisma] Disconnected from database');
  }

  enableShutdownHooks(app: INestApplication): void {
    app.enableShutdownHooks();
  }
}
