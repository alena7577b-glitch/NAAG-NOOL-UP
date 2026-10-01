'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ShieldCheck, Sparkles, BookOpen, Truck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { QuantityStepper } from '@/components/commerce/QuantityStepper';
import { ProductDetailData } from '@/lib/products';

export interface ProductDetailViewProps {
  product: ProductDetailData;
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  const images = product.images.length > 0 ? product.images : [{ id: 'default', url: product.imageUrl || '', altText: product.title, sortOrder: 0 }];
  const activeImage = images[selectedImageIndex] || images[0];

  const formattedPrice =
    typeof product.price === 'number'
      ? `$${product.price.toFixed(2)}`
      : `$${product.price}`;

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => {
      setAddedToCart(false);
    }, 3500);
  };

  return (
    <div className="space-y-12">
      {/* Breadcrumb / Back Link */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-[#6B655B]">
        <Link href="/shop" className="hover:text-[#B85233] transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
          <span>Back to Shop</span>
        </Link>
        <span>/</span>
        <span className="text-[#1E1C1A] font-medium truncate max-w-[200px]">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Gallery Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[4/5] w-full rounded-2xl bg-[#FAF8F5] border border-[#E5DFC0]/70 overflow-hidden shadow-sm flex items-center justify-center">
            {activeImage.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={activeImage.url}
                alt={activeImage.altText || product.title}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
                <BookOpen className="w-12 h-12 text-[#B85233]/40" />
                <span className="font-playfair text-2xl text-[#1E1C1A]/40 italic">
                  {product.title}
                </span>
              </div>
            )}
          </div>

          {/* Thumbnail Selection */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 aspect-square rounded-lg border overflow-hidden transition-all cursor-pointer ${
                    selectedImageIndex === idx
                      ? 'border-[#B85233] ring-2 ring-[#B85233]/20'
                      : 'border-[#E5DFC0] opacity-70 hover:opacity-100'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt={img.altText || ''} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info Column */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            {product.category && (
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#B85233]">
                {product.category}
              </span>
            )}
            <h1 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1E1C1A]">
              {product.title}
            </h1>
          </div>

          {/* Price & Availability */}
          <div className="flex items-center gap-4 py-2 border-y border-[#E5DFC0]/60">
            <span className="font-sans text-2xl sm:text-3xl font-medium text-[#1E1C1A]">
              {formattedPrice}
            </span>
            <Badge variant={product.isAvailable ? 'inStock' : 'outOfStock'} size="md">
              {product.isAvailable ? 'Available' : 'Out of Stock'}
            </Badge>
          </div>

          {/* Description */}
          {product.description && (
            <p className="font-sans text-sm sm:text-base text-[#6B655B] leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Quantity & Add to Cart */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1E1C1A]">
                Quantity
              </span>
              <QuantityStepper
                value={quantity}
                onChange={setQuantity}
                disabled={!product.isAvailable}
                min={1}
                max={Math.min(10, product.stockQuantity || 10)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={handleAddToCart}
                disabled={!product.isAvailable}
                className="w-full sm:flex-1 shadow-md"
              >
                Add {quantity} to Bag • {typeof product.price === 'number' ? `$${(product.price * quantity).toFixed(2)}` : formattedPrice}
              </Button>
            </div>

            {addedToCart && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#4D5844]/15 border border-[#4D5844]/30 text-[#4D5844] text-xs sm:text-sm animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  Added {quantity} &times; <strong>{product.title}</strong> to your shopping bag!
                </span>
              </div>
            )}
          </div>

          {/* Specifications & Value Propositions */}
          <div className="pt-6 border-t border-[#E5DFC0]/60 space-y-4">
            <h3 className="font-playfair text-lg text-[#1E1C1A]">Craft & Quality Highlights</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFC0]/60 text-xs text-[#6B655B]">
                <Sparkles className="w-4 h-4 text-[#B85233] shrink-0 mt-0.5" />
                <span>Premium foil-embossed linen hardcover</span>
              </div>
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFC0]/60 text-xs text-[#6B655B]">
                <BookOpen className="w-4 h-4 text-[#4D5844] shrink-0 mt-0.5" />
                <span>120gsm heavy bleed-resistant paper</span>
              </div>
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFC0]/60 text-xs text-[#6B655B]">
                <Truck className="w-4 h-4 text-[#D49B4B] shrink-0 mt-0.5" />
                <span>Carefully packed with protective tissue</span>
              </div>
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFC0]/60 text-xs text-[#6B655B]">
                <ShieldCheck className="w-4 h-4 text-[#1E1C1A] shrink-0 mt-0.5" />
                <span>Structured daily guided reflections</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
