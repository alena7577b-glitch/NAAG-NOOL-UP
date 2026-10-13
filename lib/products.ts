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
  // 1. GUIDED JOURNALS (Available in English & Somali Editions)
  // ==========================================
  {
    id: 'prod-grateful',
    title: 'Grateful Journal / Buugga Mahadnaga',
    slug: 'grateful-journal',
    description:
      'Our signature daily gratitude journal designed to ground your mornings and evenings in appreciation, peace, and abundance. Available in both English and Somali editions with gold foil detailing and archival paper.',
    price: 26.0,
    category: 'Journals',
    imageUrl: '/images/journal-grateful-english.jpg',
    isAvailable: true,
    stockQuantity: 150,
    metadata: {
      isJournal: true,
      hasDualEditions: true,
      availableEditions: ['English', 'Somali'],
      defaultEdition: 'English',
      englishTitle: 'Grateful Journal',
      englishSubtitle: 'A journal to reflect on the good things in life',
      englishImage: '/images/journal-grateful-english.jpg',
      somaliTitle: 'Buugga Mahadnaga',
      somaliSubtitle: 'Joornaal lagu milicsado waxyaabaha wanaagsan ee nolosha',
      somaliImage: '/images/journal-grateful-somali.jpg',
      tagline: 'Reflect on the good things in life.',
      material: 'Cloth hardcover with embossed copper foil lettering, 220 archival pages',
      dimensions: '6" x 8.5" hardcover with ribbon bookmark',
      aliases: ['grateful', 'the-grateful', 'buugga-mahadnaga', 'mahadnaga'],
    },
    images: [
      {
        id: 'img-grateful-en',
        url: '/images/journal-grateful-english.jpg',
        altText: 'Grateful Journal — English Edition Cover',
        sortOrder: 0,
      },
      {
        id: 'img-grateful-so',
        url: '/images/journal-grateful-somali.jpg',
        altText: 'Buugga Mahadnaga — Somali Edition Cover',
        sortOrder: 1,
      },
    ],
    createdAt: new Date('2025-01-01'),
  },
  {
    id: 'prod-dreams',
    title: 'Dreams Journal / Buugga Riyooyinka',
    slug: 'dreams-journal',
    description:
      'A visionary guided journal created for ambitious women shaping their future with boldness and purpose. Features structured goal-setting, daily intention rituals, and reflection prompts. Available in English and Somali editions.',
    price: 26.0,
    category: 'Journals',
    imageUrl: '/images/journal-dreams-english.jpg',
    isAvailable: true,
    stockQuantity: 140,
    metadata: {
      isJournal: true,
      hasDualEditions: true,
      availableEditions: ['English', 'Somali'],
      defaultEdition: 'English',
      englishTitle: 'Dreams Journal',
      englishSubtitle: "Don't be pushed by your problems, be led by your dreams",
      englishImage: '/images/journal-dreams-english.jpg',
      somaliTitle: 'Buugga Riyooyinka',
      somaliSubtitle: 'Yay ku rixin dhibaatooyinkaaga la soco riyooyinkaaga.',
      somaliImage: '/images/journal-dreams-somali.png',
      tagline: 'Be led by your dreams.',
      material: 'Rose-terracotta hardcover with crisp white foil typography, 220 pages',
      dimensions: '6" x 8.5" hardcover with ribbon marker',
      aliases: ['dreams', 'the-dreams', 'buugga-riyooyinka', 'riyooyinka'],
    },
    images: [
      {
        id: 'img-dreams-en',
        url: '/images/journal-dreams-english.jpg',
        altText: 'Dreams Journal — English Edition Cover',
        sortOrder: 0,
      },
      {
        id: 'img-dreams-so',
        url: '/images/journal-dreams-somali.png',
        altText: 'Buugga Riyooyinka — Somali Edition Cover',
        sortOrder: 1,
      },
    ],
    createdAt: new Date('2025-01-02'),
  },
  {
    id: 'prod-awakening',
    title: 'The Awakening / Buugga Toositaanka',
    slug: 'the-awakening',
    description:
      'A guided journal to help you reconnect with your true self and rediscover your inner strength. Provides space to reflect, awaken, and move forward with intention. Available in English & Somali.',
    price: 24.0,
    category: 'Journals',
    imageUrl: '/images/journal-awakening.png',
    isAvailable: true,
    stockQuantity: 120,
    metadata: {
      isJournal: true,
      hasDualEditions: true,
      availableEditions: ['English', 'Somali'],
      defaultEdition: 'English',
      englishTitle: 'The Awakening Journal',
      englishSubtitle: 'Reconnect with your true self and inner power',
      englishImage: '/images/journal-awakening.png',
      somaliTitle: 'Buugga Toositaanka',
      somaliSubtitle: 'Dib u hel awooddaada iyo iftiinka naftaada',
      somaliImage: '/images/journal-awakening.png',
      tagline: 'Discover your power.',
      color: '#1B2A4A',
      aliases: ['awakening', 'buugga-toositaanka'],
    },
    images: [
      {
        id: 'img-awakening-1',
        url: '/images/journal-awakening.png',
        altText: 'The Awakening Guided Journal Cover',
        sortOrder: 0,
      },
    ],
    createdAt: new Date('2025-01-03'),
  },
  {
    id: 'prod-clarity',
    title: 'The Clarity / Buugga Cabbirka & Cadaynta',
    slug: 'the-clarity',
    description:
      'Clear your mind, release what no longer serves you, and find your direction with gentle daily prompts and grounding exercises. Available in English & Somali.',
    price: 24.0,
    category: 'Journals',
    imageUrl: '/images/journal-clarity.png',
    isAvailable: true,
    stockQuantity: 110,
    metadata: {
      isJournal: true,
      hasDualEditions: true,
      availableEditions: ['English', 'Somali'],
      defaultEdition: 'English',
      englishTitle: 'The Clarity Journal',
      englishSubtitle: 'Clear your mind and find your direction',
      englishImage: '/images/journal-clarity.png',
      somaliTitle: 'Buugga Cabbirka & Cadaynta',
      somaliSubtitle: 'Deji maskaxdaada oo xulo waddadaada toosan',
      somaliImage: '/images/journal-clarity.png',
      tagline: 'Find your direction.',
      color: '#4D5844',
      aliases: ['clarity'],
    },
    images: [
      {
        id: 'img-clarity-1',
        url: '/images/journal-clarity.png',
        altText: 'The Clarity Guided Journal Cover',
        sortOrder: 0,
      },
    ],
    createdAt: new Date('2025-01-04'),
  },
  {
    id: 'prod-healing',
    title: 'The Healing / Buugga Bogsiinta',
    slug: 'the-healing',
    description:
      'A space to process, rebuild, and embrace your new chapter. Dedicated to emotional restoration and gentle inner dialogue. Available in English & Somali.',
    price: 24.0,
    category: 'Journals',
    imageUrl: '/images/journal-healing.png',
    isAvailable: true,
    stockQuantity: 100,
    metadata: {
      isJournal: true,
      hasDualEditions: true,
      availableEditions: ['English', 'Somali'],
      defaultEdition: 'English',
      englishTitle: 'The Healing Journal',
      englishSubtitle: 'Release what weighs you down, rebuild with grace',
      englishImage: '/images/journal-healing.png',
      somaliTitle: 'Buugga Bogsiinta',
      somaliSubtitle: 'Bogsiinta qalbiga iyo bilowga cusub ee noloshaada',
      somaliImage: '/images/journal-healing.png',
      tagline: 'Release. Rebuild.',
      color: '#B85233',
      aliases: ['healing'],
    },
    images: [
      {
        id: 'img-healing-1',
        url: '/images/journal-healing.png',
        altText: 'The Healing Guided Journal Cover',
        sortOrder: 0,
      },
    ],
    createdAt: new Date('2025-01-05'),
  },
  {
    id: 'prod-confidence',
    title: 'The Confidence / Buugga Kalsoonida',
    slug: 'the-confidence',
    description:
      'Build your self-belief, set your goals, and celebrate your progress. Designed to help you speak up and show up boldly. Available in English & Somali.',
    price: 24.0,
    category: 'Journals',
    imageUrl: '/images/journal-confidence.png',
    isAvailable: true,
    stockQuantity: 130,
    metadata: {
      isJournal: true,
      hasDualEditions: true,
      availableEditions: ['English', 'Somali'],
      defaultEdition: 'English',
      englishTitle: 'The Confidence Journal',
      englishSubtitle: 'Speak boldly. Show up for yourself.',
      englishImage: '/images/journal-confidence.png',
      somaliTitle: 'Buugga Kalsoonida',
      somaliSubtitle: 'Ku kalsoonow naftaada oo muuji kartidaada',
      somaliImage: '/images/journal-confidence.png',
      tagline: 'Speak. Show up.',
      color: '#D49B4B',
      aliases: ['confidence'],
    },
    images: [
      {
        id: 'img-confidence-1',
        url: '/images/journal-confidence.png',
        altText: 'The Confidence Guided Journal Cover',
        sortOrder: 0,
      },
    ],
    createdAt: new Date('2025-01-06'),
  },
  {
    id: 'prod-abundance',
    title: 'The Abundance / Buugga Barwaaqada',
    slug: 'the-abundance',
    description:
      'Cultivate gratitude, attract possibility, and create the life you deserve. A daily compass for aligning thoughts with prosperity. Available in English & Somali.',
    price: 24.0,
    category: 'Journals',
    imageUrl: '/images/journal-abundance.png',
    isAvailable: true,
    stockQuantity: 110,
    metadata: {
      isJournal: true,
      hasDualEditions: true,
      availableEditions: ['English', 'Somali'],
      defaultEdition: 'English',
      englishTitle: 'The Abundance Journal',
      englishSubtitle: 'Create the life you deserve',
      englishImage: '/images/journal-abundance.png',
      somaliTitle: 'Buugga Barwaaqada',
      somaliSubtitle: 'Albaabada u fur kheyrka iyo guusha noloshaada',
      somaliImage: '/images/journal-abundance.png',
      tagline: 'Create what you deserve.',
      color: '#7E6B8F',
      aliases: ['abundance'],
    },
    images: [
      {
        id: 'img-abundance-1',
        url: '/images/journal-abundance.png',
        altText: 'The Abundance Guided Journal Cover',
        sortOrder: 0,
      },
    ],
    createdAt: new Date('2025-01-07'),
  },
  {
    id: 'prod-legacy',
    title: 'The Legacy / Buugga Dhaxalka',
    slug: 'the-legacy',
    description:
      'Write your story, honor your journey, and leave a lasting impact. A keepsake journal for recording ancestral wisdom and aspirations. Available in English & Somali.',
    price: 24.0,
    category: 'Journals',
    imageUrl: '/images/journal-legacy.png',
    isAvailable: true,
    stockQuantity: 95,
    metadata: {
      isJournal: true,
      hasDualEditions: true,
      availableEditions: ['English', 'Somali'],
      defaultEdition: 'English',
      englishTitle: 'The Legacy Journal',
      englishSubtitle: 'Write your next chapter, honor your ancestry',
      englishImage: '/images/journal-legacy.png',
      somaliTitle: 'Buugga Dhaxalka',
      somaliSubtitle: 'Dhaxal reeb oo taariikhdaada gacantaada ku qor',
      somaliImage: '/images/journal-legacy.png',
      tagline: 'Write your next chapter.',
      color: '#EAE5DC',
      aliases: ['legacy'],
    },
    images: [
      {
        id: 'img-legacy-1',
        url: '/images/journal-legacy.png',
        altText: 'The Legacy Guided Journal Cover',
        sortOrder: 0,
      },
    ],
    createdAt: new Date('2025-01-08'),
  },

  // ==========================================
  // 2. NOTEBOOKS
  // ==========================================
  {
    id: 'prod-notebook-mogadishu',
    title: 'Mogadishu City Coordinates Notebook',
    slug: 'mogadishu-coordinates-notebook',
    description:
      'Artisanal hardcover notebook featuring the circular cartographic blueprint of Mogadishu, Somalia (2.0469° N, 45.3186° E). A stunning homage to the City of Peace.',
    price: 20.0,
    category: 'Notebooks',
    imageUrl: '/images/notebook-mogadishu-map.jpg',
    isAvailable: true,
    stockQuantity: 120,
    metadata: {
      tagline: 'City of Peace coordinates.',
      dimensions: 'A5 (5.8" x 8.3") 192 lined ivory pages',
      aliases: ['mogadishu-notebook'],
    },
    images: [
      {
        id: 'img-nb-mogadishu',
        url: '/images/notebook-mogadishu-map.jpg',
        altText: 'Mogadishu Coordinates Notebook Cover',
        sortOrder: 0,
      },
    ],
    createdAt: new Date('2025-01-09'),
  },
  {
    id: 'prod-notebook-swirl',
    title: 'Naag Nool Organic Swirl Notebook',
    slug: 'naag-nool-swirl-notebook',
    description:
      'Minimalist sky blue organic wave hardcover notebook. Premium thick ruled paper designed for unconstrained ideation, daily lists, and creative writing.',
    price: 18.0,
    category: 'Notebooks',
    imageUrl: '/images/notebook-naagnool-blue.jpg',
    isAvailable: true,
    stockQuantity: 100,
    metadata: {
      tagline: 'Unconstrained creative ideation.',
      dimensions: 'A5 (5.8" x 8.3") 192 ruled pages',
      aliases: ['swirl-notebook'],
    },
    images: [
      {
        id: 'img-nb-swirl',
        url: '/images/notebook-naagnool-blue.jpg',
        altText: 'Naag Nool Swirl Notebook Cover',
        sortOrder: 0,
      },
    ],
    createdAt: new Date('2025-01-10'),
  },
  {
    id: 'prod-notebook-studying',
    title: 'Studying is a Privilege Botanical Notebook',
    slug: 'studying-is-a-privilege-notebook',
    description:
      'Forest green luxury hardcover journal embossed with "Because darling, studying is a privilege" and elegant botanical florals. Dedicated to lifelong scholars.',
    price: 20.0,
    category: 'Notebooks',
    imageUrl: '/images/notebook-studying-green.jpg',
    isAvailable: true,
    stockQuantity: 110,
    metadata: {
      tagline: 'Because darling, studying is a privilege.',
      dimensions: 'A5 Hardcover, 240 ivory pages with bookmark',
      aliases: ['studying-notebook'],
    },
    images: [
      {
        id: 'img-nb-studying',
        url: '/images/notebook-studying-green.jpg',
        altText: 'Studying is a Privilege Botanical Notebook Cover',
        sortOrder: 0,
      },
    ],
    createdAt: new Date('2025-01-11'),
  },

  // ==========================================
  // 3. MUGS
  // ==========================================
  {
    id: 'prod-mug-naagnool',
    title: 'Koobka Naag Nool (Artisanal Ceramic Mug)',
    slug: 'koobka-naag-nool-ceramic-mug',
    description:
      'Artisanal ceramic stoneware mug emblazoned with "koobkaan waxa leh NAAG NOOL". Available in Black and White finishes. Dishwasher and microwave safe.',
    price: 22.0,
    category: 'Mugs',
    imageUrl: '/images/mug-naagnool-black.png',
    isAvailable: true,
    stockQuantity: 160,
    metadata: {
      colors: ['Black', 'White'],
      colorImages: {
        Black: '/images/mug-naagnool-black.png',
        White: '/images/mug-naagnool-white.jpg',
      },
      tagline: 'Koobkaan waxa leh Naag Nool.',
      material: 'Ceramic Stoneware (12 oz / 350 ml)',
      aliases: ['koobka-naag-nool', 'naag-nool-mug', 'mug', 'mugs'],
    },
    images: [
      {
        id: 'img-mug-black',
        url: '/images/mug-naagnool-black.png',
        altText: 'Koobka Naag Nool — Black Ceramic Mug',
        sortOrder: 0,
      },
      {
        id: 'img-mug-white',
        url: '/images/mug-naagnool-white.jpg',
        altText: 'Koobka Naag Nool — White Ceramic Mug',
        sortOrder: 1,
      },
    ],
    createdAt: new Date('2025-01-12'),
  },

  // ==========================================
  // 4. BAGS
  // ==========================================
  {
    id: 'prod-canvas-tote',
    title: 'Naag Nool Heritage Canvas Tote',
    slug: 'heritage-canvas-tote-bag',
    description:
      'Heavyweight 100% organic cotton canvas tote featuring reinforced cross-stitch straps and screen-printed empowerment insignia. Ideal for everyday market and library essentials.',
    price: 32.0,
    category: 'Bags',
    imageUrl: '/images/merch-canvas-tote.jpg',
    isAvailable: true,
    stockQuantity: 90,
    metadata: {
      colors: ['Natural Canvas', 'Terracotta'],
      tagline: 'Carry your power.',
      material: '100% Heavyweight Organic Cotton Canvas',
      dimensions: '15" W x 16" H with 11" Shoulder Drop',
      aliases: ['tote-bag', 'canvas-tote'],
    },
    images: [
      {
        id: 'img-tote-1',
        url: '/images/merch-canvas-tote.jpg',
        altText: 'Naag Nool Heritage Canvas Tote Flatlay',
        sortOrder: 0,
      },
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
  const defaultCategories = ['All', 'Journals', 'Notebooks', 'Mugs', 'Bags'];

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
        ...Array.from(
          new Set([
            ...defaultCategories.slice(1),
            ...allDistinctCategories.map((c) => c.category).filter(Boolean),
          ])
        ),
      ];

      return {
        products: products.map((p) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          description: p.description,
          price: Number(p.price),
          category: p.category,
          imageUrl: p.images[0]?.url || `/images/journal-${p.slug.replace('the-', '')}.png`,
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
    filtered = filtered.filter(
      (p) => p.category?.toLowerCase() === options.category?.toLowerCase()
    );
  }

  if (options?.searchQuery && options.searchQuery.trim() !== '') {
    const q = options.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
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
  const normalizedSlug = slug.toLowerCase();

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
        images:
          product.images.length > 0
            ? product.images.map((img) => ({
                id: img.id,
                url: img.url,
                altText: img.altText,
                sortOrder: img.sortOrder,
              }))
            : [
                {
                  id: 'img-1',
                  url: `/images/journal-${product.slug.replace('the-', '')}.png`,
                  altText: product.title,
                  sortOrder: 0,
                },
              ],
        createdAt: product.createdAt,
      };
    }
  } catch {
    // Fallback
  }

  const found = CANONICAL_JOURNALS.find(
    (p) =>
      p.slug === normalizedSlug ||
      p.slug === `the-${normalizedSlug}` ||
      p.slug.replace('the-', '') === normalizedSlug ||
      (Array.isArray(p.metadata?.aliases) && p.metadata?.aliases.includes(normalizedSlug))
  );

  return found || null;
}
