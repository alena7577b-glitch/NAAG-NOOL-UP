import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/server';
import { getAdminProducts } from '@/lib/actions/admin-products';
import { AdminProductsView } from '@/components/admin/AdminProductsView';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Product Catalog Management — Admin Console',
  robots: { index: false, follow: false },
};

export default async function AdminProductsPage() {
  let user;
  try {
    user = await requireAdmin();
  } catch {
    redirect('/admin/unauthorized');
  }

  const products = await getAdminProducts();

  const serializedProducts = products.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    description: p.description || '',
    price: Number(p.price),
    stockQuantity: p.stockQuantity,
    category: p.category,
    isAvailable: p.isAvailable,
    imageUrl: p.images[0]?.url || '',
    createdAt: p.createdAt.toISOString(),
  }));

  return <AdminProductsView initialProducts={serializedProducts} adminUser={user} />;
}
