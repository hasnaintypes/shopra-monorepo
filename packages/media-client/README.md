# @shopra/media

NestJS module for ImageKit integration, media upload, transformation utilities, and responsive image helpers for the Shopra monorepo.

---

**Related Packages:**

- [`@shopra/logging`](../logging-lib) – Centralized, production-grade logging for all services
- [`@shopra/kafka`](../kafka-client) – Unified, type-safe Kafka client for producers/consumers
- [`@shopra/config`](../config) – Centralized environment/config management

---

## Features

- **Image & Video Uploads**: Unified upload API for images and videos (with optional video thumbnail support).
- **Media Deletion**: Delete files from ImageKit.
- **URL Generation**: Generate transformed and signed URLs for media.
- **Responsive Utilities**: Generate responsive image URLs and `srcset` for various device sizes.
- **Kafka Integration**: Emits media events (uploaded, deleted) to Kafka (optional, via [`@shopra/kafka`](../kafka-client)).
- **TypeScript-first**: Strongly typed interfaces for all operations.
- **Configurable**: Uses environment variables for provider credentials and upload folder (via [`@shopra/config`](../config)).

## Installation

```sh
pnpm add @shopra/media
```

## Usage

```ts
import { MediaModule, MediaService } from '@shopra/media';

@Module({
  imports: [MediaModule],
})
export class AppModule {
  constructor(private readonly mediaService: MediaService) {}

  async uploadFile(file: Buffer) {
    return this.mediaService.upload(file, { fileName: 'example.jpg' });
  }
}
```

> **Note:**
>
> - Logging is handled via [`@shopra/logging`](../logging-lib).
> - Kafka integration is handled via [`@shopra/kafka`](../kafka-client) and is optional.
> - Configuration is loaded via [`@shopra/config`](../config).

## API

### MediaService

- `upload(file, options)`: Uploads an image or video file.
- `uploadVideo(file, options)`: Uploads a video file (with optional thumbnail).
- `delete(fileId)`: Deletes a file by ID.
- `deleteVideo(fileId)`: Deletes a video file by ID.
- `getUrl(filePath, options?)`: Returns a transformed URL for a file.
- `getSignedUrl(filePath, expiresInSeconds)`: Returns a signed URL for a file.
- `getVideoUrl(filePath, options?)`: Returns a transformed URL for a video.

### ResponsiveService

- `getTransformedUrl(path, options?)`: Returns a transformed image URL.
- `generateSrcset(path, widths, options?)`: Returns a responsive `srcset` string.

### Types

- `UploadOptions`, `UploadResult`, `TransformOptions`, etc. (see `src/types/media.types.ts`)

## Environment Variables

- `IMAGEKIT_PUBLIC_KEY`
- `IMAGEKIT_PRIVATE_KEY`
- `IMAGEKIT_URL_ENDPOINT`
- `IMAGEKIT_UPLOAD_FOLDER` (default: `/shopra-dev`)

## Testing

```sh
pnpm test --filter @shopra/media
```

## Developer Notes

- All uploads are placed under the `/shopra-dev` folder in ImageKit for development. To use a service-specific folder, set `IMAGEKIT_UPLOAD_FOLDER` to `/shopra-dev/<service>`.
- Kafka integration is optional. If a Kafka producer is provided (from [`@shopra/kafka`](../kafka-client)), media events will be emitted.
- Logging is handled via [`@shopra/logging`](../logging-lib).
- Video thumbnail generation is not implemented by default (see `generateVideoThumbnail` in `video.util.ts`).
- The package is ESM-first and requires Node.js 18+ and `ts-node@11+` for direct TypeScript execution.

---

See the source for full API and type details.
