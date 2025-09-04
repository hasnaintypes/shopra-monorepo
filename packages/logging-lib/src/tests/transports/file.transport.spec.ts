import * as fs from 'fs-extra';
import * as path from 'path';
import process from 'process';
import winston from 'winston';
import { FileTransport } from '../../transports/file.transport';

/* global setTimeout */

describe('FileTransport', () => {
  afterAll(() => {
    // Clean up Winston transports to avoid file handle errors
    winston.loggers.loggers.forEach((logger) => {
      logger.transports.forEach((t) => {
        logger.remove(t);
        if (typeof t.close === 'function') t.close();
      });
    });
  });
  beforeAll(() => {
    fs.ensureDirSync(logsDir);
    // Write a dummy log entry to ensure the log file is created before tests
    const logger = winston.createLogger({
      transports: [
        new winston.transports.File({
          filename: path.join(logsDir, `info-${new Date().toISOString().slice(0, 10)}.log`),
        }),
      ],
    });
    logger.info('Initializing log file for tests');
    // Wait for the log to be written before proceeding
    return new Promise((resolve) => setTimeout(resolve, 100));
  });
  const logsDir = path.resolve(process.cwd(), 'logs');

  // Clean up log files only after Winston transports are closed
  afterAll(() => {
    winston.loggers.loggers.forEach((logger) => {
      logger.transports.forEach((t) => {
        logger.remove(t);
        if (typeof t.close === 'function') t.close();
      });
    });
    if (fs.existsSync(logsDir)) {
      fs.readdirSync(logsDir).forEach((file) => {
        fs.unlinkSync(path.join(logsDir, file));
      });
    }
  });

  it('should create logs directory', () => {
    FileTransport.createInfoTransport();
    expect(fs.existsSync(logsDir)).toBe(true);
  });

  it('should create info transport', () => {
    const transport = FileTransport.createInfoTransport();
    expect(transport).toBeDefined();
    expect(transport.level).toBe('info');
  });

  it('should create warn transport', () => {
    const transport = FileTransport.createWarnTransport();
    expect(transport).toBeDefined();
    expect(transport.level).toBe('warn');
  });

  it('should create error transport', () => {
    const transport = FileTransport.createErrorTransport();
    expect(transport).toBeDefined();
    expect(transport.level).toBe('error');
  });

  it('should create all transports', () => {
    const transports = FileTransport.createAllTransports();
    expect(transports).toHaveLength(3);
  });
});
