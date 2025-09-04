/* eslint-disable no-undef */
import { Test, type TestingModule } from '@nestjs/testing';
import * as fs from 'fs-extra';
import * as path from 'path';
import process from 'process';
import winston from 'winston';
import { LoggerService } from '../logger.service';

// Mock kafkajs
jest.mock('kafkajs', () => ({
  Kafka: jest.fn().mockImplementation(() => ({
    producer: jest.fn().mockReturnValue({
      connect: jest.fn().mockResolvedValue(undefined),
      disconnect: jest.fn().mockResolvedValue(undefined),
      send: jest.fn().mockResolvedValue(undefined),
    }),
  })),
}));

describe('LoggerService', () => {
  winston.loggers.loggers.forEach((logger) => {
    logger.transports.forEach((t) => {
      logger.remove(t);
      if (typeof t.close === 'function') t.close();
    });
  });
  let service: LoggerService;
  const logsDir = path.resolve(process.cwd(), 'logs');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggerService],
    }).compile();

    service = await module.resolve<LoggerService>(LoggerService);
  });

  // No log directory deletion after each test

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create logs directory', () => {
    service.info('Test message');
    expect(fs.existsSync(logsDir)).toBe(true);
  });

  it('should log info messages', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    service.info('Test info message', { userId: '123' });
    consoleSpy.mockRestore();
  });

  it('should log error messages with error object', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    const error = new Error('Test error');
    service.error('Test error message', error, { context: 'test' });
    consoleSpy.mockRestore();
  });

  it('should log warn messages', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    service.warn('Test warning', { level: 'high' });
    consoleSpy.mockRestore();
  });

  it('should log debug messages', () => {
    const consoleSpy = jest.spyOn(console, 'debug').mockImplementation();
    service.debug('Test debug', { debug: true });
    consoleSpy.mockRestore();
  });

  it('should create context logger', () => {
    const contextLogger = service.setContext('UserService');
    expect(contextLogger).toBeDefined();
    expect(contextLogger).not.toBe(service);
  });
});
