import { Metadata } from 'next';
import { ShopCatalogView, ShopProduct } from '@/components/shop/ShopCatalogView';
import { getAllProducts } from '@/lib/products';

export const revalidate = 60; // ISR revalidation

export const metadata: Metadata = {
  title: 'Shop Guided Journals — Naag Nool UP',
  description:
    'Explore our collection of six beautifully crafted journals, designed to help you reflect, grow, and step into your power. Each journal is a companion for your journey.',
  openGraph: {
    title: 'Shop Guided Journals — Naag Nool UP',
    description:
      'Explore our collection of six beautifully crafted journals, designed to help you reflect, grow, and step into your power.',
    images: ['/images/shop-hero-woman.png'],
  },
};

export default async function ShopPage() {
  const { products } = await getAllProducts();
  const shopProducts: ShopProduct[] = products.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    category: p.category || 'Journal',
    description: p.description || '',
    price: `$${Number(p.price).toFixed(2)}`,
    priceNumber: Number(p.price),
    imageUrl: p.imageUrl || `/images/journal-${p.slug.replace('the-', '')}.png`,
    inStock: p.isAvailable !== false,
  }));

  return <ShopCatalogView initialProducts={shopProducts} />;
}

