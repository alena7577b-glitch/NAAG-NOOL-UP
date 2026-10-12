'use server';

import { z } from 'zod';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth/server';
import { revalidatePath } from 'next/cache';
import { logger } from '@/lib/logger';

const productSchema = z.object({
  title: z.string().min(2, 'Title is required').max(150),
  slug: z.string().min(2, 'Slug is required').max(150).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().optional(),
  price: z.number().positive('Price must be greater than 0'),
  stockQuantity: z.number().int().min(0, 'Stock cannot be negative'),
  category: z.string().min(2, 'Category is required'),
  isAvailable: z.boolean().default(true),
  metadata: z.record(z.string(), z.any()).optional(),
  imageUrl: z.string().url('Image URL must be valid').optional().or(z.literal('')),
  imageUrls: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  material: z.string().optional(),
  dimensions: z.string().optional(),
});

export type AdminProductInput = z.infer<typeof productSchema>;

export async function getAdminProducts() {
  await requireAdmin();
  return db.product.findMany({
    include: {
      images: {
        orderBy: { sortOrder: 'asc' },
      },
      _count: {
        select: { orderItems: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createProductAction(input: AdminProductInput) {
  const admin = await requireAdmin();

  const parsed = productSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || 'Invalid product input',
    };
  }

  const {
    title,
    slug,
    description,
    price,
    stockQuantity,
    category,
    isAvailable,
    metadata,
    imageUrl,
    imageUrls,
    colors,
    material,
    dimensions,
  } = parsed.data;

  // Check unique slug
  const existing = await db.product.findUnique({
    where: { slug },
  });

  if (existing) {
    return {
      success: false,
      error: `A product with slug "${slug}" already exists.`,
    };
  }

  const allImages: string[] = [];
  if (imageUrl && imageUrl.trim()) allImages.push(imageUrl.trim());
  if (imageUrls && Array.isArray(imageUrls)) {
    for (const u of imageUrls) {
      if (u && u.trim() && !allImages.includes(u.trim())) allImages.push(u.trim());
    }
  }

  const mergedMetadata = {
    ...(metadata || {}),
    ...(colors && colors.length > 0 ? { colors } : {}),
    ...(material ? { material } : {}),
    ...(dimensions ? { dimensions } : {}),
  };

  try {
    const product = await db.product.create({
      data: {
        title,
        slug,
        description: description || null,
        price,
        stockQuantity,
        category,
        isAvailable,
        metadata: Object.keys(mergedMetadata).length > 0 ? mergedMetadata : undefined,
        images:
          allImages.length > 0
            ? {
                create: allImages.map((u, i) => ({
                  url: u,
                  altText: `${title} - Image ${i + 1}`,
                  sortOrder: i,
                })),
              }
            : undefined,
      },
    });

    logger.info(`Product created: ${product.title} (${product.slug}) by admin ${admin.email}`);
    revalidatePath('/shop');
    revalidatePath('/admin/products');

    return { success: true, product };
  } catch (error: unknown) {
    logger.error('Failed to create product', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return { success: false, error: 'Database error creating product.' };
  }
}

export async function updateProductAction(id: string, input: Partial<AdminProductInput>) {
  const admin = await requireAdmin();

  const existing = await db.product.findUnique({ where: { id } });
  if (!existing) {
    return { success: false, error: 'Product not found.' };
  }

  try {
    const dataToUpdate: any = {};
    if (input.title !== undefined) dataToUpdate.title = input.title;
    if (input.slug !== undefined) dataToUpdate.slug = input.slug;
    if (input.description !== undefined) dataToUpdate.description = input.description;
    if (input.price !== undefined) dataToUpdate.price = input.price;
    if (input.stockQuantity !== undefined) dataToUpdate.stockQuantity = input.stockQuantity;
    if (input.category !== undefined) dataToUpdate.category = input.category;
    if (input.isAvailable !== undefined) dataToUpdate.isAvailable = input.isAvailable;

    const mergedMetadata = {
      ...((existing.metadata as Record<string, any>) || {}),
      ...((input.metadata as Record<string, any>) || {}),
      ...(input.colors !== undefined ? { colors: input.colors } : {}),
      ...(input.material !== undefined ? { material: input.material } : {}),
      ...(input.dimensions !== undefined ? { dimensions: input.dimensions } : {}),
    };
    dataToUpdate.metadata = mergedMetadata;

    const updated = await db.product.update({
      where: { id },
      data: dataToUpdate,
    });

    // Handle image updates
    const updatedImages: string[] = [];
    if (input.imageUrl && input.imageUrl.trim()) updatedImages.push(input.imageUrl.trim());
    if (input.imageUrls && Array.isArray(input.imageUrls)) {
      for (const u of input.imageUrls) {
        if (u && u.trim() && !updatedImages.includes(u.trim())) updatedImages.push(u.trim());
      }
    }

    if (updatedImages.length > 0) {
      await db.productImage.deleteMany({ where: { productId: id } });
      await db.productImage.createMany({
        data: updatedImages.map((url, idx) => ({
          productId: id,
          url,
          altText: `${updated.title} - Image ${idx + 1}`,
          sortOrder: idx,
        })),
      });
    }

    logger.info(`Product updated: ${updated.slug} by admin ${admin.email}`);
    revalidatePath('/shop');
    revalidatePath(`/product/${updated.slug}`);
    revalidatePath('/admin/products');

    return { success: true, product: updated };
  } catch (error: unknown) {
    logger.error('Failed to update product', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return { success: false, error: 'Failed to update product.' };
  }
}

export async function toggleProductAvailabilityAction(id: string, isAvailable: boolean) {
  const admin = await requireAdmin();

  try {
    const updated = await db.product.update({
      where: { id },
      data: { isAvailable },
    });

    logger.info(`Product availability toggled: ${updated.slug} (${isAvailable}) by admin ${admin.email}`);
    revalidatePath('/shop');
    revalidatePath('/admin/products');

    return { success: true, isAvailable: updated.isAvailable };
  } catch {
    return { success: false, error: 'Failed to toggle availability.' };
  }
}

export async function deleteProductAction(id: string) {
  const admin = await requireAdmin();

  try {
    // If product has been ordered, deactivate rather than hard delete to preserve historical integrity
    const orderCount = await db.orderItem.count({ where: { productId: id } });
    if (orderCount > 0) {
      await db.product.update({
        where: { id },
        data: { isAvailable: false },
      });
      logger.info(`Product archived (active=false): ${id} due to existing orders`);
      revalidatePath('/shop');
      revalidatePath('/admin/products');
      return { success: true, archived: true };
    }

    await db.product.delete({ where: { id } });
    logger.info(`Product deleted: ${id} by admin ${admin.email}`);
    revalidatePath('/shop');
    revalidatePath('/admin/products');

    return { success: true, deleted: true };
  } catch {
    return { success: false, error: 'Failed to delete product.' };
  }
}
