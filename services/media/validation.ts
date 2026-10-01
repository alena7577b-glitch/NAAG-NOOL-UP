/**
 * NAAG NOOL UP — Media Upload Security & Validation
 */

export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/svg+xml',
] as const;

export const ALLOWED_DOC_MIME_TYPES = [
  'application/pdf',
] as const;

export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
export const MAX_DOC_SIZE_BYTES = 25 * 1024 * 1024; // 25MB

export const ALLOWED_FOLDERS = [
  'products',
  'banners',
  'blog',
  'cms',
  'logos',
  'documents',
  'temp',
] as const;

export type AllowedFolder = typeof ALLOWED_FOLDERS[number];

/**
 * Sanitize a filename to prevent path traversal, hidden files, or dangerous characters.
 */
export function sanitizeFilename(filename: string): string {
  // Strip paths
  const base = filename.replace(/^.*[\\/]/, '');
  // Replace disallowed characters with underscore
  const clean = base.replace(/[^a-zA-Z0-9._-]/g, '_').toLowerCase();
  // Strip leading dots
  const noDots = clean.replace(/^\.+/, '');
  // Check if anything meaningful remains besides underscores
  const meaningful = noDots.replace(/[._-]/g, '');
  if (!meaningful) {
    return `file_${Date.now()}`;
  }
  return noDots;
}

/**
 * Validate upload parameters against allowed MIME types and size constraints.
 */
export function validateUpload(options: {
  filename: string;
  buffer: Buffer;
  mimeType: string;
  folder?: string;
  isPrivate?: boolean;
}): { valid: boolean; error?: string } {
  if (!options.buffer || options.buffer.length === 0) {
    return { valid: false, error: 'File buffer cannot be empty' };
  }

  const isDoc = options.isPrivate || options.mimeType === 'application/pdf';
  const maxSize = isDoc ? MAX_DOC_SIZE_BYTES : MAX_IMAGE_SIZE_BYTES;

  if (options.buffer.length > maxSize) {
    return {
      valid: false,
      error: `File size (${(options.buffer.length / (1024 * 1024)).toFixed(2)}MB) exceeds maximum limit of ${(maxSize / (1024 * 1024)).toFixed(0)}MB`,
    };
  }

  const allowedTypes: string[] = isDoc
    ? [...ALLOWED_DOC_MIME_TYPES, ...ALLOWED_IMAGE_MIME_TYPES]
    : [...ALLOWED_IMAGE_MIME_TYPES];

  if (!allowedTypes.includes(options.mimeType)) {
    return {
      valid: false,
      error: `Unsupported file type: ${options.mimeType}. Allowed types: ${allowedTypes.join(', ')}`,
    };
  }

  if (options.folder && options.folder.includes('..')) {
    return { valid: false, error: 'Invalid folder path (path traversal detected)' };
  }

  return { valid: true };
}
