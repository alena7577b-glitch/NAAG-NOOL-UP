'use server';

import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth/server';
import { logger } from '@/lib/logger';

export interface AdminNotification {
  id: string;
  type: 'DONATION' | 'ORDER' | 'INQUIRY' | 'LOW_STOCK' | 'COMMUNITY';
  title: string;
  description: string;
  href: string;
  createdAt: string;
  timeAgo: string;
  unread: boolean;
}

export interface AdminNotificationsResponse {
  notifications: AdminNotification[];
  unreadCount: number;
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay === 1) return 'Yesterday';
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export async function getAdminNotifications(): Promise<AdminNotificationsResponse> {
  await requireAdmin();

  try {
    const [
      unreadInquiries,
      recentMerchOrders,
      recentDonations,
      lowStockProducts,
      recentSignups,
    ] = await Promise.all([
      // 1. Unread Contact Inquiries
      db.contactSubmission.findMany({
        where: { status: 'UNREAD' },
        take: 5,
        orderBy: { createdAt: 'desc' },
      }).catch(() => []),

      // 2. Recent Merchandise Orders (not donations)
      db.order.findMany({
        where: {
          orderNumber: { not: { startsWith: 'DONATE' } },
        },
        take: 5,
        orderBy: { createdAt: 'desc' },
      }).catch(() => []),

      // 3. Recent Ayeeyo Koris Donations
      db.order.findMany({
        where: {
          orderNumber: { startsWith: 'DONATE' },
        },
        take: 5,
        orderBy: { createdAt: 'desc' },
      }).catch(() => []),

      // 4. Low stock inventory warnings
      db.product.findMany({
        where: {
          stockQuantity: { lte: 5 },
        },
        take: 4,
        select: {
          id: true,
          title: true,
          stockQuantity: true,
          slug: true,
          updatedAt: true,
        },
      }).catch(() => []),

      // 5. Recent community signups
      db.communitySignup.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
      }).catch(() => []),
    ]);

    const notifications: AdminNotification[] = [];

    // Add unread inquiries
    for (const inq of unreadInquiries) {
      notifications.push({
        id: `inq_${inq.id}`,
        type: 'INQUIRY',
        title: `New Inquiry: ${inq.subject}`,
        description: `From ${inq.name} (${inq.email})`,
        href: '/admin/inquiries',
        createdAt: inq.createdAt.toISOString(),
        timeAgo: getTimeAgo(inq.createdAt),
        unread: true,
      });
    }

    // Add recent merchandise orders
    for (const ord of recentMerchOrders) {
      const isUnfulfilled = ord.status === 'PAID' || ord.status === 'PENDING_PAYMENT';
      notifications.push({
        id: `ord_${ord.id}`,
        type: 'ORDER',
        title: `Order ${ord.orderNumber}`,
        description: `$${Number(ord.totalAmount).toFixed(2)} by ${ord.customerName} • ${ord.status.replace(/_/g, ' ')}`,
        href: '/admin/orders',
        createdAt: ord.createdAt.toISOString(),
        timeAgo: getTimeAgo(ord.createdAt),
        unread: isUnfulfilled,
      });
    }

    // Add recent Ayeeyo Koris donations
    for (const don of recentDonations) {
      notifications.push({
        id: `don_${don.id}`,
        type: 'DONATION',
        title: `Donation Pledge: $${Number(don.totalAmount).toFixed(2)}`,
        description: `${don.customerName} for Ayeeyo Koris Children (${don.status})`,
        href: '/admin/donations',
        createdAt: don.createdAt.toISOString(),
        timeAgo: getTimeAgo(don.createdAt),
        unread: don.status === 'PENDING_PAYMENT',
      });
    }

    // Add low stock warnings
    for (const prod of lowStockProducts) {
      notifications.push({
        id: `stock_${prod.id}`,
        type: 'LOW_STOCK',
        title: `Low Stock: ${prod.title}`,
        description: `Only ${prod.stockQuantity} remaining in active stock inventory`,
        href: '/admin/inventory',
        createdAt: prod.updatedAt.toISOString(),
        timeAgo: getTimeAgo(prod.updatedAt),
        unread: true,
      });
    }

    // Add recent signups
    for (const sig of recentSignups) {
      notifications.push({
        id: `sig_${sig.id}`,
        type: 'COMMUNITY',
        title: `New Community Member`,
        description: `${sig.fullName} (${sig.email}) joined the movement`,
        href: '/admin/community',
        createdAt: sig.createdAt.toISOString(),
        timeAgo: getTimeAgo(sig.createdAt),
        unread: false,
      });
    }

    // Sort all chronologically descending
    notifications.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const unreadCount = notifications.filter((n) => n.unread).length;

    return {
      notifications: notifications.slice(0, 15),
      unreadCount,
    };
  } catch (err: unknown) {
    logger.error('getAdminNotifications error:', err);
    return { notifications: [], unreadCount: 0 };
  }
}
