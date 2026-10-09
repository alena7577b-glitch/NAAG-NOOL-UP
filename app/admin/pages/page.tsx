import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/server';
import { getAdminContentPages } from '@/lib/actions/admin-management';
import { AdminPagesView } from '@/components/admin/AdminPagesView';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Pages & Templates — Admin Console',
  robots: { index: false, follow: false },
};

export default async function AdminPagesPage() {
  try {
    await requireAdmin();
  } catch {
    redirect('/admin/login');
  }

  const pages = await getAdminContentPages();

  return <AdminPagesView initialDbPages={pages} />;
}
