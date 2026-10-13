'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  BookOpen,
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
  Coffee,
  Package,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { ProductCard } from '@/components/commerce/ProductCard';
import { useCurrency } from '@/lib/currency/context';
import { PreFooterBanner } from '@/components/layout/PreFooterBanner';
import { ProductDetailData, ProductCardData } from '@/lib/products';
import { useRouter } from 'next/navigation';
import { useOptionalCart } from '@/lib/cart/CartContext';

export interface ProductDetailViewProps {
  product: ProductDetailData;
  relatedProducts: ProductCardData[];
}

// Color palette dictionary mapping human color names to visual hex / background codes
const COLOR_MAP: Record<string, string> = {
  terracotta: '#B85233',
  'warm ivory': '#FAF5EE',
  ivory: '#FAF5EE',
  cream: '#F4ECE1',
  'desert sand': '#D49B4B',
  sand: '#D49B4B',
  'midnight slate': '#2B2724',
  midnight: '#1E1C1A',
  charcoal: '#2D2926',
  'sage green': '#4D5844',
  sage: '#4D5844',
  'rose clay': '#C27A6B',
  clay: '#B86851',
  'onyx black': '#181615',
  black: '#1E1C1A',
  white: '#FFFFFF',
  gold: '#D4AF37',
  linen: '#EBE5D8',
};

function getColorHex(colorName: string): string {
  const normalized = colorName.toLowerCase().trim();
  if (COLOR_MAP[normalized]) return COLOR_MAP[normalized];
  for (const [key, hex] of Object.entries(COLOR_MAP)) {
    if (normalized.includes(key)) return hex;
  }
  return '#B85233'; // Default brand terracotta
}

