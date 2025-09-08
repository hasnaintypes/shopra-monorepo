import { LoggerService } from '@shopra/logging';
import { Admin, Kafka } from 'kafkajs';
import process from 'process';
import { setTimeout as sleep } from 'timers/promises';
import { getKafkaConfig } from '../config/kafka.config';
import { KafkaClientConfig } from '../types/kafka.types';

export class KafkaAdmin {
  private readonly kafka: Kafka;
  private readonly admin: Admin;
  private readonly logger: LoggerService;

  constructor(config?: KafkaClientConfig) {
    const finalConfig = config ?? getKafkaConfig();
    this.kafka = new Kafka({
      clientId: finalConfig.clientId,
      brokers: finalConfig.brokers,
    });
    this.admin = this.kafka.admin();
    this.logger = new LoggerService().setContext('KafkaAdmin');
  }

  async connect(retries = 3): Promise<void> {
    let attempt = 0;
    while (attempt < retries) {
      try {
        await this.admin.connect();
        this.logger.info('[KafkaAdmin] Connected');
        return;
      } catch (error) {
        attempt++;
        this.logger.error(
          '[KafkaAdmin] Failed to connect',
          error instanceof Error ? error : String(error),
          { attempt },
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
      await this.admin.disconnect();
      this.logger.info('[KafkaAdmin] Disconnected');
    } catch (error) {
      this.logger.error(
        '[KafkaAdmin] Failed to disconnect',
        error instanceof Error ? error : String(error),
      );
      throw error;
    }
  }

  async createTopic(topic: string, numPartitions = 3, replicationFactor = 1): Promise<void> {
    try {
      await this.admin.createTopics({
        topics: [{ topic, numPartitions, replicationFactor }],
        waitForLeaders: true,
      });
      this.logger.info('[KafkaAdmin] Topic created', { topic, numPartitions, replicationFactor });
    } catch (error) {
      this.logger.error(
        '[KafkaAdmin] Failed to create topic',
        error instanceof Error ? error : String(error),
        { topic },
      );
      throw error;
    }
  }

  async listTopics(): Promise<string[]> {
    try {
      const topics = await this.admin.listTopics();
      this.logger.info('Topics listed', { topics });
      return topics;
    } catch (error) {
      this.logger.error(
        '[KafkaAdmin] Failed to list topics',
        error instanceof Error ? error : String(error),
      );
      throw error;
    }
  }
  // Placeholder for graceful shutdown
  public setupGracefulShutdown() {
    process.on('SIGTERM', async () => {
      this.logger.info('SIGTERM received, disconnecting admin...');
      await this.disconnect();
      process.exit(0);
    });
  }
}
