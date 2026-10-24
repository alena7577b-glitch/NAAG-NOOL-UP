import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/server';
import { getAdminDonations } from '@/lib/actions/admin-donations';
import { AdminDonationsView } from '@/components/admin/AdminDonationsView';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Ayeeyo Koris Children Donations — Admin Console',
  robots: { index: false, follow: false },
};

export default async function AdminDonationsPage() {
  try {
    await requireAdmin();
  } catch {
    redirect('/admin/login');
  }

  const { donations, summary } = await getAdminDonations();

  return (
    <AdminDonationsView
      initialDonations={donations}
      initialSummary={summary}
    />
  );
}
