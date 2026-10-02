import { Metadata } from 'next';
import Link from 'next/link';
import { Search, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { ProductCard } from '@/components/commerce/ProductCard';
import { getAllProducts } from '@/lib/products';

export const revalidate = 60; // ISR revalidation

export const metadata: Metadata = {
  title: 'Shop Guided Journals — Naag Nool UP',
  description:
    'Explore our collection of six beautifully crafted journals, designed to help you reflect, grow, and step into your power. Each journal is a companion for your journey.',
};

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    q?: string;
    sort?: 'price-asc' | 'price-desc' | 'newest';
    priceRange?: string;
    inStock?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const category = params.category || 'All';
  const searchQuery = params.q || '';
  const sortBy = params.sort || 'newest';

  const { products } = await getAllProducts({
    category,
    searchQuery,
    sortBy,
  });

  const categoriesList = [
    { label: 'All Journals', value: 'All' },
    { label: 'Self-Discovery', value: 'Self-Discovery' },
    { label: 'Healing & Growth', value: 'Healing & Growth' },
    { label: 'Confidence & Success', value: 'Confidence & Success' },
    { label: 'Gratitude & Mindfulness', value: 'Gratitude & Mindfulness' },
    { label: 'Legacy & Purpose', value: 'Legacy & Purpose' },
  ];

  return (
    <div className="space-y-0 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#F9F6F0] py-12 sm:py-16 lg:py-24 border-b border-[#E5DFC0]/50">
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 text-start">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-[#B85233]">
                SHOP
              </p>

              <h1 className="font-playfair text-4xl sm:text-6xl lg:text-7xl font-normal text-[#1E1C1A] leading-[1.08] tracking-tight">
                Journals for a <br />
                brighter you.
              </h1>

              <p className="font-sans text-xs sm:text-sm lg:text-base text-[#6B655B] max-w-xl leading-relaxed">
                Explore our collection of six beautifully crafted journals, designed to help you reflect, grow, and step into your power. Each journal is a companion for your journey.
              </p>
            </div>

            {/* Right Hero Image */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/5] sm:aspect-[1/1] lg:aspect-[4/5] w-full rounded-2xl overflow-hidden shadow-lg border border-[#E5DFC0]/60 bg-[#FAF8F5]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/hero-portrait.svg"
                  alt="Woman in terracotta hijab against mountains"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. CATALOG HEADER & SIDEBAR + GRID */}
      <section className="py-12 sm:py-16 bg-[#FAF8F5]">
        <Container size="default">
          {/* Breadcrumbs & Catalog Title */}
          <div className="space-y-2 mb-8">
            <div className="flex items-center gap-2 text-xs text-[#6B655B]">
              <Link href="/" className="hover:text-[#B85233] transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-[#1E1C1A] font-medium">Shop</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2">
              <div>
                <h2 className="font-playfair text-3xl sm:text-4xl font-normal text-[#1E1C1A]">
                  Our Journals
                </h2>
                <p className="font-sans text-xs sm:text-sm text-[#6B655B] pt-1">
                  Six unique journals. One vision — a stronger, more intentional you.
                </p>
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2">
                <label htmlFor="shop-sort" className="text-xs text-[#6B655B]">
                  Sort by
                </label>
                <form method="GET" action="/shop">
                  {category !== 'All' && <input type="hidden" name="category" value={category} />}
                  {searchQuery && <input type="hidden" name="q" value={searchQuery} />}
                  <select
                    id="shop-sort"
                    name="sort"
                    defaultValue={sortBy}
                    onChange={(e) => e.target.form?.submit()}
                    className="rounded-md bg-white border border-[#E5DFC0] px-3 py-1.5 text-xs text-[#1E1C1A] focus:outline-none focus:border-[#B85233] cursor-pointer"
                  >
                    <option value="newest">Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </form>
              </div>
            </div>
          </div>

          {/* Main Layout: Sidebar (col-span-3) + Product Grid (col-span-9) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left Sidebar Filters */}
            <aside className="lg:col-span-3 space-y-6 bg-[#F4EFE6]/60 p-5 sm:p-6 rounded-xl border border-[#E5DFC0]/60">
              {/* Search Box */}
              <div className="space-y-2">
                <span className="block text-xs font-semibold text-[#1E1C1A]">Search</span>
                <form method="GET" action="/shop" className="relative flex items-center">
                  {category !== 'All' && <input type="hidden" name="category" value={category} />}
                  <input
                    type="text"
                    name="q"
                    defaultValue={searchQuery}
                    placeholder="Search journals..."
                    className="w-full rounded-md bg-white border border-[#E5DFC0] py-2 ps-3.5 pe-9 text-xs text-[#1E1C1A] placeholder:text-[#6B655B] focus:outline-none focus:border-[#B85233]"
                  />
                  <button
                    type="submit"
                    aria-label="Submit search"
                    className="absolute end-2.5 text-[#6B655B] hover:text-[#B85233]"
                  >
                    <Search className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>

              {/* Categories */}
              <div className="space-y-2.5 pt-3 border-t border-[#E5DFC0]/70">
                <span className="block text-xs font-semibold text-[#1E1C1A]">Categories</span>
                <div className="space-y-2 font-sans text-xs text-[#1E1C1A]">
                  {categoriesList.map((item) => {
                    const isSelected = category === item.value;
                    return (
                      <Link
                        key={item.value}
                        href={`/shop?category=${encodeURIComponent(item.value)}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}`}
                        className="flex items-center gap-2.5 group cursor-pointer"
                      >
                        <span
                          className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? 'border-[#B85233] bg-white'
                              : 'border-[#1E1C1A]/40 group-hover:border-[#B85233]'
                          }`}
                        >
                          {isSelected && <span className="w-2 h-2 rounded-full bg-[#B85233]" />}
                        </span>
                        <span className={isSelected ? 'font-semibold text-[#B85233]' : 'text-[#1E1C1A]/85 group-hover:text-[#B85233]'}>
                          {item.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Price Filters */}
              <div className="space-y-2.5 pt-3 border-t border-[#E5DFC0]/70">
                <span className="block text-xs font-semibold text-[#1E1C1A]">Price</span>
                <div className="space-y-2 font-sans text-xs text-[#1E1C1A]">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" className="rounded border-[#E5DFC0] text-[#B85233] focus:ring-0" />
                    <span>Under $20</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-[#E5DFC0] text-[#B85233] focus:ring-0" />
                    <span>$20 – $30</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" className="rounded border-[#E5DFC0] text-[#B85233] focus:ring-0" />
                    <span>$30 – $40</span>
                  </label>
                </div>
              </div>

              {/* Availability Filter */}
              <div className="space-y-2.5 pt-3 border-t border-[#E5DFC0]/70">
                <span className="block text-xs font-semibold text-[#1E1C1A]">Availability</span>
                <div className="space-y-2 font-sans text-xs text-[#1E1C1A]">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-[#E5DFC0] text-[#B85233] focus:ring-0" />
                    <span>In Stock</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" className="rounded border-[#E5DFC0] text-[#B85233] focus:ring-0" />
                    <span>Out of Stock</span>
                  </label>
                </div>
              </div>
            </aside>

            {/* Right Product Grid (3 columns on desktop) */}
            <div className="lg:col-span-9 space-y-10">
              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} showDetailsButton={true} />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl bg-white border border-[#E5DFC0] p-12 text-center space-y-4">
                  <h3 className="font-playfair text-xl text-[#1E1C1A]">No Journals Found</h3>
                  <p className="text-xs text-[#6B655B]">
                    No journals match your active filter. Try clearing your search or category filter.
                  </p>
                  <Link
                    href="/shop"
                    className="inline-block px-5 py-2 rounded-md bg-[#B85233] text-white text-xs font-medium"
                  >
                    Reset Filters
                  </Link>
                </div>
              )}

              {/* Pagination Controls */}
              <div className="flex items-center justify-center gap-2 pt-6 border-t border-[#E5DFC0]/60">
                <button
                  type="button"
                  aria-label="Previous page"
                  className="w-8 h-8 rounded-full border border-[#E5DFC0] bg-white flex items-center justify-center text-[#6B655B] hover:text-[#1E1C1A] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                </button>
                <button
                  type="button"
                  className="w-8 h-8 rounded-full bg-[#B85233] text-white text-xs font-semibold flex items-center justify-center"
                >
                  1
                </button>
                <button
                  type="button"
                  className="w-8 h-8 rounded-full border border-[#E5DFC0] bg-white text-[#1E1C1A] text-xs font-medium flex items-center justify-center hover:bg-[#F9F6F0]"
                >
                  2
                </button>
                <button
                  type="button"
                  aria-label="Next page"
                  className="w-8 h-8 rounded-full border border-[#E5DFC0] bg-white flex items-center justify-center text-[#6B655B] hover:text-[#1E1C1A] transition-colors"
                >
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. MOVEMENT BANNER ("More than journals. A movement.") */}
      <section className="py-16 sm:py-20 bg-[#4D5844] text-white">
        <Container size="default">
          <div className="relative rounded-2xl bg-[#444F3B] border border-white/10 p-8 sm:p-12 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Content */}
              <div className="lg:col-span-7 space-y-4">
                <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-normal text-white leading-snug">
                  More than journals. <br />
                  A movement.
                </h2>
                <p className="font-sans text-xs sm:text-sm text-white/80 max-w-xl leading-relaxed">
                  Each purchase supports a bigger purpose. Join us in creating opportunities through Ayeyo Koris.
                </p>
                <div className="pt-2">
                  <Link
                    href="/ayeyo-koris"
                    className="inline-flex items-center gap-2 rounded-md bg-transparent border border-white text-white px-6 py-2.5 text-xs sm:text-sm font-medium hover:bg-white/10 transition-colors"
                  >
                    <span>Learn About Ayeyo Koris</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </Link>
                </div>
              </div>

              {/* Right Image */}
              <div className="lg:col-span-5">
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden shadow-lg border border-white/20 bg-[#FAF8F5]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/writing-hands.svg"
                    alt="Journals on table"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
