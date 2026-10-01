import { MediaStorageProvider, UploadFileOptions, UploadFileResult } from './types';
import { SupabaseMediaStorageProvider } from './supabaseStorageProvider';
import { isSupabaseAdminConfigured } from '../../lib/env';

export { type MediaStorageProvider, type UploadFileOptions, type UploadFileResult } from './types';
export { SupabaseMediaStorageProvider } from './supabaseStorageProvider';

/**
 * Local filesystem / fallback storage provider for development and testing
 */
export class LocalDevStorageProvider implements MediaStorageProvider {
  providerName = 'LOCAL_DEV_STORAGE';

  async uploadFile(options: UploadFileOptions): Promise<UploadFileResult> {
    const folder = options.folder ? options.folder + '/' : '';
    const key = `${folder}${Date.now()}-${options.filename}`;
    return {
      fileUrl: `/uploads/${key}`,
      key,
      sizeBytes: options.buffer.length,
    };
  }

  async deleteFile(_key: string): Promise<boolean> {
    return true;
  }

  getPublicUrl(key: string): string {
    return `/uploads/${key}`;
  }

  async getSignedUrl(key: string): Promise<string> {
    return `/uploads/${key}?signed=true`;
  }
}

/**
 * Factory function to obtain the appropriate storage provider based on environment
 */
export function getMediaStorageProvider(): MediaStorageProvider {
  if (isSupabaseAdminConfigured()) {
    return new SupabaseMediaStorageProvider();
  }
  return new LocalDevStorageProvider();
}

/**
 * Active media storage instance
 */
export const activeMediaStorage: MediaStorageProvider = getMediaStorageProvider();
