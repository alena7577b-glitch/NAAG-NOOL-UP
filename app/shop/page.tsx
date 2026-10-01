import { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, BookOpen, Search } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { ProductCard } from '@/components/commerce/ProductCard';
import { getAllProducts } from '@/lib/products';

export const revalidate = 60; // ISR revalidation

export const metadata: Metadata = {
  title: 'Shop Guided Journals — Naag Nool UP',
  description:
    'Browse the full collection of Naag Nool UP guided journals. Built with premium materials to anchor your self-reflection and agency.',
};

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    q?: string;
    sort?: 'price-asc' | 'price-desc' | 'newest';
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const category = params.category || 'All';
  const searchQuery = params.q || '';
  const sortBy = params.sort || 'newest';

  const { products, categories } = await getAllProducts({
    category,
    searchQuery,
    sortBy,
  });

  return (
    <div className="space-y-0">
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#F9F6F0] py-16 sm:py-24 border-b border-[#E5DFC0]/60">
        <Container size="narrow">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#B85233]/10 text-[#B85233] text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>The Journal Collection</span>
            </div>

            <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-normal text-[#1E1C1A] leading-[1.15]">
              Curated Tools for Transformation
            </h1>

            <p className="font-sans text-base sm:text-lg text-[#6B655B] max-w-xl mx-auto leading-relaxed">
              Every journal in our collection is an invitation to pause, reflect, and claim your narrative with intentional daily practices.
            </p>
          </div>
        </Container>
      </section>

      {/* 2. CATALOG CONTROLS & PRODUCT GRID */}
      <section className="py-16 sm:py-20 bg-white min-h-[50vh]">
        <Container size="default">
          {/* Filters & Category Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 pb-8 mb-10 border-b border-[#E5DFC0]/60">
            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {categories.map((cat) => {
                const isSelected = category === cat;
                return (
                  <Link
                    key={cat}
                    href={`/shop?category=${encodeURIComponent(cat)}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}`}
                    className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                      isSelected
                        ? 'bg-[#B85233] text-white shadow-sm'
                        : 'bg-[#F9F6F0] text-[#1E1C1A] hover:bg-[#EAE5DC]'
                    }`}
                  >
                    {cat}
                  </Link>
                );
              })}
            </div>

            {/* Search Input Form */}
            <form method="GET" action="/shop" className="relative flex items-center min-w-[240px]">
              {category !== 'All' && <input type="hidden" name="category" value={category} />}
              <input
                type="text"
                name="q"
                defaultValue={searchQuery}
                placeholder="Search journals..."
                aria-label="Search journals"
                className="w-full rounded-full bg-[#F9F6F0] border border-[#E5DFC0] py-2 ps-4 pe-10 text-xs sm:text-sm text-[#1E1C1A] placeholder:text-[#6B655B] focus:outline-none focus:border-[#B85233]"
              />
              <button
                type="submit"
                aria-label="Submit search"
                className="absolute end-3 text-[#6B655B] hover:text-[#B85233] transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Product Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl bg-[#F9F6F0] border border-[#E5DFC0] p-12 sm:p-16 text-center max-w-lg mx-auto space-y-5">
              <div className="w-14 h-14 rounded-full bg-[#B85233]/10 text-[#B85233] mx-auto flex items-center justify-center">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="font-playfair text-2xl text-[#1E1C1A]">No Journals Found</h3>
              <p className="font-sans text-sm text-[#6B655B] leading-relaxed">
                {searchQuery || category !== 'All'
                  ? 'No products matched your current filter criteria. Try resetting your search or category filters.'
                  : 'The journal editions are currently being curated. Join our community to receive an alert as soon as stock is released.'}
              </p>
              <div className="pt-2">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider bg-[#1E1C1A] text-white hover:bg-[#2A2724] transition-colors"
                >
                  Reset Filters
                </Link>
              </div>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
