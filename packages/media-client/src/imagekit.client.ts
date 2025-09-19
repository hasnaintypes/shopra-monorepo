/* eslint-disable @typescript-eslint/no-explicit-any */
import ImageKit from 'imagekit';
import { getMediaConfig } from './media.config';

let imageProviderInstance: any = null;

export function getMediaProviderClient(): any {
  if (!imageProviderInstance) {
    const cfg = getMediaConfig();
    imageProviderInstance = new ImageKit({
      publicKey: cfg.publicKey,
      privateKey: cfg.privateKey,
      urlEndpoint: cfg.urlEndpoint,
    });
  }
  return imageProviderInstance;
}

export const createOrGetImageKitClient = getMediaProviderClient;
