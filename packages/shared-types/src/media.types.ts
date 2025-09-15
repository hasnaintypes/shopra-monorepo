// Media types shared across Shopra packages

export interface UploadOptions {
  fileName: string;
  folder?: string;
  useUniqueFileName?: boolean;
  extraOptions?: Record<string, unknown>;
}

export interface UploadResult {
  fileId: string;
  filePath: string;
  url: string;
}

export interface TransformOptions {
  width?: number;
  height?: number;
  format?: string;
  quality?: number;
  crop?: string;
  cropMode?: string;
  blur?: number;
  radius?: number;
  background?: string;
  border?: string;
  rotation?: number;
  progressive?: boolean;
  named?: string;
  raw?: string;
  extraOptions?: Record<string, unknown>;
}

export interface MediaFile {
  fileId: string;
  name: string;
  url: string;
  filePath: string;
  type: string;
  thumbnailUrl?: string;
  [key: string]: unknown;
}
