import type { TransformOptions } from '../types/media.types';

export function mapTransformOptionsToQuery(
  opts: TransformOptions = {},
): Record<string, string | number> {
  const params: Record<string, string | number> = {};
  if (!opts) return params;

  if (opts.width) params.w = opts.width;
  if (opts.height) params.h = opts.height;
  if (opts.format) params.f = opts.format;
  if (opts.quality) params.q = opts.quality;
  if (opts.crop) params.c = opts.crop;
  if (opts.cropMode) params.cm = opts.cropMode;
  if (opts.blur) params.bl = opts.blur;
  if (opts.radius) params.r = opts.radius;
  if (opts.background) params.bg = opts.background;
  if (opts.border) params.b = opts.border;
  if (opts.rotation) params.rt = opts.rotation;
  if (opts.progressive) params.pr = opts.progressive ? 'true' : 'false';
  if (opts.named) params.n = opts.named;
  if (opts.raw) params.raw = opts.raw;
  return params;
}
