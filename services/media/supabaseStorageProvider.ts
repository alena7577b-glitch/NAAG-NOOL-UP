import { MediaStorageProvider, UploadFileOptions, UploadFileResult } from './types';
import { sanitizeFilename, validateUpload } from './validation';
import { getAdminSupabaseClient } from '../../lib/supabase/admin';
import { logger } from '../../lib/logger';

/**
 * NAAG NOOL UP — Supabase Media Storage Provider
 *
 * Implements MediaStorageProvider using Supabase Object Storage (S3-compatible).
 * Utilizes the server-side admin client for secure upload and deletion.
 */

export class SupabaseMediaStorageProvider implements MediaStorageProvider {
  providerName = 'SUPABASE_STORAGE';

  private publicBucket: string;
  private privateBucket: string;

  constructor(
    publicBucket = process.env.SUPABASE_STORAGE_PUBLIC_BUCKET || 'naag-nool-public-media',
    privateBucket = process.env.SUPABASE_STORAGE_PRIVATE_BUCKET || 'naag-nool-private-docs'
  ) {
    this.publicBucket = publicBucket;
    this.privateBucket = privateBucket;
  }

  async uploadFile(options: UploadFileOptions): Promise<UploadFileResult> {
    // 1. Validate file parameters
    const validation = validateUpload(options);
    if (!validation.valid) {
      throw new Error(`Upload validation failed: ${validation.error}`);
    }

    const supabase = getAdminSupabaseClient();
    if (!supabase) {
      throw new Error(
        'Supabase Storage is not configured. Define SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL.'
      );
    }

    const bucket = options.isPrivate ? this.privateBucket : this.publicBucket;
    const sanitized = sanitizeFilename(options.filename);
    const folder = options.folder ? options.folder.replace(/[^a-zA-Z0-9_-]/g, '') : 'general';
    const key = `${folder}/${Date.now()}-${sanitized}`;

    try {
      const { data, error } = await supabase.storage.from(bucket).upload(key, options.buffer, {
        contentType: options.mimeType,
        upsert: true,
      });

      if (error) {
        logger.error(`Supabase storage upload error for ${key}:`, error);
        throw new Error(`Failed to upload media to Supabase: ${error.message}`);
      }

      let fileUrl = '';
      if (options.isPrivate) {
        // For private files, return the path reference; client requests signed URLs
        fileUrl = `/api/media/private?key=${encodeURIComponent(data.path)}`;
      } else {
        const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
        fileUrl = publicUrlData.publicUrl;
      }

      return {
        fileUrl,
        key: data.path,
        sizeBytes: options.buffer.length,
      };
    } catch (err) {
      logger.error('Unexpected error in Supabase uploadFile:', err);
      throw err;
    }
  }

  async deleteFile(key: string, isPrivate = false): Promise<boolean> {
    const supabase = getAdminSupabaseClient();
    if (!supabase) return false;

    const bucket = isPrivate ? this.privateBucket : this.publicBucket;

    try {
      const { error } = await supabase.storage.from(bucket).remove([key]);
      if (error) {
        logger.error(`Failed to delete media asset ${key}:`, error);
        return false;
      }
      return true;
    } catch (err) {
      logger.error(`Unexpected error deleting media asset ${key}:`, err);
      return false;
    }
  }

  getPublicUrl(key: string): string {
    const supabase = getAdminSupabaseClient();
    if (!supabase) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      return `${supabaseUrl}/storage/v1/object/public/${this.publicBucket}/${key}`;
    }

    const { data } = supabase.storage.from(this.publicBucket).getPublicUrl(key);
    return data.publicUrl;
  }

  async getSignedUrl(key: string, expiresInSeconds = 3600): Promise<string> {
    const supabase = getAdminSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase admin client not configured for signed URL generation');
    }

    const { data, error } = await supabase.storage
      .from(this.privateBucket)
      .createSignedUrl(key, expiresInSeconds);

    if (error || !data) {
      throw new Error(`Failed to generate signed URL for ${key}: ${error?.message}`);
    }

    return data.signedUrl;
  }
}
