import { NextResponse } from 'next/server';
import { getActiveBanners } from '@/lib/actions/admin-banners';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const banners = await getActiveBanners();
    const topBanner = banners.find((b) => b.position === 'top_ribbon') ?? null;
    return NextResponse.json({
      banners,
      banner: topBanner,
    });
  } catch {
    return NextResponse.json({ banners: [], banner: null });
  }
}
