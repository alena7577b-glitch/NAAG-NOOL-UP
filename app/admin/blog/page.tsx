import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/server';
import { getAdminBlogPosts } from '@/lib/actions/admin-management';
import { AdminBlogView } from '@/components/admin/AdminBlogView';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Blog & Editorial — Admin Console',
  robots: { index: false, follow: false },
};

export default async function AdminBlogPage() {
  try {
    await requireAdmin();
  } catch {
    redirect('/admin/login');
  }

  const posts = await getAdminBlogPosts();

  return <AdminBlogView initialPosts={posts} />;
}
