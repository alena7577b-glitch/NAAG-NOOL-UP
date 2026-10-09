'use server';

import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth/server';
import { OrderStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { logger } from '@/lib/logger';

export async function getAdminOrders(options?: {
  status?: OrderStatus;
  search?: string;
}) {
  await requireAdmin();

  const where: any = {};

  if (options?.status) {
    where.status = options.status;
  }

  if (options?.search && options.search.trim() !== '') {
    const q = options.search.trim();
    where.OR = [
      { orderNumber: { contains: q, mode: 'insensitive' } },
      { customerEmail: { contains: q, mode: 'insensitive' } },
      { customerName: { contains: q, mode: 'insensitive' } },
    ];
  }

  return db.order.findMany({
    where,
    include: {
      items: {
        include: {
          product: {
            select: {
              title: true,
              slug: true,
            },
          },
        },
      },
      payments: true,
      user: {
        select: {
          id: true,
          email: true,
          fullName: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateOrderStatusAction(orderId: string, status: OrderStatus) {
  const admin = await requireAdmin();

  try {
    const updated = await db.order.update({
      where: { id: orderId },
      data: { status },
    });

    logger.info(`Order ${updated.orderNumber} status updated to ${status} by admin ${admin.email}`);
    revalidatePath('/admin/orders');
    revalidatePath('/account/orders');

    return { success: true, order: updated };
  } catch (error: unknown) {
    logger.error('Failed to update order status', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return { success: false, error: 'Failed to update order status.' };
  }
}

export async function getOrderDetails(orderId: string) {
  await requireAdmin();

  return db.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      payments: true,
      user: true,
    },
  });
}
