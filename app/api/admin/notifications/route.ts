import { NextResponse } from 'next/server';
import { getAdminNotifications } from '@/lib/actions/admin-notifications';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getAdminNotifications();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ notifications: [], unreadCount: 0 }, { status: 401 });
  }
}
