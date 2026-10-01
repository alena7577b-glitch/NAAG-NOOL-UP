import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { ProductCard } from '@/components/commerce/ProductCard';
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

  const relatedProducts = (await getFeaturedProducts(3)).filter((p) => p.slug !== slug);

  return (
    <div className="py-12 sm:py-16 bg-white min-h-[70vh]">
      <Container size="default">
        <ProductDetailView product={product} />

        {/* Related Journals Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-[#E5DFC0]/70 space-y-8">
            <div className="text-center sm:text-start space-y-1">
              <span className="text-xs uppercase tracking-widest font-semibold text-[#B85233]">
                Explore More
              </span>
              <h2 className="font-playfair text-2xl sm:text-3xl font-normal text-[#1E1C1A]">
                You May Also Value
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
