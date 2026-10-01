import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/server';

export const dynamic = 'force-dynamic';

/**
 * NAAG NOOL UP — Current User Session Endpoint
 * Returns the currently authenticated user's public info or null.
 */
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}
