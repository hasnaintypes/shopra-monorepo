import { getConfig } from '@shopra/config';

export interface MediaConfig {
  publicKey: string;
  privateKey: string;
  urlEndpoint: string;
  uploadFolder: string;
}

export function getMediaConfig(): MediaConfig {
  const config = getConfig();
  return {
    publicKey: config.IMAGEKIT_PUBLIC_KEY,
    privateKey: config.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: config.IMAGEKIT_URL_ENDPOINT,
    uploadFolder: config.IMAGEKIT_UPLOAD_FOLDER || '/shopra-dev',
  };
}
