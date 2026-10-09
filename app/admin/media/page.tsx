import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/server';
import { AdminMediaView } from '@/components/admin/AdminMediaView';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Media Library — Admin Console',
  robots: { index: false, follow: false },
};

export default async function AdminMediaPage() {
  try {
    await requireAdmin();
  } catch {
    redirect('/admin/login');
  }

  return <AdminMediaView />;
}