export function ProductDetailView({ product, relatedProducts }: ProductDetailViewProps) {
  const router = useRouter();
  const optionalCart = useOptionalCart();
  const { formatPrice } = useCurrency();

  // Image Gallery State
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'specs' | 'shipping'>('overview');
  const [isAdded, setIsAdded] = useState(false);

  const categoryLower = (product.category || '').toLowerCase();
  const isJournal =
    categoryLower.includes('journal') ||
    product.metadata?.isJournal === true ||
    product.metadata?.hasDualEditions === true;

  // Language / Edition State for Journals
  const [selectedEdition, setSelectedEdition] = useState<'English' | 'Somali'>('English');

  const englishTitle = (product.metadata?.englishTitle as string) || product.title;
  const somaliTitle =
    (product.metadata?.somaliTitle as string) ||
    (product.title.includes('/') ? product.title.split('/')[1]?.trim() : `Buugga ${product.title}`);

  const englishSubtitle =
    (product.metadata?.englishSubtitle as string) || (product.metadata?.tagline as string) || '';
  const somaliSubtitle =
    (product.metadata?.somaliSubtitle as string) || (product.metadata?.tagline as string) || '';

  const englishImage = (product.metadata?.englishImage as string) || product.imageUrl;
  const somaliImage = (product.metadata?.somaliImage as string) || product.imageUrl;

  const displayedTitle = isJournal
    ? selectedEdition === 'Somali'
      ? somaliTitle
      : englishTitle
    : product.title;

  const displayedSubtitle = isJournal
    ? selectedEdition === 'Somali'
      ? somaliSubtitle
      : englishSubtitle
    : (product.metadata?.tagline as string) || '';

  // Derive Color Options
  const metaColors: string[] = Array.isArray(product.metadata?.colors)
    ? product.metadata.colors
    : [];

  const defaultCategoryColors = categoryLower.includes('mug')
    ? ['Obsidian Black', 'Warm White']
    : categoryLower.includes('bag')
    ? ['Natural Canvas', 'Terracotta']
    : [];

  const availableColors = metaColors.length > 0 ? metaColors : defaultCategoryColors;
  const [selectedColor, setSelectedColor] = useState<string>(availableColors[0] || 'Default');

  // Handle color change for mugs / items with colorImages
  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    if (product.metadata?.colorImages && product.metadata.colorImages[color]) {
      const targetImg = product.metadata.colorImages[color];
      const idx = images.findIndex((img) => img.url === targetImg);
      if (idx > -1) setSelectedImageIndex(idx);
    }
  };

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [
          {
            id: 'default-img',
            url: product.imageUrl || '/images/logo-header.png',
            altText: product.title,
            sortOrder: 0,
          },
        ];

  // If user selected Somali edition, prioritize the Somali cover; if English, prioritize English cover
  const activeImageUrl = isJournal
    ? selectedEdition === 'Somali'
      ? somaliImage
      : englishImage
    : images[selectedImageIndex]?.url || product.imageUrl;

  const activeImage = images[selectedImageIndex] || {
    id: 'current-img',
    url: activeImageUrl,
    altText: displayedTitle,
    sortOrder: 0,
  };

  const formattedPrice = formatPrice(product.price);

  const material =
    (product.metadata?.material as string) ||
    (categoryLower.includes('mug')
      ? 'Artisanal Ceramic Stoneware (12 oz / 350 ml)'
      : categoryLower.includes('bag')
      ? '100% Heavyweight Organic Cotton Canvas'
      : 'Cloth Hardcover with Gold Foil Embellishment');

  const dimensions =
    (product.metadata?.dimensions as string) ||
    (categoryLower.includes('mug')
      ? '12 oz (350 ml) Capacity'
      : categoryLower.includes('bag')
      ? '15" W x 16" H with 11" Shoulder Drop'
      : '6" x 8.5" (220 archival pages with ribbon bookmark)');

  const handleEditionChange = (edition: 'English' | 'Somali') => {
    setSelectedEdition(edition);
    const targetUrl = edition === 'Somali' ? somaliImage : englishImage;
    const foundIdx = images.findIndex((img) => img.url === targetUrl);
    if (foundIdx > -1) {
      setSelectedImageIndex(foundIdx);
    }
  };

  const handleAddToCart = () => {
    const numericPrice =
      typeof product.price === 'number'
        ? product.price
        : parseFloat(String(product.price).replace(/[^0-9.]/g, '')) || 24;

    const cartImageUrl = isJournal
      ? selectedEdition === 'Somali'
        ? somaliImage
        : englishImage
      : activeImageUrl;

    optionalCart?.addItem(
      {
        id: isJournal ? `${product.id}-${selectedEdition.toLowerCase()}` : product.id,
        title: isJournal ? (selectedEdition === 'Somali' ? somaliTitle : englishTitle) : product.title,
        slug: product.slug,
        price: numericPrice,
        imageUrl: cartImageUrl,
        category: product.category,
        color: !isJournal && availableColors.length > 0 ? selectedColor : undefined,
        edition: isJournal
          ? selectedEdition === 'Somali'
            ? 'Somali (Af-Soomaali)'
            : 'English Edition'
          : undefined,
      },
      quantity
    );
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 3000);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    handleAddToCart();
    router.push('/checkout');
  };

  return (
    <div className="space-y-0 overflow-hidden bg-[#FAF8F5]">
      {/* 1. TOP PRODUCT SHOWCASE */}
      <section className="py-8 sm:py-12 bg-[#FAF8F5] border-b border-[#E5DFC0]/50">
        <Container size="default">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#6B655B] mb-8">
            <Link href="/" className="hover:text-[#B85233] transition-colors">
              Home
            </Link>
            <span className="text-[#B4ABA0]">&gt;</span>
            <Link href="/shop" className="hover:text-[#B85233] transition-colors">
              Shop
            </Link>
            <span className="text-[#B4ABA0]">&gt;</span>
            <span className="text-[#8A8276] uppercase tracking-wider text-[11px] font-medium">
              {product.category || 'Collection'}
            </span>
            <span className="text-[#B4ABA0]">&gt;</span>
            <span className="text-[#1E1C1A] font-semibold truncate max-w-[200px] sm:max-w-none">
              {product.title}
            </span>
          </nav>

          {/* Gallery + Product Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Gallery Column (Thumbnails + Main Image) */}
            <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4 items-start">
              {/* Thumbnails (renders if multiple images exist) */}
              {images.length > 1 && (
                <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible w-full sm:w-20 shrink-0 pb-2 sm:pb-0">
                  {images.map((img, idx) => (
                    <button
                      key={img.id || idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-16 sm:w-20 aspect-square rounded-xl border overflow-hidden bg-white p-1.5 transition-all cursor-pointer ${
                        selectedImageIndex === idx
                          ? 'border-[#B85233] ring-2 ring-[#B85233]/30 shadow-xs'
                          : 'border-[#E5DFC0] hover:border-[#B85233]/60 bg-[#FAF7F2]'
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.url}
                        alt={img.altText || `${product.title} image ${idx + 1}`}
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Image with Luxury Presentation */}
              <div className="relative flex-1 aspect-[4/5] sm:aspect-square lg:aspect-[4/5] w-full rounded-2xl bg-[#F4EFE6] border border-[#E5DFC0]/70 overflow-hidden shadow-sm p-4 sm:p-10 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={isJournal ? (selectedEdition === 'Somali' ? somaliImage : englishImage) : activeImage.url}
                  alt={displayedTitle}
                  className="w-full h-full object-contain drop-shadow-xl transition-transform duration-300 hover:scale-[1.03]"
                />
                <div className="absolute bottom-4 end-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs border border-[#E5DFC0] text-[#1E1C1A] flex items-center justify-center shadow-xs">
                  <Search className="w-4 h-4 text-stone-600" />
                </div>
              </div>
            </div>

            {/* Product Info Column */}
            <div className="lg:col-span-5 space-y-6">
              {/* Category Eyebrow & Title */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-block px-3 py-1 rounded-full text-[10.5px] font-semibold uppercase tracking-[0.2em] bg-[#F4EFE6] text-[#B85233] border border-[#E5DFC0]">
                    {product.category || 'BOUTIQUE'}
                  </span>
                  {isJournal && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#EDF3EC] text-[#2E6B38] border border-[#D0E8D4]">
                      <Check className="w-3 h-3 text-[#2E6B38]" />
                      <span>English & Somali Editions Available</span>
                    </span>
                  )}
                </div>
                <h1 className="font-playfair text-3xl sm:text-4xl lg:text-[2.75rem] font-normal text-[#1E1C1A] leading-tight">
                  {displayedTitle}
                </h1>
                {displayedSubtitle && (
                  <p className="font-cormorant italic text-lg sm:text-xl text-[#B85233] leading-snug">
                    "{displayedSubtitle}"
                  </p>
                )}
              </div>

              {/* Price & Stock Indicator */}
              <div className="flex items-baseline justify-between pt-1 border-b border-[#E5DFC0]/60 pb-4">
                <div className="space-y-1">
                  <span className="font-playfair text-3xl font-semibold text-[#1E1C1A]">
                    {formattedPrice}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-[#D49B4B]">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#D49B4B] text-[#D49B4B]" />
                      ))}
                    </div>
                    <span className="text-[#6B655B] font-sans ml-1">(Authentic Client Favorite)</span>
                  </div>
                </div>

                <div className="text-end">
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#2E6B38] font-medium bg-[#E8F4EA] px-2.5 py-1 rounded-full border border-[#D0E8D4]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#2E6B38] animate-pulse" />
                    <span>In Stock & Ready to Ship</span>
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="font-sans text-xs sm:text-sm text-[#5C554B] leading-relaxed">
                {product.description ||
                  'Crafted with intentionality, purpose, and reverence for timeless heritage. Designed to inspire your daily rhythm, personal reflection, and grounded power.'}
              </p>

              {/* -------------------------------------------------------------
                  LANGUAGE / EDITION SELECTOR (For All Journals)
              ------------------------------------------------------------- */}
              {isJournal && (
                <div className="space-y-3 pt-2 pb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#1E1C1A]">
                      Select Language Edition:{' '}
                      <span className="font-semibold text-[#B85233]">
                        {selectedEdition === 'Somali' ? 'Somali (Af-Soomaali)' : 'English Edition'}
                      </span>
                    </span>
                    <span className="text-[11px] text-[#8A8276]">2 Editions</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* English Edition Option */}
                    <button
                      type="button"
                      onClick={() => handleEditionChange('English')}
                      className={`group relative flex flex-col p-3.5 rounded-2xl text-left transition-all border cursor-pointer ${
                        selectedEdition === 'English'
                          ? 'border-[#B85233] bg-[#FAF3EC] ring-2 ring-[#B85233]/25 shadow-xs'
                          : 'border-[#E5DFC0] bg-white hover:border-[#B85233]/50 hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#1E1C1A]">
                          English Edition
                        </span>
                        {selectedEdition === 'English' && (
                          <span className="w-4 h-4 rounded-full bg-[#B85233] text-white flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-playfair font-medium text-[#1E1C1A] truncate w-full">
                        {englishTitle}
                      </p>
                      {englishSubtitle && (
                        <p className="text-[10.5px] text-[#7A7165] line-clamp-1 italic mt-0.5">
                          "{englishSubtitle}"
                        </p>
                      )}
                    </button>

                    {/* Somali Edition Option */}
                    <button
                      type="button"
                      onClick={() => handleEditionChange('Somali')}
                      className={`group relative flex flex-col p-3.5 rounded-2xl text-left transition-all border cursor-pointer ${
                        selectedEdition === 'Somali'
                          ? 'border-[#B85233] bg-[#FAF3EC] ring-2 ring-[#B85233]/25 shadow-xs'
                          : 'border-[#E5DFC0] bg-white hover:border-[#B85233]/50 hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#1E1C1A]">
                          Af-Soomaali
                        </span>
                        {selectedEdition === 'Somali' && (
                          <span className="w-4 h-4 rounded-full bg-[#B85233] text-white flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-playfair font-medium text-[#1E1C1A] truncate w-full">
                        {somaliTitle}
                      </p>
                      {somaliSubtitle && (
                        <p className="text-[10.5px] text-[#7A7165] line-clamp-1 italic mt-0.5">
                          "{somaliSubtitle}"
                        </p>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* -------------------------------------------------------------
                  COLOR SELECTOR SECTION (For Non-Journal products like Mugs & Bags)
              ------------------------------------------------------------- */}
              {!isJournal && availableColors.length > 0 && (
                <div className="space-y-3 pt-2 pb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#1E1C1A]">
                      Color: <span className="font-normal text-[#B85233]">{selectedColor}</span>
                    </span>
                    <span className="text-[11px] text-[#8A8276]">
                      {availableColors.length} {availableColors.length === 1 ? 'Option' : 'Options'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    {availableColors.map((color) => {
                      const isSelected = selectedColor.toLowerCase() === color.toLowerCase();
                      const hexColor = getColorHex(color);

                      return (
                        <button
                          key={color}
                          type="button"
                          onClick={() => handleColorChange(color)}
                          className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                            isSelected
                              ? 'border-[#B85233] bg-[#FAF3EC] text-[#1E1C1A] shadow-xs ring-1 ring-[#B85233]'
                              : 'border-[#E5DFC0] bg-white text-[#5C554B] hover:border-[#B85233]/60 hover:bg-[#FAF7F2]'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0 shadow-2xs"
                            style={{ backgroundColor: hexColor }}
                          />
                          <span>{color}</span>
                          {isSelected && <Check className="w-3 h-3 text-[#B85233]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Adaptive Feature Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-y border-[#E5DFC0]/60 py-4">
                {categoryLower.includes('mug') ? (
                  <>
                    <div className="flex items-center gap-2">
                      <Coffee className="w-4 h-4 text-[#B85233] shrink-0" />
                      <span className="text-[11px] font-medium text-[#1E1C1A] leading-tight">Ceramic Stoneware</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#4D5844] shrink-0" />
                      <span className="text-[11px] font-medium text-[#1E1C1A] leading-tight">Hand-Finished</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#D49B4B] shrink-0" />
                      <span className="text-[11px] font-medium text-[#1E1C1A] leading-tight">Dishwasher Safe</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-[#1E1C1A] shrink-0" />
                      <span className="text-[11px] font-medium text-[#1E1C1A] leading-tight">Gift Boxed</span>
                    </div>
                  </>
                ) : categoryLower.includes('bag') ? (
                  <>
                    <div className="flex items-center gap-2">
                      <Leaf className="w-4 h-4 text-[#4D5844] shrink-0" />
                      <span className="text-[11px] font-medium text-[#1E1C1A] leading-tight">Organic Cotton</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#B85233] shrink-0" />
                      <span className="text-[11px] font-medium text-[#1E1C1A] leading-tight">Reinforced Seams</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#D49B4B] shrink-0" />
                      <span className="text-[11px] font-medium text-[#1E1C1A] leading-tight">Heritage Print</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-[#1E1C1A] shrink-0" />
                      <span className="text-[11px] font-medium text-[#1E1C1A] leading-tight">Heavy Duty</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#B85233] shrink-0" />
                      <span className="text-[11px] font-medium text-[#1E1C1A] leading-tight">Cloth Hardcover</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#4D5844] shrink-0" />
                      <span className="text-[11px] font-medium text-[#1E1C1A] leading-tight">Gold Foil Detailing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Leaf className="w-4 h-4 text-[#D49B4B] shrink-0" />
                      <span className="text-[11px] font-medium text-[#1E1C1A] leading-tight">Acid-Free Paper</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#1E1C1A] shrink-0" />
                      <span className="text-[11px] font-medium text-[#1E1C1A] leading-tight">Lay-Flat Binding</span>
                    </div>
                  </>
                )}
              </div>

              {/* Quantity Stepper & Add to Cart */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  {/* Stepper */}
                  <div className="flex items-center border border-[#E5DFC0] rounded-xl bg-white px-2 py-2 shadow-2xs">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-1 text-[#6B655B] hover:text-[#1E1C1A] cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-semibold text-[#1E1C1A]">{quantity}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-1 text-[#6B655B] hover:text-[#1E1C1A] cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={`flex-1 py-3.5 px-6 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-[0.98] ${
                      isAdded
                        ? 'bg-[#3A4535] text-white'
                        : 'bg-[#B85233] text-white hover:bg-[#A64426]'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Cart ({selectedColor})</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Cart — {formattedPrice}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Buy Now Button */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="block w-full py-3 px-6 rounded-xl bg-transparent border border-[#1E1C1A]/40 text-[#1E1C1A] text-xs sm:text-sm font-semibold hover:bg-[#EAE5DC]/60 transition-colors text-center cursor-pointer active:scale-[0.98]"
                >
                  Buy Now & Checkout Instantly
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-[11px] text-[#6B655B]">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#4D5844]" />
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#4D5844]" />
                  <span>Secure SoomarPay & Card checkout</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-[#4D5844]" />
                  <span>30-day effortless returns</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. TABS NAVIGATION */}
      <section className="bg-[#FAF8F5] border-b border-[#E5DFC0]/60 sticky top-20 z-20 backdrop-blur-md">
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
              Overview & Philosophy
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('details')}
              className={`py-4 border-b-2 cursor-pointer whitespace-nowrap transition-colors ${
                activeTab === 'details'
                  ? 'border-[#B85233] text-[#1E1C1A] font-semibold'
                  : 'border-transparent hover:text-[#1E1C1A]'
              }`}
            >
              Product Details & Materials
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
              Specifications & Care
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
              Shipping & Returns
            </button>
          </div>
        </Container>
      </section>

      {/* 3. DYNAMIC TAB CONTENT */}
      <section className="py-14 sm:py-20 bg-[#FAF8F5] border-b border-[#E5DFC0]/50">
        <Container size="default">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center animate-in fade-in duration-200">
              <div className="lg:col-span-6 space-y-5">
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#B85233]">
                  NAAG NOOL UP BOUTIQUE
                </p>
                <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1E1C1A] leading-[1.15]">
                  Designed for intentional living and unapologetic agency.
                </h2>
                <p className="font-sans text-xs sm:text-sm text-[#6B655B] leading-relaxed">
                  {product.description ||
                    `${product.title} is created to bring purposeful empowerment into your everyday rituals. Crafted with high attention to tactile quality, aesthetic beauty, and Somali heritage.`}
                </p>
                <div className="pt-2 flex items-center gap-3">
                  <div className="w-10 h-[1px] bg-[#1E1C1A]" />
                  <p className="font-cormorant italic text-2xl text-[#1E1C1A]">
                    The time to be alive is now.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-6 bg-[#F4EFE6] rounded-2xl p-6 sm:p-8 border border-[#E5DFC0]/70 space-y-4">
                <h3 className="font-playfair text-xl text-[#1E1C1A]">Why You Will Love It</h3>
                <ul className="space-y-3 text-xs text-[#5C554B]">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#B85233] shrink-0 mt-0.5" />
                    <span>Thoughtfully curated palette inspired by Somali dawn, terracotta earth, and desert stones.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#B85233] shrink-0 mt-0.5" />
                    <span>Selected materials crafted to last through years of daily rituals and mindful habits.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#B85233] shrink-0 mt-0.5" />
                    <span>Part of a global movement empowering women to reconnect with their innate self-worth.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="max-w-3xl space-y-6 animate-in fade-in duration-200">
              <h2 className="font-playfair text-2xl sm:text-3xl text-[#1E1C1A]">
                Product Details & Composition
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-white border border-[#E5DFC0] space-y-1">
                  <span className="text-[#8A8276] uppercase tracking-wider text-[10.5px] font-semibold">Category</span>
                  <p className="text-sm font-medium text-[#1E1C1A]">{product.category}</p>
                </div>
                <div className="p-4 rounded-xl bg-white border border-[#E5DFC0] space-y-1">
                  <span className="text-[#8A8276] uppercase tracking-wider text-[10.5px] font-semibold">Material / Finish</span>
                  <p className="text-sm font-medium text-[#1E1C1A]">{material}</p>
                </div>
                <div className="p-4 rounded-xl bg-white border border-[#E5DFC0] space-y-1">
                  <span className="text-[#8A8276] uppercase tracking-wider text-[10.5px] font-semibold">Dimensions / Sizing</span>
                  <p className="text-sm font-medium text-[#1E1C1A]">{dimensions}</p>
                </div>
                <div className="p-4 rounded-xl bg-white border border-[#E5DFC0] space-y-1">
                  <span className="text-[#8A8276] uppercase tracking-wider text-[10.5px] font-semibold">Available Colors</span>
                  <p className="text-sm font-medium text-[#1E1C1A]">{availableColors.join(', ')}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="max-w-3xl space-y-6 animate-in fade-in duration-200">
              <h2 className="font-playfair text-2xl sm:text-3xl text-[#1E1C1A]">
                Specifications & Care Instructions
              </h2>
              <div className="bg-white rounded-2xl border border-[#E5DFC0] p-6 space-y-4 text-xs text-[#5C554B]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                  <div>
                    <span className="font-semibold text-[#1E1C1A] block">Stock Status:</span>
                    <span>{product.stockQuantity} units available</span>
                  </div>
                  <div>
                    <span className="font-semibold text-[#1E1C1A] block">Origin:</span>
                    <span>Ethically manufactured for Naag Nool UP</span>
                  </div>
                  <div>
                    <span className="font-semibold text-[#1E1C1A] block">Care Guide:</span>
                    <span>
                      {categoryLower.includes('mug')
                        ? 'Handwash or top-rack dishwasher safe. Avoid abrasive scouring pads.'
                        : categoryLower.includes('bag')
                        ? 'Spot clean with cool water and mild organic soap. Air dry flat.'
                        : 'Store in a dry space away from direct sunlight to preserve binding.'}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-[#1E1C1A] block">Sustainability:</span>
                    <span>Packaged in 100% recyclable, plastic-free shipping boxes.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="max-w-3xl space-y-6 animate-in fade-in duration-200">
              <h2 className="font-playfair text-2xl sm:text-3xl text-[#1E1C1A]">
                Shipping & Returns
              </h2>
              <div className="space-y-4 text-xs text-[#5C554B]">
                <div className="p-5 rounded-xl bg-white border border-[#E5DFC0] space-y-2">
                  <h3 className="font-semibold text-sm text-[#1E1C1A]">Domestic & Global Delivery</h3>
                  <p className="leading-relaxed">
                    Orders are processed and dispatched within 1–2 business days. Express domestic delivery arrives in 2–4 business days. International shipping is tracked and insured.
                  </p>
                </div>
                <div className="p-5 rounded-xl bg-white border border-[#E5DFC0] space-y-2">
                  <h3 className="font-semibold text-sm text-[#1E1C1A]">30-Day Happiness Guarantee</h3>
                  <p className="leading-relaxed">
                    If you are not completely enchanted with your purchase, return it in original condition within 30 days for an effortless replacement or full refund.
                  </p>
                </div>
              </div>
            </div>
          )}
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
                Cultivate clarity around your daily thoughts, inner dialogue, and goals.
              </p>
            </div>

            <div className="space-y-3 lg:px-6 text-center sm:text-start">
              <div className="w-10 h-10 rounded-full bg-white border border-[#E5DFC0] text-[#D49B4B] flex items-center justify-center mx-auto sm:mx-0">
                <Sun className="w-4 h-4" />
              </div>
              <h3 className="font-playfair text-lg text-[#1E1C1A]">Heal and Let Go</h3>
              <p className="font-sans text-xs text-[#6B655B] leading-relaxed">
                Release what no longer serves you and create space for grounded abundance.
              </p>
            </div>

            <div className="space-y-3 lg:px-6 text-center sm:text-start">
              <div className="w-10 h-10 rounded-full bg-white border border-[#E5DFC0] text-[#B85233] flex items-center justify-center mx-auto sm:mx-0">
                <Sprout className="w-4 h-4" />
              </div>
              <h3 className="font-playfair text-lg text-[#1E1C1A]">Set Intentions</h3>
              <p className="font-sans text-xs text-[#6B655B] leading-relaxed">
                Shape a deliberate vision for the resilient life you deserve.
              </p>
            </div>

            <div className="space-y-3 lg:px-6 last:pe-0 text-center sm:text-start">
              <div className="w-10 h-10 rounded-full bg-white border border-[#E5DFC0] text-[#1E1C1A] flex items-center justify-center mx-auto sm:mx-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="font-playfair text-lg text-[#1E1C1A]">Grow with Purpose</h3>
              <p className="font-sans text-xs text-[#6B655B] leading-relaxed">
                Transform inward reflections into confident, real-world action.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. YOU MIGHT ALSO LIKE (RELATED PRODUCTS) */}
      {relatedProducts && relatedProducts.length > 0 && (
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
                <span>View entire collection</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.slice(0, 4).map((item) => (
                <ProductCard key={item.id} product={item} showDetailsButton={true} />
              ))}
            </div>
          </Container>
        </section>
      )}

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
