import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/server';
import { getAdminCommunitySignups } from '@/lib/actions/admin-management';
import { AdminCommunityView } from '@/components/admin/AdminCommunityView';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Community Signups — Admin Console',
  robots: { index: false, follow: false },
};

export default async function AdminCommunityPage() {
  try {
    await requireAdmin();
  } catch {
    redirect('/admin/login');
  }

  const signups = await getAdminCommunitySignups();

  return <AdminCommunityView initialSignups={signups} />;
}
