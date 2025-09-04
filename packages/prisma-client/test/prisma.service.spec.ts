/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from '@prisma/client';
import { LoggerService } from '@shopra/logging';
import { mockDeep } from 'jest-mock-extended';
import process from 'process';
import { PrismaService } from '../src/prisma.service';

const mockLogger = mockDeep<LoggerService>();

describe('PrismaService', () => {
  let prismaService: PrismaService;
  let mockPrisma: jest.Mocked<PrismaClient>;
  let originalNodeEnv: string | undefined;

  beforeEach(() => {
    // SAVE: store current environment variable
    originalNodeEnv = process.env.NODE_ENV;

    // MOCK: create a mocked PrismaClient for each test
    mockPrisma = mockDeep<PrismaClient>();

    // INIT: instantiate PrismaService with mocked logger
    prismaService = new PrismaService(mockLogger);

    // HACK: replace real connect/disconnect with mocks
    prismaService.$connect = mockPrisma.$connect;
    prismaService.$disconnect = mockPrisma.$disconnect;

    // CLEAR: reset logger mock calls between tests
    jest.clearAllMocks();
  });

  afterEach(() => {
    // RESTORE: reset NODE_ENV after each test to avoid leakage
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('should connect on module init', async () => {
    await prismaService.onModuleInit();
    expect(prismaService.$connect).toHaveBeenCalledTimes(1);
  });

  it('should disconnect on module destroy', async () => {
    await prismaService.onModuleDestroy();
    expect(prismaService.$disconnect).toHaveBeenCalledTimes(1);
  });

  it('should log queries in development mode', () => {
    process.env.NODE_ENV = 'development';

    let capturedCb: ((e: any) => void) | undefined;

    // Stub $on to capture the callback instead of using Prisma’s internal system
    const service = new PrismaService(mockLogger);
    type PrismaOn = (event: string, cb: (e: any) => void) => PrismaService;
    const mockOn: PrismaOn = (event, cb) => {
      if (event === 'query') capturedCb = cb;
      return service;
    };
    service.$on = mockOn;

    // Re-attach logger with our stubbed $on
    (service as any).attachQueryLogger();

    // Fake query event
    const fakeQueryEvent = {
      timestamp: new Date(),
      query: 'SELECT 1',
      params: '[]',
      duration: 1,
      target: 'db',
    };

    // Act: trigger callback
    capturedCb?.(fakeQueryEvent);

    // Assert
    expect(mockLogger.debug).toHaveBeenCalledWith(expect.stringContaining('SELECT 1'));
  });

  it('should not log queries in production mode', () => {
    // CONFIG: simulate production environment
    process.env.NODE_ENV = 'production';

    const service = new PrismaService(mockLogger);

    expect(service).toBeDefined();
    // REVIEW: ensure no debug logs in production
    expect(mockLogger.debug).not.toHaveBeenCalled();
  });

  it('should throw and log error if DATABASE_URL is missing', async () => {
    // RESET: clear cached modules to allow re-import with mocked config
    jest.resetModules();

    // MOCK: override @shopra/config to simulate missing DATABASE_URL
    jest.doMock('@shopra/config', () => ({
      getConfig: () => ({ DATABASE_URL: '' }),
    }));

    // IMPORT: reload PrismaService with mocked config
    const { PrismaService: PrismaServiceWithBadConfig } = await import('../src/prisma.service');

    // TEST: expect PrismaService to throw error during initialization
    expect(() => new PrismaServiceWithBadConfig(mockLogger)).toThrow();
    expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining('DATABASE_URL'));
  });
});
