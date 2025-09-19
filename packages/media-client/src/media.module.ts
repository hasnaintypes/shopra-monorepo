import { Global, Module } from '@nestjs/common';
import { KafkaProducer } from '@shopra/kafka';
import { MediaService } from './media.service';

@Global()
@Module({
  providers: [MediaService, KafkaProducer],
  exports: [MediaService, KafkaProducer],
})
export class MediaModule {}
