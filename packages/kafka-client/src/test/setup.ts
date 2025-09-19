import { afterAll, beforeAll } from '@jest/globals';
import { KafkaAdmin } from '../client/kafka.admin';

const admin = new KafkaAdmin();

beforeAll(async () => {
  await admin.connect();

  await admin.createTopic('shopra.test', 1, 1);
});

afterAll(async () => {
  await admin.disconnect();
});
