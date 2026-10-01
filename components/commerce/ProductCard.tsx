import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

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
  showActions?: boolean;
  className?: string;
}

export function ProductCard({
  product,
  onAddToCart,
  showActions = true,
  className = '',
}: ProductCardProps) {
  const formattedPrice =
    typeof product.price === 'number'
      ? `$${product.price.toFixed(2)}`
      : product.price.startsWith('$')
      ? product.price
      : `$${product.price}`;

  return (
    <div
      className={`group flex flex-col justify-between bg-white rounded-lg border border-[#E5DFC0]/70 p-4 sm:p-5 transition-all duration-200 hover:shadow-md hover:border-[#E5DFC0] ${className}`}
    >
      <div>
        {/* Product Image Container */}
        <Link
          href={`/shop/${product.slug}`}
          className="relative block w-full aspect-[4/5] rounded-md bg-[#FAF8F5] overflow-hidden mb-4 border border-[#E5DFC0]/40 group-hover:opacity-95 transition-opacity"
        >
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-103"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center p-4 text-center">
              <span className="font-playfair text-lg text-[#1E1C1A]/40 italic">
                {product.title}
              </span>
            </div>
          )}
        </Link>

        {/* Product Category & Title */}
        <div className="space-y-1.5 mb-3">
          {product.category && (
            <span className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#6B655B]">
              {product.category}
            </span>
          )}
          <h3 className="font-playfair text-lg sm:text-xl font-normal text-[#1E1C1A]">
            <Link
              href={`/shop/${product.slug}`}
              className="hover:text-[#B85233] transition-colors focus-visible:outline-none"
            >
              {product.title}
            </Link>
          </h3>
          {product.description && (
            <p className="text-xs sm:text-sm text-[#6B655B] line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>
      </div>

      {/* Price & Availability & Actions */}
      <div className="pt-3 border-t border-[#E5DFC0]/40 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-sans text-base sm:text-lg font-medium text-[#1E1C1A]">
            {formattedPrice}
          </span>
          <Badge variant={product.isAvailable !== false ? 'inStock' : 'outOfStock'} size="sm">
            {product.isAvailable !== false ? 'In Stock' : 'Out of Stock'}
          </Badge>
        </div>

        {showActions && (
          <div className="grid grid-cols-2 gap-2 pt-1">
            <Button
              variant="primary"
              size="sm"
              onClick={() => onAddToCart?.(product)}
              disabled={product.isAvailable === false}
              className="w-full"
            >
              Add to Cart
            </Button>
            <Link href={`/shop/${product.slug}`} className="w-full">
              <Button variant="outline" size="sm" className="w-full">
                View Details
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
