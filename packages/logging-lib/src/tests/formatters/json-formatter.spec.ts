import { createLogger } from 'winston';
import Transport from 'winston-transport';
import { jsonFormatter } from '../../formatters/json-formatter';

describe('JsonFormatter', () => {
  it('should format log entry as JSON', () => {
    const logger = createLogger({
      format: jsonFormatter,
      transports: [],
    });

    const mockWrite = jest.fn();
    class MockTransport extends Transport {
      log(info, callback) {
        mockWrite(info);
        callback();
      }
    }
    logger.add(new MockTransport());

    logger.info('Test message', { meta: { userId: '123' }, service: 'test-service' });

    expect(mockWrite).toHaveBeenCalled();
    const loggedData = mockWrite.mock.calls[0][0];

    expect(loggedData.level).toBe('info');
    expect(loggedData.message).toBe('Test message');
    expect(loggedData.service).toBe('test-service');
    expect(loggedData.meta).toEqual({ userId: '123' });
    expect(loggedData.timestamp).toBeDefined();
  });

  it('should include stack trace for errors', () => {
    const logger = createLogger({
      format: jsonFormatter,
      transports: [],
    });

    const mockWrite = jest.fn();
    class MockTransport extends Transport {
      log(info, callback) {
        mockWrite(info);
        callback();
      }
    }
    logger.add(new MockTransport());

    const error = new Error('Test error');
    logger.error('Error occurred', { stack: error.stack, service: 'test-service' });

    expect(mockWrite).toHaveBeenCalled();
    const loggedData = mockWrite.mock.calls[0][0];

    expect(loggedData.level).toBe('error');
    expect(loggedData.message).toBe('Error occurred');
    expect(loggedData.stack).toBeDefined();
  });
});
