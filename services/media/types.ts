/**
 * NAAG NOOL UP — Media Storage Architecture Abstraction
 */

export interface UploadFileOptions {
  filename: string;
  buffer: Buffer;
  mimeType: string;
  folder?: string;
  isPrivate?: boolean;
}

export interface UploadFileResult {
  fileUrl: string;
  key: string;
  sizeBytes: number;
}

export interface MediaStorageProvider {
  providerName: string;
  uploadFile(options: UploadFileOptions): Promise<UploadFileResult>;
  deleteFile(key: string, isPrivate?: boolean): Promise<boolean>;
  getPublicUrl(key: string): string;
  getSignedUrl?(key: string, expiresInSeconds?: number): Promise<string>;
}
