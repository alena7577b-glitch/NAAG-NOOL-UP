'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, Check, ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import { useOptionalCart } from '@/lib/cart/CartContext';

export interface ShopProduct {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  price: string;
  priceNumber: number;
  imageUrl: string;
  inStock: boolean;
}

export interface ShopCatalogViewProps {
  initialProducts?: ShopProduct[];
  initialCategories?: string[];
}

export const SHOP_PRODUCTS: ShopProduct[] = [
  {
    id: 'prod-awakening',
    title: 'The Awakening',
    slug: 'the-awakening',
    category: 'Self-Discovery',
    description: 'A guided journal to help you reconnect with your true self and rediscover your inner strength.',
    price: '$24.00',
    priceNumber: 24.0,
    imageUrl: '/images/shop-flatlay-awakening.png',
    inStock: true,
  },
  {
    id: 'prod-clarity',
    title: 'The Clarity',
    slug: 'the-clarity',
    category: 'Healing & Growth',
    description: 'Clear your mind, release what no longer serves you, and find your direction.',
    price: '$24.00',
    priceNumber: 24.0,
    imageUrl: '/images/shop-flatlay-clarity.png',
    inStock: true,
  },
  {
    id: 'prod-healing',
    title: 'The Healing',
    slug: 'the-healing',
    category: 'Confidence & Success',
    description: 'A space to process, rebuild, and embrace your new chapter.',
    price: '$24.00',
    priceNumber: 24.0,
    imageUrl: '/images/shop-flatlay-healing.png',
    inStock: true,
  },
  {
    id: 'prod-confidence',
    title: 'The Confidence',
    slug: 'the-confidence',
    category: 'Gratitude & Mindfulness',
    description: 'Build your self-belief, set your goals, and celebrate your progress.',
    price: '$24.00',
    priceNumber: 24.0,
    imageUrl: '/images/shop-flatlay-confidence.png',
    inStock: true,
  },
  {
    id: 'prod-abundance',
    title: 'The Abundance',
    slug: 'the-abundance',
    category: 'Legacy & Purpose',
    description: 'Cultivate gratitude, attract possibility, and create the life you deserve.',
    price: '$24.00',
    priceNumber: 24.0,
    imageUrl: '/images/shop-flatlay-abundance.png',
    inStock: true,
  },
  {
    id: 'prod-legacy',
    title: 'The Legacy',
    slug: 'the-legacy',
    category: 'Legacy & Purpose',
    description: 'Write your story, honor your journey, and leave a lasting impact.',
    price: '$24.00',
    priceNumber: 24.0,
    imageUrl: '/images/shop-flatlay-legacy.png',
    inStock: true,
  },
];

const CATEGORIES = [
  'All Journals',
  'Self-Discovery',
  'Healing & Growth',
  'Confidence & Success',
  'Gratitude & Mindfulness',
  'Legacy & Purpose',
] as const;

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'alpha-asc' | 'newest';

