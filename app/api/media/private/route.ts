import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/server';
import { getAdminSupabaseClient } from '@/lib/supabase/admin';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json({ error: 'Missing key parameter' }, { status: 400 });
    }

    // Verify authenticated user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Only staff/admin can access private media documents
    if (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Access denied: Admin permissions required' }, { status: 403 });
    }

    const supabase = getAdminSupabaseClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase storage is not configured' },
        { status: 503 }
      );
    }

    const privateBucket =
      process.env.SUPABASE_STORAGE_PRIVATE_BUCKET || 'naag-nool-private-docs';

    const { data, error } = await supabase.storage
      .from(privateBucket)
      .createSignedUrl(key, 900); // 15-minute temporary signed link

    if (error || !data?.signedUrl) {
      logger.error('Failed to create signed URL for private asset:', error);
      return NextResponse.json({ error: 'Asset not found or unavailable' }, { status: 404 });
    }

    const acceptHeader = request.headers.get('accept') || '';
    if (acceptHeader.includes('application/json')) {
      return NextResponse.json({ signedUrl: data.signedUrl });
    }

    return NextResponse.redirect(data.signedUrl);
  } catch (err) {
    logger.error('Unexpected error in private media route:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
