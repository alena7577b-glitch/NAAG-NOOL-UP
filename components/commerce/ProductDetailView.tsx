'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  BookOpen,
  FileText,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  Search,
  Minus,
  Plus,
  Leaf,
  Sun,
  Sprout,
  ArrowRight,
  Check,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { ProductCard } from '@/components/commerce/ProductCard';
import { PreFooterBanner } from '@/components/layout/PreFooterBanner';
import { ProductDetailData, ProductCardData } from '@/lib/products';

export interface ProductDetailViewProps {
  product: ProductDetailData;
  relatedProducts: ProductCardData[];
}

export function ProductDetailView({ product, relatedProducts }: ProductDetailViewProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'who' | 'difference' | 'specs' | 'shipping'>('overview');
  const [isAdded, setIsAdded] = useState(false);

  const images =
    product.images.length > 0
      ? product.images
      : [
          {
            id: 'default-img',
            url: product.imageUrl || `/images/journal-${product.slug.replace('the-', '')}.png`,
            altText: product.title,
            sortOrder: 0,
          },
        ];

  const activeImage = images[selectedImageIndex] || images[0];

  const formattedPrice =
    typeof product.price === 'number'
      ? `$${product.price.toFixed(2)}`
      : product.price.startsWith('$')
      ? product.price
      : `$${product.price}`;

  const handleAddToCart = () => {
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 3000);
  };

  return (
    <div className="space-y-0 overflow-hidden">
      {/* 1. TOP PRODUCT SHOWCASE */}
      <section className="py-8 sm:py-12 bg-[#FAF8F5] border-b border-[#E5DFC0]/50">
        <Container size="default">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-[#6B655B] mb-8">
            <Link href="/" className="hover:text-[#B85233] transition-colors">
              Home
            </Link>
            <span>&gt;</span>
            <Link href="/shop" className="hover:text-[#B85233] transition-colors">
              Shop
            </Link>
            <span>&gt;</span>
            <span className="text-[#1E1C1A] font-medium">{product.title}</span>
          </div>

          {/* Gallery + Product Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Gallery Column (Thumbnails + Main Image) */}
            <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4 items-start">
              {/* 4 Thumbnails */}
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible w-full sm:w-20 shrink-0">
                {[0, 1, 2, 3].map((idx) => {
                  const img = images[idx] || images[0];
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx % images.length)}
                      className={`relative w-16 sm:w-20 aspect-square rounded-lg border overflow-hidden bg-white p-1 transition-all cursor-pointer ${
                        selectedImageIndex === idx % images.length
                          ? 'border-[#B85233] ring-1 ring-[#B85233]'
                          : 'border-[#E5DFC0] hover:border-[#B85233]/60'
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.url}
                        alt={img.altText || `${product.title} thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover rounded"
                      />
                    </button>
                  );
                })}
              </div>

              {/* Main Image with Zoom Icon */}
              <div className="relative flex-1 aspect-[4/5] sm:aspect-square lg:aspect-[4/5] w-full rounded-2xl bg-[#F4EFE6] border border-[#E5DFC0]/70 overflow-hidden shadow-sm p-4 sm:p-8 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeImage.url}
                  alt={activeImage.altText || product.title}
                  className="w-full h-full object-contain drop-shadow-lg"
                />
                <div className="absolute bottom-4 end-4 w-9 h-9 rounded-full bg-white/90 border border-[#E5DFC0] text-[#1E1C1A] flex items-center justify-center shadow-sm">
                  <Search className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Product Info Column */}
            <div className="lg:col-span-5 space-y-6">
              {/* Category & Title */}
              <div className="space-y-1.5">
                <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#B85233]">
                  {product.category || 'GUIDED JOURNAL'}
                </span>
                <h1 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1E1C1A]">
                  {product.title}
                </h1>
              </div>

              {/* Price & Reviews */}
              <div className="space-y-2">
                <span className="font-sans text-2xl sm:text-3xl font-medium text-[#1E1C1A]">
                  {formattedPrice}
                </span>
                <div className="flex items-center gap-2 text-xs text-[#D49B4B]">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#D49B4B] text-[#D49B4B]" />
                    ))}
                  </div>
                  <span className="text-[#6B655B] font-sans">(12 reviews)</span>
                </div>
              </div>

              {/* Description */}
              <p className="font-sans text-xs sm:text-sm text-[#6B655B] leading-relaxed">
                {product.description ||
                  'A guided journal to help you reconnect with your true self and rediscover your inner strength. Designed to give you space to reflect, heal, and move forward with intention.'}
              </p>

              {/* 4 Feature Badges in 4 Columns */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-y border-[#E5DFC0]/60 py-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#B85233] shrink-0" />
                  <span className="text-[11px] font-medium text-[#1E1C1A] leading-tight">Premium Hardcover</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#4D5844] shrink-0" />
                  <span className="text-[11px] font-medium text-[#1E1C1A] leading-tight">Guided Prompts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D49B4B] shrink-0" />
                  <span className="text-[11px] font-medium text-[#1E1C1A] leading-tight">Mindful Design</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#1E1C1A] shrink-0" />
                  <span className="text-[11px] font-medium text-[#1E1C1A] leading-tight">Perfect for Daily Use</span>
                </div>
              </div>

              {/* Quantity Stepper & Add to Cart */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-3">
                  {/* Stepper */}
                  <div className="flex items-center border border-[#E5DFC0] rounded-md bg-white px-2 py-1.5">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-1 text-[#6B655B] hover:text-[#1E1C1A]"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-semibold text-[#1E1C1A]">{quantity}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-1 text-[#6B655B] hover:text-[#1E1C1A]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={`flex-1 py-3 px-6 rounded-md text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
                      isAdded
                        ? 'bg-[#4D5844] text-white'
                        : 'bg-[#B85233] text-white hover:bg-[#A64426]'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Cart</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Buy Now Button */}
                <Link
                  href="/cart"
                  className="block w-full py-2.5 px-6 rounded-md bg-transparent border border-[#1E1C1A]/40 text-[#1E1C1A] text-xs sm:text-sm font-medium hover:bg-[#EAE5DC]/60 transition-colors text-center"
                >
                  Buy Now
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-[11px] text-[#6B655B]">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#4D5844]" />
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#4D5844]" />
                  <span>Secure payment</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-[#4D5844]" />
                  <span>30-day returns</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. TABS NAVIGATION */}
      <section className="bg-[#FAF8F5] border-b border-[#E5DFC0]/60">
        <Container size="default">
          <div className="flex items-center gap-8 overflow-x-auto scrollbar-none text-xs sm:text-sm font-medium text-[#6B655B]">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`py-4 border-b-2 cursor-pointer whitespace-nowrap transition-colors ${
                activeTab === 'overview'
                  ? 'border-[#B85233] text-[#1E1C1A] font-semibold'
                  : 'border-transparent hover:text-[#1E1C1A]'
              }`}
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('who')}
              className={`py-4 border-b-2 cursor-pointer whitespace-nowrap transition-colors ${
                activeTab === 'who'
                  ? 'border-[#B85233] text-[#1E1C1A] font-semibold'
                  : 'border-transparent hover:text-[#1E1C1A]'
              }`}
            >
              Who It&apos;s For
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('difference')}
              className={`py-4 border-b-2 cursor-pointer whitespace-nowrap transition-colors ${
                activeTab === 'difference'
                  ? 'border-[#B85233] text-[#1E1C1A] font-semibold'
                  : 'border-transparent hover:text-[#1E1C1A]'
              }`}
            >
              What Makes It Different
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('specs')}
              className={`py-4 border-b-2 cursor-pointer whitespace-nowrap transition-colors ${
                activeTab === 'specs'
                  ? 'border-[#B85233] text-[#1E1C1A] font-semibold'
                  : 'border-transparent hover:text-[#1E1C1A]'
              }`}
            >
              Specifications
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('shipping')}
              className={`py-4 border-b-2 cursor-pointer whitespace-nowrap transition-colors ${
                activeTab === 'shipping'
                  ? 'border-[#B85233] text-[#1E1C1A] font-semibold'
                  : 'border-transparent hover:text-[#1E1C1A]'
              }`}
            >
              Shipping
            </button>
          </div>
        </Container>
      </section>

      {/* 3. TAB CONTENT ("A space for your thoughts, your healing, your growth.") */}
      <section className="py-16 sm:py-24 bg-[#FAF8F5] border-b border-[#E5DFC0]/50">
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Editorial Photo */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-md border border-[#E5DFC0]/60 bg-[#FAF8F5]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/product-editorial-woman.png"
                  alt="Holding journal"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right Editorial Story */}
            <div className="lg:col-span-6 space-y-5">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#B85233]">
                MORE THAN A JOURNAL
              </p>
              <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1E1C1A] leading-[1.15]">
                A space for your thoughts, your healing, your growth.
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#6B655B] leading-relaxed">
                {product.title} is designed to help you slow down, tune in, and reconnect with what matters most. With gentle prompts and intentional space, it guides you toward greater self-awareness, emotional balance, and clarity in your next chapter.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <div className="w-10 h-[1px] bg-[#1E1C1A]" />
                <p className="font-cormorant italic text-2xl text-[#1E1C1A]">
                  Write your next chapter.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. FOUR BENEFIT PILLARS */}
      <section className="py-16 sm:py-20 bg-[#F9F6F0] border-b border-[#E5DFC0]/50">
        <Container size="default">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x divide-[#E5DFC0]">
            <div className="space-y-3 lg:px-6 first:ps-0 text-center sm:text-start">
              <div className="w-10 h-10 rounded-full bg-white border border-[#E5DFC0] text-[#4D5844] flex items-center justify-center mx-auto sm:mx-0">
                <Leaf className="w-4 h-4" />
              </div>
              <h3 className="font-playfair text-lg text-[#1E1C1A]">Build Self-Awareness</h3>
              <p className="font-sans text-xs text-[#6B655B] leading-relaxed">
                Gain clarity about your thoughts, feelings, and goals.
              </p>
            </div>

            <div className="space-y-3 lg:px-6 text-center sm:text-start">
              <div className="w-10 h-10 rounded-full bg-white border border-[#E5DFC0] text-[#D49B4B] flex items-center justify-center mx-auto sm:mx-0">
                <Sun className="w-4 h-4" />
              </div>
              <h3 className="font-playfair text-lg text-[#1E1C1A]">Heal and Let Go</h3>
              <p className="font-sans text-xs text-[#6B655B] leading-relaxed">
                Release what no longer serves you and make space for what does.
              </p>
            </div>

            <div className="space-y-3 lg:px-6 text-center sm:text-start">
              <div className="w-10 h-10 rounded-full bg-white border border-[#E5DFC0] text-[#B85233] flex items-center justify-center mx-auto sm:mx-0">
                <Sprout className="w-4 h-4" />
              </div>
              <h3 className="font-playfair text-lg text-[#1E1C1A]">Set Intentions</h3>
              <p className="font-sans text-xs text-[#6B655B] leading-relaxed">
                Create a vision for the life you want to live.
              </p>
            </div>

            <div className="space-y-3 lg:px-6 last:pe-0 text-center sm:text-start">
              <div className="w-10 h-10 rounded-full bg-white border border-[#E5DFC0] text-[#1E1C1A] flex items-center justify-center mx-auto sm:mx-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="font-playfair text-lg text-[#1E1C1A]">Grow with Purpose</h3>
              <p className="font-sans text-xs text-[#6B655B] leading-relaxed">
                Turn your dreams into meaningful action.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. YOU MIGHT ALSO LIKE (RELATED JOURNALS) */}
      <section className="py-16 sm:py-24 bg-[#FAF8F5] border-b border-[#E5DFC0]/50">
        <Container size="default">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-playfair text-2xl sm:text-3xl font-normal text-[#1E1C1A]">
              You might also like
            </h2>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1 text-xs font-medium text-[#B85233] hover:underline"
            >
              <span>View all journals</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
            {relatedProducts.slice(0, 6).map((item) => (
              <ProductCard key={item.id} product={item} showDetailsButton={false} />
            ))}
          </div>
        </Container>
      </section>

      {/* 6. PRE-FOOTER BANNER */}
      <PreFooterBanner
        eyebrow="JOIN OUR COMMUNITY"
        headline="Your life is yours to live."
        buttonText="Explore Naag Nool UP →"
        buttonHref="/about"
      />
    </div>
  );
}
