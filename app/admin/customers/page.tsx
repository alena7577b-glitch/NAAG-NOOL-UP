import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/server';
import { getAdminCustomers } from '@/lib/actions/admin-management';
import { AdminCustomersView } from '@/components/admin/AdminCustomersView';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Customers Directory — Admin Console',
  robots: { index: false, follow: false },
};

export default async function AdminCustomersPage() {
  try {
    await requireAdmin();
  } catch {
    redirect('/admin/login');
  }

  const customers = await getAdminCustomers();

  return <AdminCustomersView initialCustomers={customers} />;
}
