'use server';

import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth/server';
import { revalidatePath } from 'next/cache';
import { logger } from '@/lib/logger';
import { activeMediaStorage } from '@/services/media/mediaStorage';
import { validateUpload } from '@/services/media/validation';

export interface MediaItem {
  id: string;
  name: string;
  category: string;
  url: string;
  sizeLabel: string;
  createdAt?: string;
  isDefault?: boolean;
}

import { STATIC_BRAND_ASSETS } from './media-catalog';

const DELETED_MEDIA_SETTING_KEY = 'deleted_media_asset_ids';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}

export async function getAdminMediaAssets(): Promise<MediaItem[]> {
  await requireAdmin();

  try {
    const [dbAssets, deletedSetting] = await Promise.all([
      db.mediaAsset.findMany({
        orderBy: { createdAt: 'desc' },
      }).catch(() => []),
      db.siteSetting.findUnique({
        where: { key: DELETED_MEDIA_SETTING_KEY },
      }).catch(() => null),
    ]);

    const deletedIds = new Set<string>(
      Array.isArray(deletedSetting?.value) ? (deletedSetting.value as string[]) : []
    );

    // Map database uploaded assets
    const mappedDbAssets: MediaItem[] = dbAssets
      .filter((a) => !deletedIds.has(a.id) && !deletedIds.has(a.fileUrl))
      .map((a) => ({
        id: a.id,
        name: a.filename.replace(/^\d+-/, '').replace(/_/g, ' '),
        category: 'Uploaded Assets',
        url: a.fileUrl,
        sizeLabel: formatBytes(a.sizeBytes),
        createdAt: a.createdAt.toISOString(),
        isDefault: false,
      }));

    // Filter static brand assets (excluding any deleted IDs or URLs)
    const activeStaticAssets = STATIC_BRAND_ASSETS.filter(
      (a) => !deletedIds.has(a.id) && !deletedIds.has(a.url)
    );

    return [...mappedDbAssets, ...activeStaticAssets];
  } catch (err: unknown) {
    logger.error('getAdminMediaAssets error:', err);
    return STATIC_BRAND_ASSETS;
  }
}

export async function deleteAdminMediaAssetAction(assetId: string) {
  const admin = await requireAdmin();

  try {
    // 1. Check if it's a database-backed MediaAsset
    const existing = await db.mediaAsset.findUnique({
      where: { id: assetId },
    }).catch(() => null);

    if (existing) {
      await db.mediaAsset.delete({
        where: { id: assetId },
      });

      // Attempt to delete physical file from storage provider
      try {
        await activeMediaStorage.deleteFile(existing.filename);
      } catch (storageErr) {
        logger.warn(`Storage file deletion notice for ${existing.filename}:`, storageErr);
      }
    }

    // 2. Persist to deleted media IDs setting so both DB assets and preset assets stay deleted
    const currentSetting = await db.siteSetting.findUnique({
      where: { key: DELETED_MEDIA_SETTING_KEY },
    }).catch(() => null);

    const currentList: string[] = Array.isArray(currentSetting?.value)
      ? (currentSetting.value as string[])
      : [];

    const staticMatch = STATIC_BRAND_ASSETS.find((a) => a.id === assetId || a.url === assetId);
    const toAdd = [assetId];
    if (staticMatch) {
      if (!toAdd.includes(staticMatch.url)) toAdd.push(staticMatch.url);
      if (!toAdd.includes(staticMatch.id)) toAdd.push(staticMatch.id);
    }

    const newItems = toAdd.filter((item) => !currentList.includes(item));
    if (newItems.length > 0) {
      const updatedList = [...currentList, ...newItems];
      await db.siteSetting.upsert({
        where: { key: DELETED_MEDIA_SETTING_KEY },
        create: {
          key: DELETED_MEDIA_SETTING_KEY,
          value: updatedList as any,
        },
        update: {
          value: updatedList as any,
        },
      });
    }

    revalidatePath('/admin/media');
    logger.info(`Media asset ${assetId} deleted by admin ${admin.email}`);
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to delete media asset.';
    logger.error('deleteAdminMediaAssetAction error:', msg);
    return { success: false, error: msg };
  }
}

export async function uploadAdminMediaAction(formData: FormData) {
  const admin = await requireAdmin();

  try {
    const file = formData.get('file') as File | null;
    const category = (formData.get('category') as string) || 'General';

    if (!file || file.size === 0) {
      return { success: false, error: 'No file provided.' };
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const validation = validateUpload({
      filename: file.name,
      buffer,
      mimeType: file.type,
    });

    if (!validation.valid) {
      return { success: false, error: validation.error || 'Invalid file format or size.' };
    }

    const uploadResult = await activeMediaStorage.uploadFile({
      filename: file.name,
      buffer,
      mimeType: file.type,
      folder: 'media-library',
      isPrivate: false,
    });

    const asset = await db.mediaAsset.create({
      data: {
        filename: uploadResult.key,
        fileUrl: uploadResult.fileUrl,
        mimeType: file.type,
        sizeBytes: uploadResult.sizeBytes,
      },
    });

    revalidatePath('/admin/media');
    logger.info(`Media asset uploaded: ${asset.filename} (${category}) by admin ${admin.email}`);

    return {
      success: true,
      asset: {
        id: asset.id,
        name: file.name,
        category,
        url: asset.fileUrl,
        sizeLabel: formatBytes(asset.sizeBytes),
        createdAt: asset.createdAt.toISOString(),
      },
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to upload media asset.';
    logger.error('uploadAdminMediaAction error:', msg);
    return { success: false, error: msg };
  }
}
