import { setTimeout as sleep } from 'timers/promises';
import { v4 as uuidv4 } from 'uuid';
import { KafkaAdmin } from '../client/kafka.admin';
import { KafkaConsumer } from '../client/kafka.consumer';
import { KafkaProducer } from '../client/kafka.producer';

const TEST_TOPIC = `shopra.test.${uuidv4()}`;
const TEST_GROUP_ID = `shopra.test.group.${uuidv4()}`;
const TEST_CLIENT_ID = `shopra.test.client.${uuidv4()}`;

describe('Kafka Consumer Integration', () => {
  let producer: KafkaProducer;
  let consumer: KafkaConsumer;
  let admin: KafkaAdmin;
  let receivedMessages: string[] = [];
  let ready: Promise<void>;
  let readyResolve: () => void;

  beforeAll(async () => {
    admin = new KafkaAdmin({ clientId: TEST_CLIENT_ID, brokers: ['localhost:9092'] });
    await admin.connect();
    await admin.createTopic(TEST_TOPIC);

    producer = new KafkaProducer({ clientId: TEST_CLIENT_ID, brokers: ['localhost:9092'] });
    await producer.connect();

    consumer = new KafkaConsumer(
      {
        groupId: TEST_GROUP_ID,
        topic: TEST_TOPIC,
        fromBeginning: false, // Only consume new messages
      },
      { clientId: TEST_CLIENT_ID, brokers: ['localhost:9092'] },
    );
    await consumer.connect();
    await consumer.subscribe({ topic: TEST_TOPIC, groupId: TEST_GROUP_ID, fromBeginning: false });

    ready = new Promise((resolve) => {
      readyResolve = resolve;
    });

    await consumer.run(async ({ value }) => {
      if (value) {
        receivedMessages.push(value);
        readyResolve();
      }
    });
  });

  afterAll(async () => {
    if (producer) await producer.disconnect().catch(() => {});
    if (consumer) await consumer.disconnect().catch(() => {});
    if (admin) await admin.disconnect().catch(() => {});
  });

  it('should consume a produced message', async () => {
    const testValue = `consumer-test-${Date.now()}`;
    await producer.send({
      topic: TEST_TOPIC,
      messages: [{ value: testValue }],
    });

    // Wait for the message to be consumed (with timeout)
    await Promise.race([
      ready,
      sleep(5000).then(() => {
        throw new Error('Timeout waiting for message');
      }),
    ]);

    expect(receivedMessages).toContain(testValue);
  });
});
