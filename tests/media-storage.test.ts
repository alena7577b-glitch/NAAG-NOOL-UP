/**
 * NAAG NOOL UP — Media Storage & Upload Security Tests
 */

import {
  sanitizeFilename,
  validateUpload,
  MAX_IMAGE_SIZE_BYTES,
} from '../services/media/validation';
import { LocalDevStorageProvider } from '../services/media/mediaStorage';
import { SupabaseMediaStorageProvider } from '../services/media/supabaseStorageProvider';

describe('Media Storage & Upload Security Suite', () => {
  describe('Filename Sanitization', () => {
    test('strips directory traversal attempts', () => {
      expect(sanitizeFilename('../../etc/passwd.png')).toBe('passwd.png');
      expect(sanitizeFilename('..\\..\\windows\\system32\\cmd.exe')).toBe('cmd.exe');
      expect(sanitizeFilename('/var/www/uploads/hero.jpg')).toBe('hero.jpg');
    });

    test('replaces dangerous characters with safe underscores', () => {
      expect(sanitizeFilename('my image (1) #2?.webp')).toBe('my_image__1___2_.webp');
      expect(sanitizeFilename('hello<script>.png')).toBe('hello_script_.png');
    });

    test('strips leading dots from hidden files', () => {
      expect(sanitizeFilename('.env.jpg')).toBe('env.jpg');
    });

    test('provides fallback name if string becomes empty', () => {
      const sanitized = sanitizeFilename('???');
      expect(sanitized.startsWith('file_')).toBe(true);
    });
  });

  describe('Upload Validation', () => {
    const validBuffer = Buffer.from('fake-image-data-bytes');

    test('accepts supported image formats (JPEG, PNG, WebP, AVIF, SVG)', () => {
      const formats = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml'];
      formats.forEach((mimeType) => {
        const result = validateUpload({
          filename: 'photo.img',
          buffer: validBuffer,
          mimeType,
        });
        expect(result.valid).toBe(true);
      });
    });

    test('rejects unapproved or dangerous MIME types', () => {
      const dangerousTypes = [
        'application/x-msdownload',
        'application/javascript',
        'text/html',
        'application/x-sh',
        'image/x-icon',
      ];
      dangerousTypes.forEach((mimeType) => {
        const result = validateUpload({
          filename: 'test.file',
          buffer: validBuffer,
          mimeType,
        });
        expect(result.valid).toBe(false);
        expect(result.error).toMatch(/Unsupported file type/);
      });
    });

    test('rejects empty file buffers', () => {
      const result = validateUpload({
        filename: 'empty.jpg',
        buffer: Buffer.alloc(0),
        mimeType: 'image/jpeg',
      });
      expect(result.valid).toBe(false);
      expect(result.error).toMatch(/File buffer cannot be empty/);
    });

    test('rejects files exceeding max size limit', () => {
      const oversizedBuffer = Buffer.alloc(MAX_IMAGE_SIZE_BYTES + 1024);
      const result = validateUpload({
        filename: 'huge.jpg',
        buffer: oversizedBuffer,
        mimeType: 'image/jpeg',
      });
      expect(result.valid).toBe(false);
      expect(result.error).toMatch(/exceeds maximum limit/);
    });

    test('rejects folders containing path traversal', () => {
      const result = validateUpload({
        filename: 'avatar.png',
        buffer: validBuffer,
        mimeType: 'image/png',
        folder: '../private',
      });
      expect(result.valid).toBe(false);
      expect(result.error).toMatch(/path traversal/i);
    });
  });

  describe('LocalDevStorageProvider Compatibility', () => {
    const provider = new LocalDevStorageProvider();

    test('implements MediaStorageProvider interface correctly', async () => {
      expect(provider.providerName).toBe('LOCAL_DEV_STORAGE');

      const result = await provider.uploadFile({
        filename: 'sample.webp',
        buffer: Buffer.from('sample-bytes'),
        mimeType: 'image/webp',
        folder: 'products',
      });

      expect(result.fileUrl).toContain('/uploads/products/');
      expect(result.key).toContain('products/');
      expect(result.sizeBytes).toBe(12);

      const publicUrl = provider.getPublicUrl(result.key);
      expect(publicUrl).toContain(`/uploads/${result.key}`);

      const deleteResult = await provider.deleteFile(result.key);
      expect(deleteResult).toBe(true);
    });
  });

  describe('SupabaseMediaStorageProvider Structure', () => {
    test('instantiates with default bucket names', () => {
      const provider = new SupabaseMediaStorageProvider();
      expect(provider.providerName).toBe('SUPABASE_STORAGE');
    });

    test('rejects upload when validation fails before network call', async () => {
      const provider = new SupabaseMediaStorageProvider();
      await expect(
        provider.uploadFile({
          filename: 'virus.exe',
          buffer: Buffer.from('virus'),
          mimeType: 'application/x-msdownload',
        })
      ).rejects.toThrow(/Upload validation failed/);
    });
  });
});
