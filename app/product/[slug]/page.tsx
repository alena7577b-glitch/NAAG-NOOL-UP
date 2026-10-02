import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductDetailView } from '@/components/commerce/ProductDetailView';
import { getProductBySlug, getFeaturedProducts } from '@/lib/products';

export const revalidate = 60; // ISR revalidation

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found — Naag Nool UP',
    };
  }

  return {
    title: `${product.title} — Naag Nool UP`,
    description: product.description || `Discover ${product.title}, an intentional guided journal by Naag Nool UP.`,
    openGraph: {
      title: `${product.title} — Naag Nool UP`,
      description: product.description || undefined,
      images: product.imageUrl ? [{ url: product.imageUrl }] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const allProducts = await getFeaturedProducts(6);
  const relatedProducts = allProducts.filter((p) => p.slug !== slug);

  return <ProductDetailView product={product} relatedProducts={relatedProducts} />;
}
