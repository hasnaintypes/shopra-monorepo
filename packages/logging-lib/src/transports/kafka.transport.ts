import { Kafka, type Producer } from 'kafkajs';
import type { LogEntry } from '../interfaces/log-entry.interface';

export class KafkaTransport {
  private producer: Producer;
  private topic: string;
  private isConnected = false;
  private retryAttempts: number;
  private retryDelayMs: number;

  constructor(
    private readonly kafkaConfig: {
      brokers: string[];
      topic: string;
      clientId?: string;
      retryAttempts?: number;
      retryDelayMs?: number;
    },
  ) {
    const kafka = new Kafka({
      // NOTE: Default clientId if none provided
      clientId: kafkaConfig.clientId || 'logging-lib',
      brokers: kafkaConfig.brokers,
    });

    this.producer = kafka.producer();
    this.topic = kafkaConfig.topic;
    this.retryAttempts = kafkaConfig.retryAttempts ?? 3;
    this.retryDelayMs = kafkaConfig.retryDelayMs ?? 1000;
  }

  async connect(): Promise<void> {
    if (!this.isConnected) {
      await this.producer.connect();
      this.isConnected = true;
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.producer.disconnect();
      this.isConnected = false;
    }
  }

  async send(logEntry: LogEntry): Promise<void> {
    let attempt = 0;
    while (attempt <= this.retryAttempts) {
      try {
        if (!this.isConnected) {
          await this.connect();
        }
        await this.producer.send({
          topic: this.topic,
          messages: [
            {
              key: logEntry.service,
              value: JSON.stringify(logEntry),
              timestamp: new Date(logEntry.timestamp).getTime().toString(),
            },
          ],
        });
        return;
      } catch (error) {
        attempt++;
        if (attempt > this.retryAttempts) {
          // BLOCKER: If Kafka is down, logs will be lost after retries
          // FIXME: Consider adding dead-letter or alerting system
          // eslint-disable-next-line no-undef
          console.error('Failed to send log to Kafka after retries:', error);
          return;
        }
        // NOTE: Backoff before retrying
        await new Promise((resolve) => globalThis.setTimeout(resolve, this.retryDelayMs));
      }
    }
  }
}
