import { Buffer } from 'node:buffer';
import { Readable } from 'node:stream';

import { getMediaProviderClient } from '../imagekit.client';
import type { TransformOptions, UploadResult } from '../types/media.types';
import { mapTransformOptionsToQuery } from './transformations.util';

export interface VideoUploadOptions {
  fileName: string;
  folder?: string;
  generateThumbnail?: boolean;
  thumbnailTime?: number;
  extraOptions?: Record<string, unknown>;
}

export interface VideoUploadResult extends UploadResult {
  thumbnailUrl?: string;
}

export async function uploadVideo(
  file: Buffer | Readable | string,
  options: VideoUploadOptions,
): Promise<VideoUploadResult> {
  const imageKit = getMediaProviderClient();
  const uploadParams: Record<string, unknown> = {
    file,
    fileName: options.fileName,
    folder: options.folder,
    useUniqueFileName: true,
  };
  if (options.extraOptions) {
    Object.assign(uploadParams, options.extraOptions);
  }
  const result = await imageKit.upload(uploadParams);
  let thumbnailUrl: string | undefined;
  if (options.generateThumbnail) {
    try {
      const thumb = await generateVideoThumbnail(file, options.thumbnailTime);
      if (typeof thumb === 'string') {
        thumbnailUrl = thumb;
      } else {
        thumbnailUrl = undefined;
      }
    } catch {
      thumbnailUrl = undefined;
    }
  }
  return { ...result, thumbnailUrl };
}

export function getVideoUrl(filePath: string, options?: TransformOptions): string {
  const imageKit = getMediaProviderClient();
  const transformation = options ? [mapTransformOptionsToQuery(options)] : [];
  return imageKit.url({ path: filePath, transformation });
}

export async function deleteVideo(fileId: string): Promise<void> {
  const imageKit = getMediaProviderClient();
  await imageKit.deleteFile(fileId);
}

// Intended signature for future implementation:
// async function generateVideoThumbnail(file: Buffer | Readable | string, time: number = 1): Promise<Buffer | string>
export async function generateVideoThumbnail(): Promise<Buffer | string> {
  // TODO: Implement thumbnail generation (ffmpeg or provider API)
  throw new Error('Not implemented: generateVideoThumbnail');
}
