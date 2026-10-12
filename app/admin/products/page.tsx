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
    redirect('/admin/login');
  }

  const products = await getAdminProducts();

  const serializedProducts = products.map((p) => {
    const meta = (p.metadata as Record<string, any>) || {};
    return {
      id: p.id,
      title: p.title,
      slug: p.slug,
      description: p.description || '',
      price: Number(p.price),
      stockQuantity: p.stockQuantity,
      category: p.category,
      isAvailable: p.isAvailable,
      imageUrl: p.images[0]?.url || '',
      imageUrls: p.images.map((img) => img.url),
      colors: Array.isArray(meta.colors) ? (meta.colors as string[]) : [],
      material: typeof meta.material === 'string' ? meta.material : '',
      dimensions: typeof meta.dimensions === 'string' ? meta.dimensions : '',
      createdAt: p.createdAt.toISOString(),
    };
  });

  return <AdminProductsView initialProducts={serializedProducts} adminUser={user} />;
}
