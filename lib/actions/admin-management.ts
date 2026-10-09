'use server';

import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth/server';
import { logger } from '@/lib/logger';
import { ContactStatus, PostStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

// ==========================================
// 1. CUSTOMERS
// ==========================================
export async function getAdminCustomers() {
  await requireAdmin();

  const users = await db.user.findMany({
    where: { role: 'CUSTOMER' },
    include: {
      orders: {
        select: {
          id: true,
          totalAmount: true,
          status: true,
          createdAt: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return users.map((u) => {
    const totalSpent = u.orders
      .filter((o) => o.status !== 'CANCELLED' && o.status !== 'REFUNDED')
      .reduce((sum, o) => sum + Number(o.totalAmount), 0);

    const latestOrder = u.orders.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    )[0];

    return {
      id: u.id,
      email: u.email,
      fullName: u.fullName || 'Valued Patron',
      role: u.role,
      totalOrders: u.orders.length,
      totalSpent,
      lastOrderDate: latestOrder ? latestOrder.createdAt.toISOString() : null,
      createdAt: u.createdAt.toISOString(),
    };
  });
}

// ==========================================
// 2. INVENTORY
// ==========================================
export async function getAdminInventory() {
  await requireAdmin();

  const products = await db.product.findMany({
    include: {
      images: {
        orderBy: { sortOrder: 'asc' },
        take: 1,
      },
    },
    orderBy: { title: 'asc' },
  });

  return products.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    category: p.category,
    price: Number(p.price),
    stockQuantity: p.stockQuantity,
    isAvailable: p.isAvailable,
    imageUrl: p.images[0]?.url || '/images/book-cover-awakening.png',
    updatedAt: p.updatedAt.toISOString(),
  }));
}

export async function updateInventoryStockAction(
  productId: string,
  stockQuantity: number,
  isAvailable: boolean
) {
  try {
    await requireAdmin();

    const updated = await db.product.update({
      where: { id: productId },
      data: {
        stockQuantity: Math.max(0, stockQuantity),
        isAvailable,
      },
    });

    revalidatePath('/admin/inventory');
    revalidatePath('/admin/products');
    revalidatePath('/shop');

    return { success: true, product: updated };
  } catch (err: unknown) {
    logger.error('Failed to update inventory stock:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unable to update inventory.',
    };
  }
}

// ==========================================
// 3. COMMUNITY SIGNUPS
// ==========================================
export async function getAdminCommunitySignups() {
  await requireAdmin();

  const signups = await db.communitySignup.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return signups.map((s) => ({
    id: s.id,
    fullName: s.fullName,
    email: s.email,
    marketingConsent: s.marketingConsent,
    createdAt: s.createdAt.toISOString(),
  }));
}

// ==========================================
// 4. CONTACT INQUIRIES
// ==========================================
export async function getAdminInquiries() {
  await requireAdmin();

  const inquiries = await db.contactSubmission.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return inquiries.map((i) => ({
    id: i.id,
    name: i.name,
    email: i.email,
    subject: i.subject,
    message: i.message,
    status: i.status,
    createdAt: i.createdAt.toISOString(),
    updatedAt: i.updatedAt.toISOString(),
  }));
}

export async function updateInquiryStatusAction(
  inquiryId: string,
  status: ContactStatus
) {
  try {
    await requireAdmin();

    await db.contactSubmission.update({
      where: { id: inquiryId },
      data: { status },
    });

    revalidatePath('/admin/inquiries');
    return { success: true };
  } catch (err: unknown) {
    logger.error('Failed to update inquiry status:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unable to update status.',
    };
  }
}

// ==========================================
// 5. CONTENT PAGES
// ==========================================
export async function getAdminContentPages() {
  await requireAdmin();

  const pages = await db.contentPage.findMany({
    orderBy: { title: 'asc' },
  });

  return pages.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    locale: p.locale,
    updatedAt: p.updatedAt.toISOString(),
  }));
}

// ==========================================
// 6. BLOG POSTS
// ==========================================
export async function getAdminBlogPosts() {
  await requireAdmin();

  const posts = await db.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return posts.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt || '',
    content: p.content,
    featuredImage: p.featuredImage || '/images/book-cover-awakening.png',
    status: p.status,
    publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));
}

export async function createBlogPostAction(input: {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  status: PostStatus;
}) {
  try {
    await requireAdmin();

    const post = await db.blogPost.create({
      data: {
        title: input.title,
        slug: input.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        content: input.content,
        excerpt: input.excerpt,
        featuredImage: input.featuredImage,
        status: input.status,
        publishedAt: input.status === 'PUBLISHED' ? new Date() : null,
      },
    });

    revalidatePath('/admin/blog');
    revalidatePath('/blog');
    return { success: true, post };
  } catch (err: unknown) {
    logger.error('Failed to create blog post:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unable to publish post.',
    };
  }
}

export async function updateBlogPostStatusAction(
  postId: string,
  status: PostStatus
) {
  try {
    await requireAdmin();

    await db.blogPost.update({
      where: { id: postId },
      data: {
        status,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
      },
    });

    revalidatePath('/admin/blog');
    revalidatePath('/blog');
    return { success: true };
  } catch (err: unknown) {
    logger.error('Failed to update blog status:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unable to update post status.',
    };
  }
}
