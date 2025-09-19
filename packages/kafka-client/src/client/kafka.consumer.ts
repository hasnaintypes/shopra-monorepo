import { LoggerService } from '@shopra/logging';
import { Consumer, Kafka } from 'kafkajs';
import process from 'process';
import { setTimeout as sleep } from 'timers/promises';
import { getKafkaConfig } from '../config/kafka.config';
import { IKafkaConsumer, KafkaClientConfig, KafkaConsumerOptions } from '../types/kafka.types';

export class KafkaConsumer implements IKafkaConsumer {
  private readonly kafka: Kafka;
  private readonly consumer: Consumer;
  private readonly logger: LoggerService;

  constructor(
    private readonly options: KafkaConsumerOptions,
    config?: KafkaClientConfig,
  ) {
    const finalConfig = config ?? getKafkaConfig();
    this.kafka = new Kafka({
      clientId: finalConfig.clientId,
      brokers: finalConfig.brokers,
    });
    this.consumer = this.kafka.consumer({ groupId: options.groupId });
    this.logger = new LoggerService().setContext('KafkaConsumer');
  }

  async connect(retries = 3): Promise<void> {
    let attempt = 0;
    while (attempt < retries) {
      try {
        await this.consumer.connect();
        this.logger.info('[KafkaConsumer] Connected', { groupId: this.options.groupId });
        return;
      } catch (error) {
        attempt++;
        this.logger.error(
          '[KafkaConsumer] Failed to connect',
          error instanceof Error ? error : String(error),
          { attempt, groupId: this.options.groupId },
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
      await this.consumer.disconnect();
      this.logger.info('[KafkaConsumer] Disconnected');
    } catch (error) {
      this.logger.error(
        '[KafkaConsumer] Failed to disconnect',
        error instanceof Error ? error : String(error),
      );
      throw error;
    }
  }

  async subscribe(options: KafkaConsumerOptions): Promise<void> {
    try {
      await this.consumer.subscribe({
        topic: options.topic,
        fromBeginning: options.fromBeginning ?? false,
      });
      this.logger.info('[KafkaConsumer] Subscribed to topic', { topic: options.topic });
    } catch (error) {
      this.logger.error(
        '[KafkaConsumer] Failed to subscribe',
        error instanceof Error ? error : String(error),
        { topic: options.topic },
      );
      throw error;
    }
  }

  async run(
    handler: (message: { key: string | null; value: string | null }) => Promise<void>,
  ): Promise<void> {
    try {
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          try {
            const key = message.key?.toString() || null;
            const value = message.value?.toString() || null;
            await handler({ key, value });
            this.logger.info('[KafkaConsumer] Message consumed', { topic, partition, key });
          } catch (handlerError) {
            this.logger.error(
              '[KafkaConsumer] Handler error',
              handlerError instanceof Error ? handlerError : String(handlerError),
            );
          }
        },
      });
    } catch (error) {
      this.logger.error(
        '[KafkaConsumer] Failed to run consumer',
        error instanceof Error ? error : String(error),
      );
      throw error;
    }
  }
  // Placeholder for graceful shutdown
  public setupGracefulShutdown() {
    process.on('SIGTERM', async () => {
      this.logger.info('SIGTERM received, disconnecting consumer...');
      await this.disconnect();
      process.exit(0);
    });
  }
}
