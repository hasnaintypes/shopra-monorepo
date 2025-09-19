import { LoggerService } from '@shopra/logging';
import { Kafka, Producer } from 'kafkajs';
import process from 'process';
import { setTimeout as sleep } from 'timers/promises';
import { getKafkaConfig } from '../config/kafka.config';
import { IKafkaProducer, KafkaClientConfig } from '../types/kafka.types';

export class KafkaProducer implements IKafkaProducer {
  private readonly kafka: Kafka;
  private readonly producer: Producer;
  private readonly logger: LoggerService;

  constructor(config?: KafkaClientConfig) {
    const finalConfig = config ?? getKafkaConfig();
    this.kafka = new Kafka({
      clientId: finalConfig.clientId,
      brokers: finalConfig.brokers,
    });
    this.producer = this.kafka.producer();
    this.logger = new LoggerService().setContext('KafkaProducer');
  }

  async connect(retries = 3): Promise<void> {
    let attempt = 0;
    while (attempt < retries) {
      try {
        await this.producer.connect();
        this.logger.info('[KafkaProducer] Connected to Kafka broker(s)');
        return;
      } catch (error) {
        attempt++;
        this.logger.error(
          '[KafkaProducer] Failed to connect to Kafka',
          error instanceof Error ? error : String(error),
          {
            attempt,
          },
        );
        if (attempt >= retries) {
          throw error;
        }
        await sleep(1000 * attempt);
      }
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.producer.disconnect();
      this.logger.info('[KafkaProducer] Disconnected from Kafka broker(s)');
    } catch (error) {
      this.logger.error(
        '[KafkaProducer] Failed to disconnect from Kafka',
        error instanceof Error ? error : String(error),
      );
      throw error;
    }
  }

  async send(message: import('kafkajs').ProducerRecord): Promise<void> {
    try {
      await this.producer.send(message);
      this.logger.info('[KafkaProducer] Message sent', {
        topic: message.topic,
        messages: message.messages?.length,
      });
    } catch (error) {
      this.logger.error(
        '[KafkaProducer] Failed to send message',
        error instanceof Error ? error : String(error),
        {
          topic: message.topic,
        },
      );
      throw error;
    }
  }
  // Placeholder for graceful shutdown
  public setupGracefulShutdown() {
    process.on('SIGTERM', async () => {
      this.logger.info('[KafkaProducer] SIGTERM received, disconnecting producer...');
      await this.disconnect();
      process.exit(0);
    });
  }
}
