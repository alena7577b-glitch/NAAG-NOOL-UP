import { Metadata } from 'next';
import { ShopCatalogView, ShopProduct } from '@/components/shop/ShopCatalogView';
import { getAllProducts } from '@/lib/products';

export const revalidate = 60; // ISR revalidation

export const metadata: Metadata = {
  title: 'Boutique & Merchandise Collection — Naag Nool UP',
  description:
    'Explore our curated collection of guided journals, modest apparel, cultural goods, and empowering merchandise. Each piece is crafted to inspire intentionality, reflection, and Somali heritage.',
  openGraph: {
    title: 'Boutique & Merchandise Collection — Naag Nool UP',
    description:
      'Explore our curated collection of guided journals, modest apparel, cultural goods, and empowering merchandise.',
    images: ['/images/shop-banner-actual.png'],
  },
};

export default async function ShopPage() {
  const { products, categories } = await getAllProducts();
  const shopProducts: ShopProduct[] = products.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    category: p.category || 'Merchandise',
    description: p.description || '',
    price: `$${Number(p.price).toFixed(2)}`,
    priceNumber: Number(p.price),
    imageUrl: p.imageUrl || `/images/journal-${p.slug.replace('the-', '')}.png`,
    inStock: p.isAvailable !== false,
  }));

  return <ShopCatalogView initialProducts={shopProducts} initialCategories={categories} />;
}

