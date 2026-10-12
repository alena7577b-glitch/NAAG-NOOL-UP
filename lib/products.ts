import { db } from '@/lib/db';
import { ProductCardData } from '@/components/commerce/ProductCard';

export type { ProductCardData };

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

export const CANONICAL_JOURNALS: ProductDetailData[] = [];

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

    if (products.length > 0) {
      return products.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        description: p.description,
        price: Number(p.price),
        category: p.category,
        imageUrl: p.images[0]?.url || `/images/journal-${p.slug.replace('the-', '')}.png`,
        isAvailable: p.isAvailable && p.stockQuantity > 0,
      }));
    }
  } catch {
    // Fallback to canonical journals if DB is unreachable or empty
  }

  return CANONICAL_JOURNALS.slice(0, limit).map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    description: p.description,
    price: p.price,
    category: p.category,
    imageUrl: p.imageUrl,
    isAvailable: p.isAvailable,
  }));
}

/**
 * Fetch all available products with optional category filtering and search
 */
export async function getAllProducts(options?: {
  category?: string;
  searchQuery?: string;
  sortBy?: 'price-asc' | 'price-desc' | 'newest';
}): Promise<{ products: ProductCardData[]; categories: string[] }> {
  const defaultCategories = [
    'All',
    'Journals',
    'Notebooks',
    'Mugs',
    'Bags',
  ];

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

    if (products.length > 0) {
      const categories = [
        'All',
        ...Array.from(new Set([...defaultCategories.slice(1), ...allDistinctCategories.map((c) => c.category).filter(Boolean)])),
      ];

      return {
        products: products.map((p) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          description: p.description,
          price: Number(p.price),
          category: p.category,
          imageUrl: p.images[0]?.url || `/images/journal-${p.slug.replace('the-', '')}.svg`,
          isAvailable: p.isAvailable && p.stockQuantity > 0,
        })),
        categories,
      };
    }
  } catch {
    // Fallback to canonical dataset
  }

  let filtered = [...CANONICAL_JOURNALS];

  if (options?.category && options.category !== 'All') {
    filtered = filtered.filter((p) => p.category?.toLowerCase() === options.category?.toLowerCase());
  }

  if (options?.searchQuery && options.searchQuery.trim() !== '') {
    const q = options.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (p) => p.title.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q))
    );
  }

  if (options?.sortBy === 'price-asc') {
    filtered.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (options?.sortBy === 'price-desc') {
    filtered.sort((a, b) => Number(b.price) - Number(a.price));
  }

  return {
    products: filtered.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      description: p.description,
      price: p.price,
      category: p.category,
      imageUrl: p.imageUrl,
      isAvailable: p.isAvailable,
    })),
    categories: defaultCategories,
  };
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

    if (product) {
      return {
        id: product.id,
        title: product.title,
        slug: product.slug,
        description: product.description,
        price: Number(product.price),
        category: product.category,
        imageUrl: product.images[0]?.url || `/images/journal-${product.slug.replace('the-', '')}.png`,
        isAvailable: product.isAvailable && product.stockQuantity > 0,
        stockQuantity: product.stockQuantity,
        metadata: (product.metadata as Record<string, any>) || null,
        images: product.images.length > 0
          ? product.images.map((img) => ({
              id: img.id,
              url: img.url,
              altText: img.altText,
              sortOrder: img.sortOrder,
            }))
          : [
              { id: 'img-1', url: `/images/journal-${product.slug.replace('the-', '')}.png`, altText: product.title, sortOrder: 0 },
            ],
        createdAt: product.createdAt,
      };
    }
  } catch {
    // Fallback
  }

  const found = CANONICAL_JOURNALS.find((p) => p.slug === slug || p.slug === `the-${slug}`);
  return found || null;
}

