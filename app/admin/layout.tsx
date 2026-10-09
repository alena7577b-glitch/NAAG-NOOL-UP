import { getCurrentUser } from '@/lib/auth/server';
import { AdminLayoutShell } from '@/components/admin/AdminLayoutShell';

export const dynamic = 'force-dynamic';

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const isAuthorized = user && (user.role === 'ADMIN' || user.role === 'SUPERADMIN');

  if (!isAuthorized) {
    return <>{children}</>;
  }

  return (
    <AdminLayoutShell
      userName={user.fullName || 'Super Admin'}
      userRole={user.role}
      userEmail={user.email}
    >
      {children}
    </AdminLayoutShell>
  );
}
