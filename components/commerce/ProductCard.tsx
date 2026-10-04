'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ShoppingBag, Check } from 'lucide-react';

export interface ProductCardData {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  price: number | string;
  category?: string;
  imageUrl?: string;
  isAvailable?: boolean;
}

export interface ProductCardProps {
  product: ProductCardData;
  onAddToCart?: (product: ProductCardData) => void;
  showDetailsButton?: boolean;
  className?: string;
}

export function ProductCard({
  product,
  onAddToCart,
  showDetailsButton = true,
  className = '',
}: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);

  const formattedPrice =
    typeof product.price === 'number'
      ? `$${product.price.toFixed(2)}`
      : product.price.startsWith('$')
      ? product.price
      : `$${product.price}`;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdded(true);
    onAddToCart?.(product);
    setTimeout(() => setIsAdded(false), 2500);
  };

  const imageSrc =
    product.imageUrl ||
    `/images/journal-${product.slug.replace('the-', '')}.png`;

  return (
    <div
      className={`group flex flex-col justify-between bg-white rounded-2xl border border-[#E5DFC0]/75 p-4 sm:p-5 transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-1.5 hover:shadow-lg hover:border-[#B85233]/40 active:scale-[0.985] ${className}`}
    >
      <div>
        {/* Product Image Frame */}
        <Link
          href={`/product/${product.slug}`}
          className="relative block w-full h-52 sm:h-60 rounded-xl bg-[#FAF7F2] overflow-hidden mb-4 border border-[#E5DFC0]/50 group-hover:bg-[#F4EFE6] transition-colors duration-200 flex items-center justify-center p-3"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={product.title}
            className="w-full h-full object-contain object-center transition-transform duration-300 ease-out group-hover:scale-[1.05]"
            loading="lazy"
          />
        </Link>

        {/* Category Eyebrow & Title */}
        <div className="space-y-1.5 mb-3.5 text-start">
          {product.category && (
            <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B85233]">
              {product.category}
            </span>
          )}
          <h3 className="font-playfair text-lg sm:text-xl font-normal text-[#1E1C1A] tracking-tight">
            <Link
              href={`/product/${product.slug}`}
              className="hover:text-[#B85233] transition-colors duration-150 focus-visible:outline-none"
            >
              {product.title}
            </Link>
          </h3>
          {product.description && (
            <p className="text-xs text-[#6B655B] line-clamp-2 leading-relaxed font-sans font-normal">
              {product.description}
            </p>
          )}
        </div>
      </div>

      {/* Price, Stock Indicator & Buttons */}
      <div className="pt-3.5 border-t border-[#E5DFC0]/60 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-playfair text-lg font-normal text-[#1E1C1A]">
            {formattedPrice}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[11px] text-[#4D5844] font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4D5844]" />
            <span>In Stock</span>
          </span>
        </div>

        <div className={`grid ${showDetailsButton ? 'grid-cols-2 gap-2' : 'grid-cols-1'} pt-0.5`}>
          <button
            type="button"
            onClick={handleAdd}
            className={`w-full py-2.5 px-3 rounded-lg text-xs font-semibold tracking-wide transition-[transform,background-color,box-shadow] duration-160 ease-out active:scale-[0.97] flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
              isAdded
                ? 'bg-[#4D5844] text-white'
                : 'bg-[#B85233] text-white hover:bg-[#A64426]'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Bag</span>
              </>
            )}
          </button>

          {showDetailsButton && (
            <Link
              href={`/product/${product.slug}`}
              className="w-full py-2.5 px-3 rounded-lg text-xs font-medium text-[#1E1C1A] bg-transparent border border-[#E5DFC0] hover:bg-[#FAF7F2] hover:border-[#1E1C1A]/40 transition-[transform,background-color,border-color] duration-160 ease-out active:scale-[0.97] text-center flex items-center justify-center"
            >
              View Details
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
