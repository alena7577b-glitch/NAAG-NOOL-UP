import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/server';
import { getAdminInquiries } from '@/lib/actions/admin-management';
import { AdminInquiriesView } from '@/components/admin/AdminInquiriesView';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Contact Inquiries — Admin Console',
  robots: { index: false, follow: false },
};

export default async function AdminInquiriesPage() {
  try {
    await requireAdmin();
  } catch {
    redirect('/admin/login');
  }

  const inquiries = await getAdminInquiries();

  return <AdminInquiriesView initialInquiries={inquiries} />;
}