export function ShopCatalogView({
  initialProducts,
}: ShopCatalogViewProps = {}) {
  const optionalCart = useOptionalCart();
  const rawProducts = initialProducts && initialProducts.length > 0 ? initialProducts : SHOP_PRODUCTS;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Journals');
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>(['$20 – $30']);
  const [inStockOnly, setInStockOnly] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Instant Interactive Filtering
  const filteredProducts = useMemo(() => {
    return rawProducts.filter((product) => {
      // 1. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = product.title.toLowerCase().includes(q);
        const matchesCategory = product.category.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCategory && !matchesDesc) return false;
      }

      // 2. Category Filter
      if (selectedCategory !== 'All Journals' && product.category !== selectedCategory) {
        return false;
      }

      // 3. Price Filter
      if (selectedPriceRanges.length > 0) {
        const matchesPrice = selectedPriceRanges.some((range) => {
          if (range === 'Under $20') return product.priceNumber < 20;
          if (range === '$20 – $30') return product.priceNumber >= 20 && product.priceNumber <= 30;
          if (range === '$30 – $40') return product.priceNumber > 30 && product.priceNumber <= 40;
          return true;
        });
        if (!matchesPrice) return false;
      }

      // 4. Availability Filter
      if (inStockOnly && !product.inStock) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.priceNumber - b.priceNumber;
      if (sortBy === 'price-desc') return b.priceNumber - a.priceNumber;
      if (sortBy === 'alpha-asc') return a.title.localeCompare(b.title);
      return 0; // 'featured' keeps curated Figma order
    });
  }, [rawProducts, searchQuery, selectedCategory, selectedPriceRanges, inStockOnly, sortBy]);

  // Cart click feedback
  const handleAddToCart = (product: ShopProduct) => {
    optionalCart?.addItem({
      id: product.id,
      title: product.title,
      slug: product.slug,
      price: product.priceNumber,
      imageUrl: product.imageUrl,
      category: product.category,
    });
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 2200);
  };

  const togglePriceRange = (range: string) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range]
    );
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All Journals');
    setSelectedPriceRanges(['$20 – $30']);
    setInStockOnly(true);
    setSortBy('featured');
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'All Journals' ||
    selectedPriceRanges.length !== 1 ||
    !selectedPriceRanges.includes('$20 – $30') ||
    !inStockOnly;

  return (
    <div className="w-full bg-[#FAF6F0] text-[#1E1C1A]">
      {/* =========================================================================
          1. EDITORIAL SHOP HERO BANNER (Exact Match to Design Mockup)
      ========================================================================= */}
      <section className="relative w-full min-h-[380px] sm:min-h-[440px] lg:min-h-[480px] xl:min-h-[520px] overflow-hidden flex items-center bg-[#EAE2D5] border-b border-[#DDD4C3]">
        {/* Full-bleed panoramic photography */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/shop-banner-actual.png"
            alt="Naag Nool UP guided journals on stone pedestal with olive branches"
            className="w-full h-full object-cover object-[80%_center] sm:object-[82%_center] lg:object-right"
          />
          {/* Gentle warm atmospheric gradient scrim from left to blend wall background smoothly with text */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF6F0] via-[#FAF6F0]/90 via-35% sm:via-[#FAF6F0]/65 sm:via-42% to-transparent pointer-events-none" />
        </div>

        {/* Left Narrative Content Overlay */}
        <div className="relative z-10 w-full max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-14 py-12 sm:py-16">
          <div className="max-w-md sm:max-w-lg lg:max-w-xl text-start space-y-4 sm:space-y-5">
            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <p className="font-sans text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-[#B85233]">
                THE JOURNALS
              </p>
              <span className="w-8 sm:w-10 h-[1.5px] bg-[#B85233]/70" />
            </div>

            {/* Majestic Headline */}
            <h1 className="font-playfair text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-normal text-[#1E1C1A] leading-[1.14] tracking-tight">
              More than journals. <br />
              Tools for a <span className="font-cormorant italic font-normal text-[#B85233]">fuller</span> you.
            </h1>

            {/* Editorial Description */}
            <p className="font-sans text-xs sm:text-[13.5px] lg:text-[14px] text-[#4A433A] leading-[1.68] font-normal max-w-[430px]">
              Explore our collection of thoughtfully crafted journals, designed to support your growth, reflection, and journey toward a more intentional life.
            </p>

            {/* CTA Button */}
            <div className="pt-2">
              <a
                href="#catalog"
                className="inline-flex items-center justify-center gap-2 bg-[#B85233] hover:bg-[#A34327] text-white text-xs sm:text-sm font-medium px-6 py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98]"
              >
                <span>Shop the Journals</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. CATALOG CONTROLS & BREADCRUMBS ROW
      ========================================================================= */}
      <section id="catalog" className="pt-10 sm:pt-12 pb-6 border-b border-[#EDE6D8] scroll-mt-20">
        <div className="w-full max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-14">
          
          {/* Breadcrumb Path */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-sans text-[#786E63] mb-4">
            <Link href="/" className="hover:text-[#A64426] transition-colors">
              Home
            </Link>
            <span className="text-[#B8AFA2]">/</span>
            <span className="text-[#A64426] font-medium">Shop</span>
          </nav>

          {/* Catalog Title + Right Controls (Sort & Mobile Toggle) */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="font-playfair text-3xl sm:text-4xl font-normal text-[#1E1C1A] tracking-tight">
                Our Journals
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#6E6559] mt-1">
                Six unique journals. One vision — a stronger, more intentional you.
              </p>
            </div>

            {/* Controls: Sort Dropdown & Mobile Filter Button */}
            <div className="flex items-center gap-3">
              {/* Mobile Filter Toggle */}
              <button
                type="button"
                onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                className="lg:hidden inline-flex items-center gap-2 bg-white border border-[#E0D7C6] rounded-lg px-3.5 py-2 text-xs font-medium text-[#1E1C1A] shadow-xs active:bg-[#FAF6F0]"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#A64426]" />
                <span>Filters {hasActiveFilters && '•'}</span>
              </button>

              {/* Sort By Dropdown */}
              <div className="relative inline-flex items-center gap-2">
                <span className="font-sans text-xs text-[#786E63] whitespace-nowrap">Sort by</span>
                <div className="relative">
                  <select
                    id="shop-sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="appearance-none bg-white border border-[#E0D7C6] rounded-lg pl-3 pr-8 py-2 text-xs font-medium text-[#1E1C1A] focus:outline-none focus:border-[#A64426] shadow-xs cursor-pointer"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="alpha-asc">Alphabetical: A–Z</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-[#786E63] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Active Filter Indicators (When active) */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-4">
              <span className="text-xs text-[#786E63] font-medium">Active filters:</span>
              {selectedCategory !== 'All Journals' && (
                <span className="inline-flex items-center gap-1.5 bg-white border border-[#E0D7C6] text-[#1E1C1A] text-[11px] px-2.5 py-1 rounded-full shadow-xs">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory('All Journals')} className="hover:text-[#A64426]">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 bg-white border border-[#E0D7C6] text-[#1E1C1A] text-[11px] px-2.5 py-1 rounded-full shadow-xs">
                  Search: &ldquo;{searchQuery}&rdquo;
                  <button onClick={() => setSearchQuery('')} className="hover:text-[#A64426]">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={resetAllFilters}
                className="text-xs text-[#A64426] hover:underline font-medium ml-2"
              >
                Clear all
              </button>
            </div>
          )}

        </div>
      </section>

      {/* =========================================================================
          3. MAIN SHOP AREA: LEFT FILTER SIDEBAR + RIGHT 3-COLUMN PRODUCT GRID
      ========================================================================= */}
      <section className="py-10 sm:py-14 bg-[#FAF6F0]">
        <div className="w-full max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* ===================================================================
                LEFT FILTER SIDEBAR (col-span-3)
            =================================================================== */}
            <aside
              className={`lg:col-span-3 space-y-7 ${
                isMobileFiltersOpen ? 'block' : 'hidden lg:block'
              }`}
            >
              {/* 1. Search Box */}
              <div className="space-y-2">
                <label htmlFor="shop-search" className="block text-xs font-semibold uppercase tracking-wider text-[#1E1C1A]">
                  Search
                </label>
                <div className="relative flex items-center">
                  <input
                    id="shop-search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search journals..."
                    className="w-full bg-white border border-[#E0D7C6] rounded-lg py-2.5 pl-3.5 pr-9 text-xs text-[#1E1C1A] placeholder-[#8A8276] focus:outline-none focus:border-[#A64426] shadow-xs"
                  />
                  <Search className="w-3.5 h-3.5 text-[#8A8276] absolute right-3 pointer-events-none" />
                </div>
              </div>

              {/* 2. Categories Radio-Style List */}
              <div className="space-y-3 pt-3 border-t border-[#EAE3D5]">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1E1C1A]">
                  Categories
                </h3>
                <div className="space-y-2 font-sans text-xs">
                  {CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className="w-full flex items-center gap-2.5 group text-start py-0.5 cursor-pointer"
                      >
                        <span
                          className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? 'border-[#A64426] bg-white'
                              : 'border-[#9E9588] group-hover:border-[#A64426]'
                          }`}
                        >
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#A64426]" />}
                        </span>
                        <span
                          className={`transition-colors ${
                            isSelected
                              ? 'font-semibold text-[#A64426]'
                              : 'text-[#4A433A] group-hover:text-[#A64426]'
                          }`}
                        >
                          {cat}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Price Filter */}
              <div className="space-y-3 pt-3 border-t border-[#EAE3D5]">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1E1C1A]">
                  Price
                </h3>
                <div className="space-y-2 font-sans text-xs text-[#4A433A]">
                  {['Under $20', '$20 – $30', '$30 – $40'].map((priceLabel) => {
                    const checked = selectedPriceRanges.includes(priceLabel);
                    return (
                      <label key={priceLabel} className="flex items-center gap-2.5 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => togglePriceRange(priceLabel)}
                          className="w-3.5 h-3.5 rounded border-[#C4BBB0] text-[#A64426] focus:ring-0 cursor-pointer accent-[#A64426]"
                        />
                        <span className="group-hover:text-[#A64426] transition-colors">{priceLabel}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 4. Availability Filter */}
              <div className="space-y-3 pt-3 border-t border-[#EAE3D5]">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1E1C1A]">
                  Availability
                </h3>
                <div className="space-y-2 font-sans text-xs text-[#4A433A]">
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-[#C4BBB0] text-[#A64426] focus:ring-0 cursor-pointer accent-[#A64426]"
                    />
                    <span className="group-hover:text-[#A64426] transition-colors">In Stock (6)</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-not-allowed text-[#A8A196]">
                    <input
                      type="checkbox"
                      disabled
                      className="w-3.5 h-3.5 rounded border-[#D8D2C7] cursor-not-allowed"
                    />
                    <span>Out of Stock (0)</span>
                  </label>
                </div>
              </div>

            </aside>

            {/* ===================================================================
                RIGHT PRODUCTS GRID (col-span-9)
            =================================================================== */}
            <main className="lg:col-span-9 space-y-10">
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                  {filteredProducts.map((product) => {
                    const isAdded = !!addedIds[product.id];

                    return (
                      <div
                        key={product.id}
                        className="group flex flex-col justify-between bg-white rounded-xl border border-[#EDE7DC] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_24px_rgba(30,28,26,0.08)] hover:-translate-y-1 transition-all duration-300"
                      >
                        {/* Upper Product Clickable Content */}
                        <div>
                          {/* Book Flatlay Image Frame */}
                          <Link
                            href={`/shop/${product.slug}`}
                            className="relative block w-full aspect-[4/3] rounded-lg overflow-hidden bg-[#FAF6F0] mb-3.5 focus-visible:outline-none"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={product.imageUrl}
                              alt={product.title}
                              className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                              loading="lazy"
                            />
                          </Link>

                          {/* Category Tag */}
                          <p className="font-sans text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#7A7165] mb-1">
                            {product.category}
                          </p>

                          {/* Title */}
                          <h3 className="font-playfair text-lg sm:text-[19px] font-normal text-[#1E1C1A] leading-snug group-hover:text-[#A64426] transition-colors">
                            <Link href={`/shop/${product.slug}`}>
                              {product.title}
                            </Link>
                          </h3>

                          {/* Description */}
                          <p className="font-sans text-xs text-[#635B50] leading-relaxed line-clamp-2 mt-1.5 mb-3 font-normal">
                            {product.description}
                          </p>
                        </div>

                        {/* Bottom Row: Price, Stock & Actions */}
                        <div className="pt-3 border-t border-[#EFE9DF] space-y-3">
                          {/* Price & In Stock Indicator */}
                          <div className="flex items-center justify-between">
                            <span className="font-playfair text-lg font-semibold text-[#1E1C1A]">
                              {product.price}
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-sans text-[#2E6B38] font-medium">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#2E6B38] animate-pulse" />
                              <span>In Stock</span>
                            </span>
                          </div>

                          {/* Dual Action Buttons (Add to Cart + View Details) */}
                          <div className="grid grid-cols-2 gap-2 pt-0.5">
                            {/* Add to Cart Button */}
                            <button
                              type="button"
                              onClick={() => handleAddToCart(product)}
                              className={`w-full py-2 px-3 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 active:scale-[0.97] flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                                isAdded
                                  ? 'bg-[#3A4535] text-white'
                                  : 'bg-[#A64426] hover:bg-[#8E381E] text-white'
                              }`}
                            >
                              {isAdded ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Added</span>
                                </>
                              ) : (
                                <span>Add to Cart</span>
                              )}
                            </button>

                            {/* View Details Button */}
                            <Link
                              href={`/shop/${product.slug}`}
                              className="w-full py-2 px-3 rounded-lg text-xs font-medium text-[#1E1C1A] bg-transparent border border-[#DFD7C7] hover:bg-[#FAF6F0] hover:border-[#1E1C1A] transition-all duration-200 active:scale-[0.97] text-center flex items-center justify-center"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Empty Filter State */
                <div className="rounded-2xl bg-white border border-[#E0D7C6] p-12 text-center space-y-4">
                  <h3 className="font-playfair text-2xl text-[#1E1C1A]">No Journals Found</h3>
                  <p className="text-xs sm:text-sm text-[#6B6357] max-w-sm mx-auto">
                    We couldn&apos;t find any journals matching your search criteria. Try clearing your filters to see the full collection.
                  </p>
                  <button
                    onClick={resetAllFilters}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#A64426] text-white text-xs font-semibold tracking-wider uppercase hover:bg-[#8E381E] transition-all"
                  >
                    <span>Reset All Filters</span>
                  </button>
                </div>
              )}

              {/* Pagination Controls (Exact Master Figma Design) */}
              <div className="flex items-center justify-center gap-2 pt-8 border-t border-[#EDE6D8]">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                  className="w-8 h-8 rounded-md border border-[#E0D7C6] bg-white flex items-center justify-center text-[#786E63] hover:text-[#1E1C1A] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="text-sm">←</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage(1)}
                  className={`w-8 h-8 rounded-md text-xs font-semibold flex items-center justify-center transition-colors ${
                    currentPage === 1
                      ? 'bg-[#A64426] text-white shadow-xs'
                      : 'border border-[#E0D7C6] bg-white text-[#1E1C1A] hover:bg-[#FAF6F0]'
                  }`}
                >
                  1
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage(2)}
                  className={`w-8 h-8 rounded-md text-xs font-semibold flex items-center justify-center transition-colors ${
                    currentPage === 2
                      ? 'bg-[#A64426] text-white shadow-xs'
                      : 'border border-[#E0D7C6] bg-white text-[#1E1C1A] hover:bg-[#FAF6F0]'
                  }`}
                >
                  2
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(2, p + 1))}
                  disabled={currentPage === 2}
                  aria-label="Next page"
                  className="w-8 h-8 rounded-md border border-[#E0D7C6] bg-white flex items-center justify-center text-[#786E63] hover:text-[#1E1C1A] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="text-sm">→</span>
                </button>
              </div>

            </main>

          </div>
        </div>
      </section>

      {/* =========================================================================
          4. MID-PAGE IMPACT HORIZON BANNER ("More than journals. A movement.")
      ========================================================================= */}
      <section className="relative w-full bg-[#353D30] text-[#FAF6F0] overflow-hidden">
        <div className="w-full max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-14 py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-4 sm:space-y-5 text-start">
              <h2 className="font-playfair text-3xl sm:text-4xl lg:text-[2.85rem] font-normal leading-[1.15] tracking-tight">
                More than journals. <br />
                <span className="font-cormorant italic text-[#E8DCC8]">A movement.</span>
              </h2>

              <p className="font-sans text-xs sm:text-sm lg:text-[14px] text-[#D8CEBC] max-w-md leading-relaxed font-normal">
                Each purchase supports a bigger purpose. Join us in creating opportunities through Ayeyo Koris.
              </p>

              <div className="pt-2">
                <Link
                  href="/ayeyo-koris"
                  className="group inline-flex items-center gap-2.5 rounded-full border border-[#FAF6F0] text-[#FAF6F0] hover:bg-white hover:text-[#353D30] px-6 sm:px-7 py-3 text-xs sm:text-[13px] font-semibold tracking-wider uppercase transition-all duration-200 active:scale-[0.98]"
                >
                  <span>Learn About Ayeyo Koris</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Right Lifestyle Flatlay Image Column */}
            <div className="lg:col-span-6 flex justify-end">
              <div className="relative w-full max-w-[520px] aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/shop-impact-books.png"
                  alt="Stacked olive and gold journals on linen throw with coffee cup"
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
