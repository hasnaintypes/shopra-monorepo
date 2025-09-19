import { Inject, Injectable, Optional } from '@nestjs/common';
import type { Buffer } from 'node:buffer';
import type { Readable } from 'node:stream';

import { KafkaProducer } from '@shopra/kafka';
import { LoggerService } from '@shopra/logging';

import { getMediaProviderClient } from './imagekit.client';
import { getMediaConfig } from './media.config';
import type { MediaFile, TransformOptions, UploadOptions, UploadResult } from './types/media.types';
import { mapTransformOptionsToQuery } from './utils/transformations.util';
import {
  deleteVideo as deleteVideoUtil,
  getVideoUrl as getVideoUrlUtil,
  uploadVideo as uploadVideoUtil,
} from './utils/video.util';

export const MEDIA_KAFKA_TOPIC = 'media.events';
export type MediaEventType =
  | 'media.uploaded'
  | 'media.deleted'
  | 'video.uploaded'
  | 'video.deleted';

export interface MediaEvent {
  type: MediaEventType;
  payload: Record<string, unknown>;
  timestamp: string;
}

@Injectable()
export class MediaService {
  private readonly logger = new LoggerService();
  private readonly mediaProvider = getMediaProviderClient();
  private readonly uploadFolder: string;
  private readonly kafkaProducer?: KafkaProducer;

  constructor(@Optional() @Inject(KafkaProducer) kafkaProducer?: KafkaProducer) {
    this.uploadFolder = getMediaConfig().uploadFolder;
    this.kafkaProducer = kafkaProducer;
  }

  /**
   * List files from ImageKit. Query params are passed directly to the SDK.
   * @param query ImageKit listFiles options (see https://docs.imagekit.io/api-reference/media-api/list-and-search-files)
   */
  async listFiles(query: Record<string, unknown> = {}): Promise<MediaFile[]> {
    try {
      const files: MediaFile[] = await this.mediaProvider.listFiles(query);
      this.logger.info('Listed files', { count: files.length });
      return files;
    } catch (err) {
      this.logger.error('List files failed', err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  }

  async upload(file: Buffer | Readable | string, options: UploadOptions): Promise<UploadResult> {
    try {
      const folder = options.folder || this.uploadFolder;
      const { fileName, extraOptions, useUniqueFileName, ...rest } = options;
      const result = await this.mediaProvider.upload({
        file,
        fileName,
        folder,
        useUniqueFileName: useUniqueFileName ?? true,
        ...(extraOptions || {}),
        ...rest,
      });
      this.logger.info('Upload successful', { fileId: result.fileId, filePath: result.filePath });
      if (this.kafkaProducer) {
        const event: MediaEvent = {
          type: 'media.uploaded',
          payload: {
            fileId: result.fileId,
            filePath: result.filePath,
            url: result.url,
            folder,
            fileName,
          },
          timestamp: new Date().toISOString(),
        };
        await this.kafkaProducer.send({
          topic: MEDIA_KAFKA_TOPIC,
          messages: [{ key: 'media.uploaded', value: JSON.stringify(event) }],
        });
      }
      return {
        fileId: result.fileId,
        filePath: result.filePath,
        url: result.url,
      };
    } catch (err) {
      this.logger.error('Upload failed', err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  }

  getUrl(filePath: string, options?: TransformOptions): string {
    const transformation = options ? [mapTransformOptionsToQuery(options)] : [];
    return this.mediaProvider.url({ path: filePath, transformation });
  }

  getSignedUrl(filePath: string, expiresInSeconds: number): string {
    // Implements signed URL logic using ImageKit SDK
    // https://docs.imagekit.io/api-reference/url-generation/generate-signed-urls
    try {
      const url = this.mediaProvider.url({
        path: filePath,
        signed: true,
        expireSeconds: expiresInSeconds,
      });
      return url;
    } catch (err) {
      this.logger.error(
        'Signed URL generation failed',
        err instanceof Error ? err : new Error(String(err)),
      );
      return '';
    }
  }

  async delete(fileId: string): Promise<void> {
    try {
      await this.mediaProvider.deleteFile(fileId);
      this.logger.info('Delete successful', { fileId });
      if (this.kafkaProducer) {
        const event: MediaEvent = {
          type: 'media.deleted',
          payload: { fileId },
          timestamp: new Date().toISOString(),
        };
        await this.kafkaProducer.send({
          topic: MEDIA_KAFKA_TOPIC,
          messages: [{ key: 'media.deleted', value: JSON.stringify(event) }],
        });
      }
    } catch (err) {
      this.logger.error(
        `Delete failed for fileId: ${fileId}`,
        err instanceof Error ? err : new Error(String(err)),
      );
      throw err;
    }
  }

  async uploadVideo(
    file: Buffer | Readable | string,
    options: UploadOptions & { generateThumbnail?: boolean; thumbnailTime?: number },
  ): Promise<UploadResult & { thumbnailUrl?: string }> {
    const result = await uploadVideoUtil(file, options);

    if (this.kafkaProducer) {
      const event: MediaEvent = {
        type: 'video.uploaded',
        payload: {
          fileId: result.fileId,
          filePath: result.filePath,
          url: result.url,
          thumbnailUrl: result.thumbnailUrl,
          folder: options.folder,
          fileName: options.fileName,
        },
        timestamp: new Date().toISOString(),
      };
      await this.kafkaProducer.send({
        topic: MEDIA_KAFKA_TOPIC,
        messages: [{ key: 'video.uploaded', value: JSON.stringify(event) }],
      });
    }
    return result;
  }

  getVideoUrl(filePath: string, options?: TransformOptions): string {
    return getVideoUrlUtil(filePath, options);
  }

  async deleteVideo(fileId: string): Promise<void> {
    await deleteVideoUtil(fileId);

    if (this.kafkaProducer) {
      const event: MediaEvent = {
        type: 'video.deleted',
        payload: { fileId },
        timestamp: new Date().toISOString(),
      };
      await this.kafkaProducer.send({
        topic: MEDIA_KAFKA_TOPIC,
        messages: [{ key: 'video.deleted', value: JSON.stringify(event) }],
      });
    }
  }
}
