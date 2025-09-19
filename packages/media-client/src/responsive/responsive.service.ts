import { Injectable, Logger } from '@nestjs/common';

import { getMediaProviderClient } from '../imagekit.client';
import type { TransformOptions } from '../types/media.types';
import { mapTransformOptionsToQuery } from '../utils/transformations.util';

@Injectable()
export class ResponsiveService {
  private readonly logger = new Logger(ResponsiveService.name);

  getTransformedUrl(path: string, opts?: TransformOptions): string {
    try {
      const params = mapTransformOptionsToQuery(opts);
      const imageKit = getMediaProviderClient();
      return imageKit.url({ path, transformation: [params] });
    } catch (err) {
      this.logger.error(
        'Failed to generate transformed URL',
        err instanceof Error ? err : new Error(String(err)),
      );
      return '';
    }
  }

  generateSrcset(path: string, widths: number[], opts?: TransformOptions): string {
    try {
      const srcset = widths
        .map((w) => {
          const url = this.getTransformedUrl(path, { ...opts, width: w });
          return `${url} ${w}w`;
        })
        .join(', ');
      return srcset;
    } catch (err) {
      this.logger.error(
        'Failed to generate srcset',
        err instanceof Error ? err : new Error(String(err)),
      );
      return '';
    }
  }
}
