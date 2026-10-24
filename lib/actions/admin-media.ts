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

const DELETED_MEDIA_SETTING_KEY = 'deleted_media_asset_ids';

const DEFAULT_BRAND_ASSETS: MediaItem[] = [
  { id: 'm1', name: 'Ayeyo Portrait (Hero)', category: 'Hero & Editorial', url: '/images/ayeyo-actual-hero.png', sizeLabel: '641 KB', isDefault: true },
  { id: 'm2', name: 'Hero Panoramic Landscape', category: 'Hero & Editorial', url: '/images/hp-hero-panoramic.png', sizeLabel: '408 KB', isDefault: true },
  { id: 'm3', name: 'Somali Women Circle', category: 'Community', url: '/images/community-women-circle.jpg', sizeLabel: '277 KB', isDefault: true },
  { id: 'm4', name: 'Cinematic Sunset Glow', category: 'Atmospheric', url: '/images/prefooter-sunset-cinematic.jpg', sizeLabel: '714 KB', isDefault: true },
  { id: 'm5', name: 'The Awakening Edition Cover', category: 'Journals', url: '/images/book-cover-awakening.png', sizeLabel: '12 KB', isDefault: true },
  { id: 'm6', name: 'The Clarity Edition Cover', category: 'Journals', url: '/images/book-cover-clarity.png', sizeLabel: '11 KB', isDefault: true },
  { id: 'm7', name: 'The Healing Edition Cover', category: 'Journals', url: '/images/book-cover-healing.png', sizeLabel: '12 KB', isDefault: true },
  { id: 'm8', name: 'The Confidence Edition Cover', category: 'Journals', url: '/images/book-cover-confidence.png', sizeLabel: '12 KB', isDefault: true },
  { id: 'm9', name: 'The Abundance Edition Cover', category: 'Journals', url: '/images/book-cover-abundance.png', sizeLabel: '11 KB', isDefault: true },
  { id: 'm10', name: 'The Legacy Edition Cover', category: 'Journals', url: '/images/book-cover-legacy.png', sizeLabel: '12 KB', isDefault: true },
  { id: 'm11', name: 'EVC Plus Carrier Logo', category: 'Payment Badges', url: '/images/payment-methods/EVC-PLUS-Logo-01-230x128.webp', sizeLabel: '4 KB', isDefault: true },
  { id: 'm12', name: 'ZAAD Service Logo', category: 'Payment Badges', url: '/images/payment-methods/zaad.png', sizeLabel: '13 KB', isDefault: true },
  { id: 'm13', name: 'Sahal (Golis) Logo', category: 'Payment Badges', url: '/images/payment-methods/Golis_Telecom_Logo.png', sizeLabel: '109 KB', isDefault: true },
  { id: 'm14', name: 'eDahab Dahabshiil Logo', category: 'Payment Badges', url: '/images/payment-methods/edahab.jpg', sizeLabel: '9 KB', isDefault: true },
  { id: 'm15', name: 'Premier Wallet Logo', category: 'Payment Badges', url: '/images/payment-methods/premier wallet.png', sizeLabel: '36 KB', isDefault: true },
  { id: 'm16', name: 'Ayeyo Writing & Reflection', category: 'Hero & Editorial', url: '/images/ayeyo-writing.png', sizeLabel: '87 KB', isDefault: true },
  { id: 'm17', name: 'Ayeyo Study & Quietude', category: 'Hero & Editorial', url: '/images/ayeyo-study.png', sizeLabel: '41 KB', isDefault: true },
  { id: 'm18', name: 'Ayeyo Walking Outdoors', category: 'Hero & Editorial', url: '/images/ayeyo-walking.png', sizeLabel: '38 KB', isDefault: true },
];

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
      .filter((a) => !deletedIds.has(a.id))
      .map((a) => ({
        id: a.id,
        name: a.filename.replace(/^\d+-/, '').replace(/_/g, ' '),
        category: 'Uploaded Assets',
        url: a.fileUrl,
        sizeLabel: formatBytes(a.sizeBytes),
        createdAt: a.createdAt.toISOString(),
        isDefault: false,
      }));

    // Filter default brand assets
    const activeDefaultAssets = DEFAULT_BRAND_ASSETS.filter((a) => !deletedIds.has(a.id));

    return [...mappedDbAssets, ...activeDefaultAssets];
  } catch (err: unknown) {
    logger.error('getAdminMediaAssets error:', err);
    return DEFAULT_BRAND_ASSETS;
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

    if (!currentList.includes(assetId)) {
      const updatedList = [...currentList, assetId];
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
