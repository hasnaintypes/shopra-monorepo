import { format, transports } from 'winston';

export class ConsoleTransport {
  static create(): transports.ConsoleTransportInstance {
    // NOTE: Simple colorized console output (useful for local/dev)
    return new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    });
  }
}
