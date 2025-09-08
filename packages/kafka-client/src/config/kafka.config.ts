/* eslint-disable no-undef */
import { KafkaClientConfig } from '../types/kafka.types';

export function getKafkaConfig(): KafkaClientConfig {
  const brokersEnv = process.env.KAFKA_BROKERS;
  const clientId = process.env.KAFKA_CLIENT_ID;

  if (!brokersEnv || !brokersEnv.trim()) {
    throw new Error(
      'KAFKA_BROKERS environment variable is required (comma-separated list of brokers)',
    );
  }
  if (!clientId || !clientId.trim()) {
    throw new Error('KAFKA_CLIENT_ID environment variable is required');
  }

  const brokers = brokersEnv
    .split(',')
    .map((b) => b.trim())
    .filter(Boolean);
  if (brokers.length === 0) {
    throw new Error('KAFKA_BROKERS must contain at least one broker');
  }

  return {
    clientId,
    brokers,
  };
}
