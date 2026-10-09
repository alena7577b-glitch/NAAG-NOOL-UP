import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/server';
import { getAdminInventory } from '@/lib/actions/admin-management';
import { AdminInventoryView } from '@/components/admin/AdminInventoryView';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Inventory & Stock Allocation — Admin Console',
  robots: { index: false, follow: false },
};

export default async function AdminInventoryPage() {
  try {
    await requireAdmin();
  } catch {
    redirect('/admin/login');
  }

  const inventory = await getAdminInventory();

  return <AdminInventoryView initialInventory={inventory} />;
}
