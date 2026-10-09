import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/server';
import { AdminRolesView } from '@/components/admin/AdminRolesView';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Roles & Permissions — Admin Console',
  robots: { index: false, follow: false },
};

export default async function AdminRolesPage() {
  try {
    await requireAdmin();
  } catch {
    redirect('/admin/login');
  }

  return <AdminRolesView />;
}
