'use server';

import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth/server';
import { revalidatePath } from 'next/cache';
import { logger } from '@/lib/logger';
import { z } from 'zod';

export interface SiteBanner {
  id: string;
  title: string;
  text: string;
  badge?: string;
  linkUrl?: string;
  linkText?: string;
  position: 'top_ribbon' | 'hero_ad' | 'footer_callout';
  bgColor: string;
  textColor: string;
  isActive: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

const SETTING_KEY = 'site_promotional_banners';

const defaultBanners: SiteBanner[] = [
  {
    id: 'banner_top_ribbon_official',
    title: 'Complimentary Worldwide Delivery',
    text: 'Complimentary shipping on orders over $100. Every journal purchased funds Somali girls’ education.',
    badge: 'NOTICE',
    linkUrl: '/shop',
    linkText: 'Explore Journals',
    position: 'top_ribbon',
    bgColor: '#182821',
    textColor: '#F9F6F0',
    isActive: true,
    priority: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'banner_ayeeyo_scholarship',
    title: 'Ayeeyo Koris Educational Scholarship',
    text: 'Support children raised by grandmothers with direct scholarships, books, and school supplies.',
    badge: 'IMPACT',
    linkUrl: '/ayeyo-koris',
    linkText: 'Learn & Donate',
    position: 'hero_ad',
    bgColor: '#B85233',
    textColor: '#FFFFFF',
    isActive: true,
    priority: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function getAdminBanners(): Promise<SiteBanner[]> {
  await requireAdmin();

  try {
    const setting = await db.siteSetting.findUnique({
      where: { key: SETTING_KEY },
    });

    if (!setting || !Array.isArray(setting.value) || setting.value.length === 0) {
      // Store and return initial defaults so the store starts with high-fidelity banners
      try {
        await db.siteSetting.upsert({
          where: { key: SETTING_KEY },
          create: {
            key: SETTING_KEY,
            value: defaultBanners as any,
          },
          update: {},
        });
      } catch (upsertErr) {
        logger.warn('Failed to seed default banners into SiteSetting:', upsertErr);
      }
      return defaultBanners;
    }

    return setting.value as unknown as SiteBanner[];
  } catch (err: unknown) {
    logger.error('getAdminBanners error:', err);
    return defaultBanners;
  }
}

export async function getActiveBanners(): Promise<SiteBanner[]> {
  try {
    const setting = await db.siteSetting.findUnique({
      where: { key: SETTING_KEY },
    });

    if (!setting || !Array.isArray(setting.value)) {
      return defaultBanners.filter((b) => b.isActive);
    }

    const banners = setting.value as unknown as SiteBanner[];
    return banners.filter((b) => b.isActive).sort((a, b) => (a.priority || 0) - (b.priority || 0));
  } catch (err: unknown) {
    logger.warn('getActiveBanners fallback error:', err);
    return defaultBanners.filter((b) => b.isActive);
  }
}

const bannerSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(100),
  text: z.string().min(3, 'Banner message is required').max(300),
  badge: z.string().max(30).optional(),
  linkUrl: z.string().max(300).optional(),
  linkText: z.string().max(50).optional(),
  position: z.enum(['top_ribbon', 'hero_ad', 'footer_callout']).default('top_ribbon'),
  bgColor: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Invalid hex color').default('#182821'),
  textColor: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Invalid hex color').default('#FFFFFF'),
  isActive: z.boolean().default(true),
  priority: z.number().int().default(1),
});

export type BannerFormData = z.infer<typeof bannerSchema>;

export async function saveAdminBannerAction(formData: BannerFormData, bannerId?: string) {
  const admin = await requireAdmin();

  const parsed = bannerSchema.safeParse(formData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || 'Invalid banner data.',
    };
  }

  try {
    const currentBanners = await getAdminBanners();
    let updatedList: SiteBanner[];

    if (bannerId) {
      // Edit existing
      updatedList = currentBanners.map((b) =>
        b.id === bannerId
          ? {
              ...b,
              ...parsed.data,
              updatedAt: new Date().toISOString(),
            }
          : b
      );
    } else {
      // Create new
      const newBanner: SiteBanner = {
        id: `banner_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        ...parsed.data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      updatedList = [newBanner, ...currentBanners];
    }

    await db.siteSetting.upsert({
      where: { key: SETTING_KEY },
      create: {
        key: SETTING_KEY,
        value: updatedList as any,
      },
      update: {
        value: updatedList as any,
      },
    });

    revalidatePath('/admin/banners');
    revalidatePath('/', 'layout');

    logger.info(`Banner ${bannerId ? 'updated' : 'created'} by admin ${admin.email}`);
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to save banner.';
    logger.error('saveAdminBannerAction error:', msg);
    return { success: false, error: msg };
  }
}

export async function toggleBannerActiveAction(bannerId: string, isActive: boolean) {
  const admin = await requireAdmin();

  try {
    const currentBanners = await getAdminBanners();
    const updatedList = currentBanners.map((b) =>
      b.id === bannerId
        ? {
            ...b,
            isActive,
            updatedAt: new Date().toISOString(),
          }
        : b
    );

    await db.siteSetting.upsert({
      where: { key: SETTING_KEY },
      create: {
        key: SETTING_KEY,
        value: updatedList as any,
      },
      update: {
        value: updatedList as any,
      },
    });

    revalidatePath('/admin/banners');
    revalidatePath('/', 'layout');

    logger.info(`Banner ${bannerId} toggled to ${isActive} by admin ${admin.email}`);
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to toggle banner status.';
    logger.error('toggleBannerActiveAction error:', msg);
    return { success: false, error: msg };
  }
}

export async function deleteBannerAction(bannerId: string) {
  const admin = await requireAdmin();

  try {
    const currentBanners = await getAdminBanners();
    const updatedList = currentBanners.filter((b) => b.id !== bannerId);

    await db.siteSetting.upsert({
      where: { key: SETTING_KEY },
      create: {
        key: SETTING_KEY,
        value: updatedList as any,
      },
      update: {
        value: updatedList as any,
      },
    });

    revalidatePath('/admin/banners');
    revalidatePath('/', 'layout');

    logger.info(`Banner ${bannerId} deleted by admin ${admin.email}`);
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to delete banner.';
    logger.error('deleteBannerAction error:', msg);
    return { success: false, error: msg };
  }
}
