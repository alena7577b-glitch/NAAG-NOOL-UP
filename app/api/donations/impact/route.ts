import { NextResponse } from 'next/server';
import { getPublicDonationImpact } from '@/lib/actions/donation';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const stats = await getPublicDonationImpact();
    return NextResponse.json(stats, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch donation impact metrics' },
      { status: 500 }
    );
  }
}
