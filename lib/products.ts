import { db } from '@/lib/db';
import { ProductCardData } from '@/components/commerce/ProductCard';

export interface ProductDetailData extends ProductCardData {
  stockQuantity: number;
  metadata?: Record<string, any> | null;
  images: Array<{
    id: string;
    url: string;
    altText?: string | null;
    sortOrder: number;
  }>;
  createdAt: Date;
}

/**
 * Fetch featured products for Homepage display
 */
export async function getFeaturedProducts(limit = 6): Promise<ProductCardData[]> {
  try {
    const products = await db.product.findMany({
      where: {
        isAvailable: true,
      },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return products.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      description: p.description,
      price: Number(p.price),
      category: p.category,
      imageUrl: p.images[0]?.url,
      isAvailable: p.isAvailable && p.stockQuantity > 0,
    }));
  } catch {
    return [];
  }
}

/**
 * Fetch all available products with optional category filtering and search
 */
export async function getAllProducts(options?: {
  category?: string;
  searchQuery?: string;
  sortBy?: 'price-asc' | 'price-desc' | 'newest';
}): Promise<{ products: ProductCardData[]; categories: string[] }> {
  try {
    const where: any = {
      isAvailable: true,
    };

    if (options?.category && options.category !== 'All') {
      where.category = {
        equals: options.category,
        mode: 'insensitive',
      };
    }

    if (options?.searchQuery && options.searchQuery.trim() !== '') {
      where.OR = [
        { title: { contains: options.searchQuery, mode: 'insensitive' } },
        { description: { contains: options.searchQuery, mode: 'insensitive' } },
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (options?.sortBy === 'price-asc') {
      orderBy = { price: 'asc' };
    } else if (options?.sortBy === 'price-desc') {
      orderBy = { price: 'desc' };
    }

    const [products, allDistinctCategories] = await Promise.all([
      db.product.findMany({
        where,
        include: {
          images: {
            orderBy: { sortOrder: 'asc' },
            take: 1,
          },
        },
        orderBy,
      }),
      db.product.findMany({
        where: { isAvailable: true },
        select: { category: true },
        distinct: ['category'],
      }),
    ]);

    const categories = ['All', ...allDistinctCategories.map((c) => c.category).filter(Boolean)];

    return {
      products: products.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        description: p.description,
        price: Number(p.price),
        category: p.category,
        imageUrl: p.images[0]?.url,
        isAvailable: p.isAvailable && p.stockQuantity > 0,
      })),
      categories,
    };
  } catch {
    return {
      products: [],
      categories: ['All'],
    };
  }
}

/**
 * Fetch a single product by unique slug
 */
export async function getProductBySlug(slug: string): Promise<ProductDetailData | null> {
  try {
    const product = await db.product.findUnique({
      where: { slug },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!product) return null;

    return {
      id: product.id,
      title: product.title,
      slug: product.slug,
      description: product.description,
      price: Number(product.price),
      category: product.category,
      imageUrl: product.images[0]?.url,
      isAvailable: product.isAvailable && product.stockQuantity > 0,
      stockQuantity: product.stockQuantity,
      metadata: (product.metadata as Record<string, any>) || null,
      images: product.images.map((img) => ({
        id: img.id,
        url: img.url,
        altText: img.altText,
        sortOrder: img.sortOrder,
      })),
      createdAt: product.createdAt,
    };
  } catch {
    return null;
  }
}
