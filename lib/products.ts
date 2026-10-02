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

export const CANONICAL_JOURNALS: ProductDetailData[] = [
  {
    id: 'prod-awakening',
    title: 'The Awakening',
    slug: 'the-awakening',
    description: 'A guided journal to help you reconnect with your true self and rediscover your inner strength. The Awakening provides space to reflect, awaken, and move forward with intention.',
    price: 24.00,
    category: 'Self-Discovery',
    imageUrl: '/images/journal-awakening.svg',
    isAvailable: true,
    stockQuantity: 150,
    metadata: { tagline: 'Discover your power.', color: '#1B2A4A' },
    images: [
      { id: 'img-awakening-1', url: '/images/journal-awakening.svg', altText: 'The Awakening Guided Journal Cover', sortOrder: 0 },
      { id: 'img-awakening-2', url: '/images/journal-awakening.svg', altText: 'The Awakening Journal Spread', sortOrder: 1 },
      { id: 'img-awakening-3', url: '/images/journal-awakening.svg', altText: 'The Awakening Journal Detail', sortOrder: 2 },
      { id: 'img-awakening-4', url: '/images/journal-awakening.svg', altText: 'The Awakening Journal Flatlay', sortOrder: 3 },
    ],
    createdAt: new Date('2025-01-01'),
  },
  {
    id: 'prod-clarity',
    title: 'The Clarity',
    slug: 'the-clarity',
    description: 'Clear your mind, release what no longer serves you, and find your direction with gentle daily prompts and grounding exercises.',
    price: 24.00,
    category: 'Healing & Growth',
    imageUrl: '/images/journal-clarity.svg',
    isAvailable: true,
    stockQuantity: 120,
    metadata: { tagline: 'Find your direction.', color: '#4D5844' },
    images: [
      { id: 'img-clarity-1', url: '/images/journal-clarity.svg', altText: 'The Clarity Guided Journal Cover', sortOrder: 0 },
      { id: 'img-clarity-2', url: '/images/journal-clarity.svg', altText: 'The Clarity Journal Spread', sortOrder: 1 },
      { id: 'img-clarity-3', url: '/images/journal-clarity.svg', altText: 'The Clarity Journal Detail', sortOrder: 2 },
      { id: 'img-clarity-4', url: '/images/journal-clarity.svg', altText: 'The Clarity Journal Flatlay', sortOrder: 3 },
    ],
    createdAt: new Date('2025-01-02'),
  },
  {
    id: 'prod-healing',
    title: 'The Healing',
    slug: 'the-healing',
    description: 'A space to process, rebuild, and embrace your new chapter. Dedicated to emotional restoration and gentle inner dialogue.',
    price: 24.00,
    category: 'Healing & Growth',
    imageUrl: '/images/journal-healing.svg',
    isAvailable: true,
    stockQuantity: 100,
    metadata: { tagline: 'Release. Rebuild.', color: '#B85233' },
    images: [
      { id: 'img-healing-1', url: '/images/journal-healing.svg', altText: 'The Healing Guided Journal Cover', sortOrder: 0 },
      { id: 'img-healing-2', url: '/images/journal-healing.svg', altText: 'The Healing Journal Spread', sortOrder: 1 },
      { id: 'img-healing-3', url: '/images/journal-healing.svg', altText: 'The Healing Journal Detail', sortOrder: 2 },
      { id: 'img-healing-4', url: '/images/journal-healing.svg', altText: 'The Healing Journal Flatlay', sortOrder: 3 },
    ],
    createdAt: new Date('2025-01-03'),
  },
  {
    id: 'prod-confidence',
    title: 'The Confidence',
    slug: 'the-confidence',
    description: 'Build your self-belief, set your goals, and celebrate your progress. Designed to help you speak up and show up boldly.',
    price: 24.00,
    category: 'Gratitude & Mindfulness',
    imageUrl: '/images/journal-confidence.svg',
    isAvailable: true,
    stockQuantity: 140,
    metadata: { tagline: 'Speak. Show up.', color: '#D49B4B' },
    images: [
      { id: 'img-confidence-1', url: '/images/journal-confidence.svg', altText: 'The Confidence Guided Journal Cover', sortOrder: 0 },
      { id: 'img-confidence-2', url: '/images/journal-confidence.svg', altText: 'The Confidence Journal Spread', sortOrder: 1 },
      { id: 'img-confidence-3', url: '/images/journal-confidence.svg', altText: 'The Confidence Journal Detail', sortOrder: 2 },
      { id: 'img-confidence-4', url: '/images/journal-confidence.svg', altText: 'The Confidence Journal Flatlay', sortOrder: 3 },
    ],
    createdAt: new Date('2025-01-04'),
  },
  {
    id: 'prod-abundance',
    title: 'The Abundance',
    slug: 'the-abundance',
    description: 'Cultivate gratitude, attract possibility, and create the life you deserve. A daily compass for aligning thoughts with prosperity.',
    price: 24.00,
    category: 'Legacy & Purpose',
    imageUrl: '/images/journal-abundance.svg',
    isAvailable: true,
    stockQuantity: 110,
    metadata: { tagline: 'Create what you deserve.', color: '#7E6B8F' },
    images: [
      { id: 'img-abundance-1', url: '/images/journal-abundance.svg', altText: 'The Abundance Guided Journal Cover', sortOrder: 0 },
      { id: 'img-abundance-2', url: '/images/journal-abundance.svg', altText: 'The Abundance Journal Spread', sortOrder: 1 },
      { id: 'img-abundance-3', url: '/images/journal-abundance.svg', altText: 'The Abundance Journal Detail', sortOrder: 2 },
      { id: 'img-abundance-4', url: '/images/journal-abundance.svg', altText: 'The Abundance Journal Flatlay', sortOrder: 3 },
    ],
    createdAt: new Date('2025-01-05'),
  },
  {
    id: 'prod-legacy',
    title: 'The Legacy',
    slug: 'the-legacy',
    description: 'Write your story, honor your journey, and leave a lasting impact. A keepsake journal for recording ancestral wisdom and aspirations.',
    price: 24.00,
    category: 'Legacy & Purpose',
    imageUrl: '/images/journal-legacy.svg',
    isAvailable: true,
    stockQuantity: 95,
    metadata: { tagline: 'Write your next chapter.', color: '#EAE5DC' },
    images: [
      { id: 'img-legacy-1', url: '/images/journal-legacy.svg', altText: 'The Legacy Guided Journal Cover', sortOrder: 0 },
      { id: 'img-legacy-2', url: '/images/journal-legacy.svg', altText: 'The Legacy Journal Spread', sortOrder: 1 },
      { id: 'img-legacy-3', url: '/images/journal-legacy.svg', altText: 'The Legacy Journal Detail', sortOrder: 2 },
      { id: 'img-legacy-4', url: '/images/journal-legacy.svg', altText: 'The Legacy Journal Flatlay', sortOrder: 3 },
    ],
    createdAt: new Date('2025-01-06'),
  },
];

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
        imageUrl: p.images[0]?.url || `/images/journal-${p.slug.replace('the-', '')}.svg`,
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
    'Self-Discovery',
    'Healing & Growth',
    'Confidence & Success',
    'Gratitude & Mindfulness',
    'Legacy & Purpose',
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
        imageUrl: product.images[0]?.url || `/images/journal-${product.slug.replace('the-', '')}.svg`,
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
              { id: 'img-1', url: `/images/journal-${product.slug.replace('the-', '')}.svg`, altText: product.title, sortOrder: 0 },
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

