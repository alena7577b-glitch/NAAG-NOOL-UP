import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/server';
import { getAdminBanners } from '@/lib/actions/admin-banners';
import { AdminBannersView } from '@/components/admin/AdminBannersView';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Ad Banners & Site Notices — Admin Console',
  robots: { index: false, follow: false },
};

export default async function AdminBannersPage() {
  try {
    await requireAdmin();
  } catch {
    redirect('/admin/login');
  }

  const banners = await getAdminBanners();

  return <AdminBannersView initialBanners={banners} />;
}
