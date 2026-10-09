import { redirect } from 'next/navigation';
import { requireSuperAdmin } from '@/lib/auth/server';
import { getAdminUsersList } from '@/lib/actions/admin-users';
import { AdminUsersView } from '@/components/admin/AdminUsersView';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Staff & Role Management — Admin Console',
  robots: { index: false, follow: false },
};

export default async function AdminUsersPage() {
  let user;
  try {
    user = await requireSuperAdmin();
  } catch {
    redirect('/admin/login');
  }

  const users = await getAdminUsersList();

  return <AdminUsersView initialUsers={users} currentUserEmail={user.email} />;
}
