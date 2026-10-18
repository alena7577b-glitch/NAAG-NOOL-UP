'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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

export const SHOP_PRODUCTS: ShopProduct[] = [];

const DEFAULT_CATEGORIES = [
  'All Products',
  'Journals',
  'Notebooks',
  'Mugs',
  'Bags',
];

const PRICE_RANGES = ['$5 (Notebooks & Mugs)', '$7 (Bags)', '$10 (Journals)'];

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'alpha-asc' | 'newest';

export function ShopCatalogView({
  initialProducts,
  initialCategories,
}: ShopCatalogViewProps = {}) {
  const optionalCart = useOptionalCart();
  const rawProducts = useMemo(() => initialProducts ?? [], [initialProducts]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Products');
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Dynamic Category Resolution
  const categoriesList = useMemo(() => {
    const incoming =
      initialCategories && initialCategories.length > 0
        ? initialCategories.map((c) => (c === 'All' || c === 'All Journals' ? 'All Products' : c))
        : DEFAULT_CATEGORIES;
    const distinctFromProducts = Array.from(
      new Set(rawProducts.map((p) => p.category).filter(Boolean))
    );
    return Array.from(new Set([...incoming, ...distinctFromProducts]));
  }, [initialCategories, rawProducts]);

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
      if (
        selectedCategory !== 'All Products' &&
        selectedCategory !== 'All' &&
        product.category.toLowerCase() !== selectedCategory.toLowerCase()
      ) {
        return false;
      }

      // 3. Price Filter
      if (selectedPriceRanges.length > 0) {
        const matchesPrice = selectedPriceRanges.some((range) => {
          if (range.includes('$5')) return product.priceNumber === 5;
          if (range.includes('$7')) return product.priceNumber === 7;
          if (range.includes('$10')) return product.priceNumber === 10;
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
      return 0; // 'featured' keeps curated order
    });
  }, [rawProducts, searchQuery, selectedCategory, selectedPriceRanges, inStockOnly, sortBy]);

  const ITEMS_PER_PAGE = 9;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedProducts = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, safeCurrentPage]);

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

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  const handleInStockChange = (val: boolean) => {
    setInStockOnly(val);
    setCurrentPage(1);
  };

  const togglePriceRange = (range: string) => {
    setCurrentPage(1);
    setSelectedPriceRanges((prev) =>
      prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range]
    );
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All Products');
    setSelectedPriceRanges([]);
    setInStockOnly(true);
    setSortBy('featured');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    (selectedCategory !== 'All Products' && selectedCategory !== 'All') ||
    selectedPriceRanges.length > 0 ||
    !inStockOnly;

  return (
    <div className="w-full bg-[#FAF6F0] text-[#1E1C1A]">

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
              <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.22em] text-[#A64426]">
                The time to be ALIVE is now!
              </span>
              <h2 className="font-playfair text-3xl sm:text-4xl font-normal text-[#1E1C1A] tracking-tight mt-1">
                The Guided Journals & Rituals Collection
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#6E6559] mt-1">
                Providing every woman and girl a room to let her strength show &mdash; <span className="font-cormorant italic text-[#A64426] text-base">HER WAY!</span>
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
                    onChange={(e) => handleSortChange(e.target.value as SortOption)}
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
              {selectedCategory !== 'All Products' && selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1.5 bg-white border border-[#E0D7C6] text-[#1E1C1A] text-[11px] px-2.5 py-1 rounded-full shadow-xs">
                  Category: {selectedCategory}
                  <button onClick={() => handleCategorySelect('All Products')} className="hover:text-[#A64426]">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 bg-white border border-[#E0D7C6] text-[#1E1C1A] text-[11px] px-2.5 py-1 rounded-full shadow-xs">
                  Search: &ldquo;{searchQuery}&rdquo;
                  <button onClick={() => handleSearchChange('')} className="hover:text-[#A64426]">
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
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Search merchandise, journals, apparel..."
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
                  {categoriesList.map((cat) => {
                    const isSelected = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => handleCategorySelect(cat)}
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
                  {PRICE_RANGES.map((priceLabel) => {
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
                      onChange={(e) => handleInStockChange(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-[#C4BBB0] text-[#A64426] focus:ring-0 cursor-pointer accent-[#A64426]"
                    />
                    <span className="group-hover:text-[#A64426] transition-colors">
                      In Stock ({rawProducts.filter((p) => p.inStock).length})
                    </span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-not-allowed text-[#A8A196]">
                    <input
                      type="checkbox"
                      disabled
                      className="w-3.5 h-3.5 rounded border-[#D8D2C7] cursor-not-allowed"
                    />
                    <span>Out of Stock ({rawProducts.filter((p) => !p.inStock).length})</span>
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
                  {paginatedProducts.map((product) => {
                    const isAdded = !!addedIds[product.id];

                    return (
                      <div
                        key={product.id}
                        className="group flex flex-col justify-between bg-white rounded-xl border border-[#EDE7DC] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_24px_rgba(30,28,26,0.08)] hover:-translate-y-1 transition-all duration-300"
                      >
                        {/* Upper Product Clickable Content */}
                        <div>
                          {/* Book Image Frame — object-contain to show the full book */}
                          <Link
                            href={`/product/${product.slug}`}
                            className="relative block w-full aspect-[4/3] rounded-lg overflow-hidden bg-[#FAF6F0] mb-3.5 focus-visible:outline-none"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={product.imageUrl}
                              alt={product.title}
                              className="w-full h-full object-contain object-center p-3 transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                              loading="lazy"
                            />
                          </Link>

                          {/* Category Tag & Editions */}
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <p className="font-sans text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#7A7165]">
                              {product.category}
                            </p>
                            {product.category?.toLowerCase().includes('journal') && (
                              <span className="text-[10px] font-semibold text-[#2E6B38] bg-[#EDF3EC] px-2 py-0.5 rounded-full border border-[#D0E8D4]">
                                EN & SO Editions
                              </span>
                            )}
                          </div>

                          {/* Title */}
                          <h3 className="font-playfair text-lg sm:text-[19px] font-normal text-[#1E1C1A] leading-snug group-hover:text-[#A64426] transition-colors">
                            <Link href={`/product/${product.slug}`}>
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
                              href={`/product/${product.slug}`}
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
                  <h3 className="font-playfair text-2xl text-[#1E1C1A]">No Products Available</h3>
                  <p className="text-xs sm:text-sm text-[#6B6357] max-w-sm mx-auto">
                    Our boutique collection is currently being refreshed. Join our community below to be notified as soon as new releases are available!
                  </p>
                  <Link
                    href="/community"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#A64426] text-white text-xs font-semibold tracking-wider uppercase hover:bg-[#8E381E] transition-all cursor-pointer"
                  >
                    <span>Join Community</span>
                  </Link>
                </div>
              )}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-8 border-t border-[#EDE6D8]">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={safeCurrentPage === 1}
                    aria-label="Previous page"
                    className="w-8 h-8 rounded-md border border-[#E0D7C6] bg-white flex items-center justify-center text-[#786E63] hover:text-[#1E1C1A] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <span className="text-sm">←</span>
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-md text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer ${
                        safeCurrentPage === pageNum
                          ? 'bg-[#A64426] text-white shadow-xs'
                          : 'border border-[#E0D7C6] bg-white text-[#1E1C1A] hover:bg-[#FAF6F0]'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safeCurrentPage === totalPages}
                    aria-label="Next page"
                    className="w-8 h-8 rounded-md border border-[#E0D7C6] bg-white flex items-center justify-center text-[#786E63] hover:text-[#1E1C1A] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <span className="text-sm">→</span>
                  </button>
                </div>
              )}

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
                More than a store. <br />
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
                <Image
                  src="/images/shop-impact-books.png"
                  alt="Naag Nool UP journals and merchandise collection"
                  fill
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  sizes="(max-width: 1024px) 100vw, 520px"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
