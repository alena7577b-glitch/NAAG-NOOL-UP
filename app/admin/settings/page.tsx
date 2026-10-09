import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/server';
import { getPaymentSettingsAction } from '@/lib/actions/payment-settings';
import { AdminPaymentSettingsView } from '@/components/admin/AdminPaymentSettingsView';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Payment Methods & Store Settings — Admin Console',
  robots: { index: false, follow: false },
};

export default async function AdminSettingsPage() {
  try {
    await requireAdmin();
  } catch {
    redirect('/admin/login');
  }

  const config = await getPaymentSettingsAction();

  return <AdminPaymentSettingsView initialConfig={config} />;
}
