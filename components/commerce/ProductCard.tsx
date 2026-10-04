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
      className={`group flex flex-col justify-between bg-[#FAF8F5] rounded-xl border border-[#E5DFC0]/70 p-4 transition-[transform,box-shadow,border-color] duration-180 ease-out hover:-translate-y-1 hover:shadow-md hover:border-[#D49B4B]/50 active:scale-[0.985] ${className}`}
    >
      <div>
        {/* Product Image Frame */}
        <Link
          href={`/product/${product.slug}`}
          className="relative block w-full aspect-[4/5] min-h-[260px] sm:min-h-[300px] rounded-xl bg-[#F4EFE6] overflow-hidden mb-4 border border-[#E5DFC0]/60 group-hover:opacity-95 transition-opacity duration-150 flex items-center justify-center p-4"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={product.title}
            className="w-full h-full object-contain object-center transition-transform duration-250 ease-out group-hover:scale-[1.04]"
            loading="lazy"
          />
        </Link>

        {/* Category Eyebrow & Title */}
        <div className="space-y-1 mb-3">
          {product.category && (
            <span className="block text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#6B655B]">
              {product.category}
            </span>
          )}
          <h3 className="font-playfair text-base sm:text-lg font-normal text-[#1E1C1A]">
            <Link
              href={`/product/${product.slug}`}
              className="hover:text-[#B85233] transition-colors duration-150 focus-visible:outline-none"
            >
              {product.title}
            </Link>
          </h3>
          {product.description && (
            <p className="text-xs text-[#6B655B] line-clamp-2 leading-relaxed font-sans">
              {product.description}
            </p>
          )}
        </div>
      </div>

      {/* Price, Stock Indicator & Buttons */}
      <div className="pt-3 border-t border-[#E5DFC0]/50 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-sans text-base sm:text-lg font-medium text-[#1E1C1A]">
            {formattedPrice}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[11px] text-[#4D5844] font-medium">
            <span className="h-2 w-2 rounded-full bg-[#4D5844]" />
            <span>In Stock</span>
          </span>
        </div>

        <div className={`grid ${showDetailsButton ? 'grid-cols-2 gap-2' : 'grid-cols-1'} pt-1`}>
          <button
            type="button"
            onClick={handleAdd}
            className={`w-full py-2.5 px-3 rounded-lg text-xs font-medium transition-[transform,background-color,box-shadow] duration-150 ease-out active:scale-[0.97] flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
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
                <span>Add to Cart</span>
              </>
            )}
          </button>

          {showDetailsButton && (
            <Link
              href={`/product/${product.slug}`}
              className="w-full py-2.5 px-3 rounded-lg text-xs font-medium text-[#1E1C1A] bg-transparent border border-[#E5DFC0] hover:bg-[#EAE5DC]/60 transition-[transform,background-color,border-color] duration-150 ease-out active:scale-[0.97] text-center"
            >
              View Details
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
