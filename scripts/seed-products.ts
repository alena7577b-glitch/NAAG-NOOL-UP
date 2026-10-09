import 'dotenv/config';
import { db } from '../lib/db';
import { CANONICAL_JOURNALS } from '../lib/products';

async function seed() {
  console.log('Seeding official canonical journals into database...');

  for (const journal of CANONICAL_JOURNALS) {
    const existing = await db.product.findFirst({
      where: {
        OR: [{ id: journal.id }, { slug: journal.slug }],
      },
    });

    if (!existing) {
      await db.product.create({
        data: {
          id: journal.id,
          title: journal.title,
          slug: journal.slug,
          description: journal.description,
          price: journal.price,
          category: journal.category || 'Journal',
          stockQuantity: journal.stockQuantity,
          isAvailable: journal.isAvailable,
          metadata: journal.metadata as any,
          images: {
            create: journal.images.map((img) => ({
              id: img.id,
              url: img.url,
              altText: img.altText,
              sortOrder: img.sortOrder,
            })),
          },
        },
      });
      console.log(`Created: ${journal.title} (${journal.id})`);
    } else {
      console.log(`Already exists: ${journal.title} (${existing.id})`);
    }
  }

  const count = await db.product.count();
  console.log(`Total products in database: ${count}`);
}

seed()
  .then(() => {
    console.log('Seeding completed successfully!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
  });
