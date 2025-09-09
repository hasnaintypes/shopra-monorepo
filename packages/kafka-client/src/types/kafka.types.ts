import { ConsumerConfig, KafkaConfig, ProducerRecord } from 'kafkajs';

export type KafkaClientConfig = KafkaConfig & {
  clientId: string;
  brokers: string[];
};

export type KafkaProducerMessage = ProducerRecord;

export type KafkaConsumerOptions = ConsumerConfig & {
  topic: string;
  groupId: string;
  fromBeginning?: boolean;
};

export interface IKafkaProducer {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  send(message: KafkaProducerMessage): Promise<void>;
}

export interface IKafkaConsumer {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  subscribe(options: KafkaConsumerOptions): Promise<void>;
  run(
    handler: (message: { key: string | null; value: string | null }) => Promise<void>,
  ): Promise<void>;
}
