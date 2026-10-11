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
  // ==========================================
  // 1. GUIDED JOURNALS
  // ==========================================
  {
    id: 'prod-awakening',
    title: 'The Awakening',
    slug: 'the-awakening',
    description: 'A guided journal to help you reconnect with your true self and rediscover your inner strength. The Awakening provides space to reflect, awaken, and move forward with intention.',
    price: 24.00,
    category: 'Guided Journals',
    imageUrl: '/images/journal-awakening.png',
    isAvailable: true,
    stockQuantity: 150,
    metadata: { tagline: 'Discover your power.', color: '#1B2A4A', theme: 'Self-Discovery' },
    images: [
      { id: 'img-awakening-1', url: '/images/journal-awakening.png', altText: 'The Awakening Guided Journal Cover', sortOrder: 0 },
      { id: 'img-awakening-2', url: '/images/journal-awakening.png', altText: 'The Awakening Journal Spread', sortOrder: 1 },
    ],
    createdAt: new Date('2025-01-01'),
  },
  {
    id: 'prod-clarity',
    title: 'The Clarity',
    slug: 'the-clarity',
    description: 'Clear your mind, release what no longer serves you, and find your direction with gentle daily prompts and grounding exercises.',
    price: 24.00,
    category: 'Guided Journals',
    imageUrl: '/images/journal-clarity.png',
    isAvailable: true,
    stockQuantity: 120,
    metadata: { tagline: 'Find your direction.', color: '#4D5844', theme: 'Healing & Growth' },
    images: [
      { id: 'img-clarity-1', url: '/images/journal-clarity.png', altText: 'The Clarity Guided Journal Cover', sortOrder: 0 },
      { id: 'img-clarity-2', url: '/images/journal-clarity.png', altText: 'The Clarity Journal Spread', sortOrder: 1 },
    ],
    createdAt: new Date('2025-01-02'),
  },
  {
    id: 'prod-healing',
    title: 'The Healing',
    slug: 'the-healing',
    description: 'A space to process, rebuild, and embrace your new chapter. Dedicated to emotional restoration and gentle inner dialogue.',
    price: 24.00,
    category: 'Guided Journals',
    imageUrl: '/images/journal-healing.png',
    isAvailable: true,
    stockQuantity: 100,
    metadata: { tagline: 'Release. Rebuild.', color: '#B85233', theme: 'Healing & Growth' },
    images: [
      { id: 'img-healing-1', url: '/images/journal-healing.png', altText: 'The Healing Guided Journal Cover', sortOrder: 0 },
    ],
    createdAt: new Date('2025-01-03'),
  },
  {
    id: 'prod-confidence',
    title: 'The Confidence',
    slug: 'the-confidence',
    description: 'Build your self-belief, set your goals, and celebrate your progress. Designed to help you speak up and show up boldly.',
    price: 24.00,
    category: 'Guided Journals',
    imageUrl: '/images/journal-confidence.png',
    isAvailable: true,
    stockQuantity: 140,
    metadata: { tagline: 'Speak. Show up.', color: '#D49B4B', theme: 'Confidence & Success' },
    images: [
      { id: 'img-confidence-1', url: '/images/journal-confidence.png', altText: 'The Confidence Guided Journal Cover', sortOrder: 0 },
    ],
    createdAt: new Date('2025-01-04'),
  },
  {
    id: 'prod-abundance',
    title: 'The Abundance',
    slug: 'the-abundance',
    description: 'Cultivate gratitude, attract possibility, and create the life you deserve. A daily compass for aligning thoughts with prosperity.',
    price: 24.00,
    category: 'Guided Journals',
    imageUrl: '/images/journal-abundance.png',
    isAvailable: true,
    stockQuantity: 110,
    metadata: { tagline: 'Create what you deserve.', color: '#7E6B8F', theme: 'Gratitude & Mindfulness' },
    images: [
      { id: 'img-abundance-1', url: '/images/journal-abundance.png', altText: 'The Abundance Guided Journal Cover', sortOrder: 0 },
    ],
    createdAt: new Date('2025-01-05'),
  },
  {
    id: 'prod-legacy',
    title: 'The Legacy',
    slug: 'the-legacy',
    description: 'Write your story, honor your journey, and leave a lasting impact. A keepsake journal for recording ancestral wisdom and aspirations.',
    price: 24.00,
    category: 'Guided Journals',
    imageUrl: '/images/journal-legacy.png',
    isAvailable: true,
    stockQuantity: 95,
    metadata: { tagline: 'Write your next chapter.', color: '#EAE5DC', theme: 'Legacy & Purpose' },
    images: [
      { id: 'img-legacy-1', url: '/images/journal-legacy.png', altText: 'The Legacy Guided Journal Cover', sortOrder: 0 },
    ],
    createdAt: new Date('2025-01-06'),
  },
  {
    id: 'prod-mahadnaga',
    title: 'Buugga Mahadnaga (Somali Gratitude Journal)',
    slug: 'buugga-mahadnaga',
    description: 'Our signature Somali edition gratitude journal. A sacred linen-bound keepsake celebrating daily reflections, blessings, and cultural pride.',
    price: 26.00,
    category: 'Guided Journals',
    imageUrl: '/images/shop-banner-actual.png',
    isAvailable: true,
    stockQuantity: 80,
    metadata: { tagline: 'Xusuuso Nimcada.', color: '#D49B4B', theme: 'Somali Heritage' },
    images: [
      { id: 'img-mahadnaga-1', url: '/images/shop-banner-actual.png', altText: 'Buugga Mahadnaga Journal Cover', sortOrder: 0 },
    ],
    createdAt: new Date('2025-01-07'),
  },
  {
    id: 'prod-riyooyinka',
    title: 'Buugga Riyooyinka (Somali Dreams Journal)',
    slug: 'buugga-riyooyinka',
    description: 'Dedicated to visionary Somali women crafting their aspirations. Prompts and structured guidance for visionary dreaming and decisive execution.',
    price: 26.00,
    category: 'Guided Journals',
    imageUrl: '/images/shop-banner-actual.png',
    isAvailable: true,
    stockQuantity: 85,
    metadata: { tagline: 'Riyooyinkaaga Rumee.', color: '#B85233', theme: 'Vision & Purpose' },
    images: [
      { id: 'img-riyooyinka-1', url: '/images/shop-banner-actual.png', altText: 'Buugga Riyooyinka Journal Cover', sortOrder: 0 },
    ],
    createdAt: new Date('2025-01-08'),
  },

  // ==========================================
  // 2. APPAREL & SCARF WEAR
  // ==========================================
  {
    id: 'prod-garbasaar-scarf',
    title: 'Silk Chiffon Garbasaar (Heritage Modest Scarf)',
    slug: 'silk-chiffon-garbasaar',
    description: 'An artisanal silk chiffon modest scarf in warm terracotta and golden ochre. Features delicate metallic thread embroidery inspired by Somali architectural borders.',
    price: 38.00,
    category: 'Apparel & Scarf Wear',
    imageUrl: '/images/merch-garbasaar-scarf.jpg',
    isAvailable: true,
    stockQuantity: 65,
    metadata: { tagline: 'Generational elegance.', material: 'Pure Silk Chiffon' },
    images: [
      { id: 'img-garbasaar-1', url: '/images/merch-garbasaar-scarf.jpg', altText: 'Silk Chiffon Garbasaar Flatlay', sortOrder: 0 },
    ],
    createdAt: new Date('2025-01-09'),
  },
  {
    id: 'prod-ayeyo-shawl',
    title: 'Ayeyo Artisanal Handwoven Wrap',
    slug: 'ayeyo-artisanal-wrap',
    description: 'Handwoven by master artisans supporting our Ayeyo Koris cooperative. Luxurious soft natural fibers with subtle fringing, designed for comfort and presence.',
    price: 48.00,
    category: 'Apparel & Scarf Wear',
    imageUrl: '/images/merch-garbasaar-scarf.jpg',
    isAvailable: true,
    stockQuantity: 40,
    metadata: { tagline: 'Woven with purpose.', artisan: 'Ayeyo Koris Collective' },
    images: [
      { id: 'img-shawl-1', url: '/images/merch-garbasaar-scarf.jpg', altText: 'Ayeyo Artisanal Handwoven Wrap', sortOrder: 0 },
    ],
    createdAt: new Date('2025-01-10'),
  },

  // ==========================================
  // 3. CULTURAL GOODS & ARTIFACTS
  // ==========================================
  {
    id: 'prod-shax-board',
    title: 'Handcrafted Wooden Shax Board Game Set',
    slug: 'handcrafted-shax-board',
    description: 'The ancient Somali strategy game of Shax, brought to life in hand-carved teak wood with geometric border inlays. Includes polished dark ebony and light playing pieces with handwoven basket.',
    price: 45.00,
    category: 'Cultural Goods',
    imageUrl: '/images/merch-shax-board.jpg',
    isAvailable: true,
    stockQuantity: 50,
    metadata: { tagline: 'Heritage intellect and strategy.', material: 'Carved Teak & Stone' },
    images: [
      { id: 'img-shax-1', url: '/images/merch-shax-board.jpg', altText: 'Handcrafted Wooden Shax Board Set', sortOrder: 0 },
    ],
    createdAt: new Date('2025-01-11'),
  },
  {
    id: 'prod-dabqaad-burner',
    title: 'Artisanal Terracotta Dabqaad Incense Burner',
    slug: 'artisanal-terracotta-dabqaad',
    description: 'Traditional Somali incense burner hand-sculpted in white-washed natural terracotta. Adorned with ancestral geometric etchings for burning fragrant frankincense and Uunsi.',
    price: 32.00,
    category: 'Cultural Goods',
    imageUrl: '/images/merch-dabqaad-burner.jpg',
    isAvailable: true,
    stockQuantity: 75,
    metadata: { tagline: 'Aromatic tradition.', origin: 'Mogadishu & Hargeisa' },
    images: [
      { id: 'img-dabqaad-1', url: '/images/merch-dabqaad-burner.jpg', altText: 'Artisanal Terracotta Dabqaad Burner', sortOrder: 0 },
    ],
    createdAt: new Date('2025-01-12'),
  },

  // ==========================================
  // 4. LIFESTYLE & ACCESSORIES
  // ==========================================
  {
    id: 'prod-canvas-tote',
    title: 'Organic Heavyweight "Naag Nool" Canvas Tote',
    slug: 'naag-nool-canvas-tote',
    description: 'Heavyweight organic unbleached canvas tote featuring terracotta screenprint: "NAAG NOOL UP — The time to be ALIVE is now". Reinforced handles and interior zip pocket for daily carrying.',
    price: 25.00,
    category: 'Lifestyle & Accessories',
    imageUrl: '/images/merch-canvas-tote.jpg',
    isAvailable: true,
    stockQuantity: 120,
    metadata: { tagline: 'Carry your purpose.', material: '100% Organic Cotton Canvas' },
    images: [
      { id: 'img-tote-1', url: '/images/merch-canvas-tote.jpg', altText: 'Naag Nool Canvas Tote Bag', sortOrder: 0 },
    ],
    createdAt: new Date('2025-01-13'),
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
    'Guided Journals',
    'Apparel & Scarf Wear',
    'Cultural Goods',
    'Lifestyle & Accessories',
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

