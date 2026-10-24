'use server';

import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth/server';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { logger } from '@/lib/logger';
import { z } from 'zod';

export interface AdminDonationRecord {
  id: string;
  orderNumber: string;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  amount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  initiative: string;
  donorNotes?: string;
  adminNotes?: string;
  payments: Array<{
    id: string;
    provider: string;
    status: PaymentStatus;
    amount: number;
    transactionId?: string | null;
    createdAt: string;
  }>;
}

export interface AdminDonationsSummary {
  totalRaised: number;
  totalPledged: number;
  totalDonorsCount: number;
  completedDonationsCount: number;
  pendingDonationsCount: number;
  avgDonationAmount: number;
  impactKitsFunded: number;
  impactScholarshipsFunded: number;
}

export interface AdminDonationsResponse {
  donations: AdminDonationRecord[];
  summary: AdminDonationsSummary;
}

export async function getAdminDonations(options?: {
  status?: string;
  search?: string;
}): Promise<AdminDonationsResponse> {
  await requireAdmin();

  // Find all orders that are donations
  const rawOrders = await db.order.findMany({
    where: {
      orderNumber: { startsWith: 'DONATE' },
    },
    include: {
      payments: {
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Calculate high-level executive metrics across all donation records
  let totalRaised = 0;
  let totalPledged = 0;
  let completedCount = 0;
  let pendingCount = 0;
  const uniqueEmails = new Set<string>();

  for (const o of rawOrders) {
    const amt = Number(o.totalAmount || 0);
    if (o.customerEmail) {
      uniqueEmails.add(o.customerEmail.toLowerCase().trim());
    }

    if (o.status === 'PAID') {
      totalRaised += amt;
      completedCount++;
    } else if (o.status === 'PENDING_PAYMENT') {
      totalPledged += amt;
      pendingCount++;
    }
  }

  const avgDonationAmount = completedCount > 0 ? totalRaised / completedCount : 0;
  const impactKitsFunded = Math.floor(totalRaised / 50); // $50 = School kit + books
  const impactScholarshipsFunded = Math.floor(totalRaised / 250); // $250 = Full term scholarship

  // Apply optional filtering for the returned records
  let filtered = rawOrders;

  if (options?.status && options.status !== 'ALL') {
    filtered = filtered.filter((o) => o.status === options.status);
  }

  if (options?.search && options.search.trim() !== '') {
    const q = options.search.toLowerCase().trim();
    filtered = filtered.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q)
    );
  }

  const serializedDonations: AdminDonationRecord[] = filtered.map((o) => {
    const shipAddr = (o.shippingAddress as Record<string, unknown>) || {};
    return {
      id: o.id,
      orderNumber: o.orderNumber,
      donorName: o.customerName || (shipAddr.donorName as string) || 'Anonymous Donor',
      donorEmail: o.customerEmail || (shipAddr.donorEmail as string) || '',
      donorPhone: o.customerPhone || '',
      amount: Number(o.totalAmount),
      status: o.status,
      createdAt: o.createdAt.toISOString(),
      updatedAt: o.updatedAt.toISOString(),
      initiative: (shipAddr.initiative as string) || 'Ayeeyo Koris Children Educational Scholarship',
      donorNotes: (shipAddr.notes as string) || '',
      adminNotes: (shipAddr.adminNotes as string) || '',
      payments: o.payments.map((p) => ({
        id: p.id,
        provider: p.provider,
        status: p.status,
        amount: Number(p.amount),
        transactionId: p.transactionId,
        createdAt: p.createdAt.toISOString(),
      })),
    };
  });

  return {
    donations: serializedDonations,
    summary: {
      totalRaised,
      totalPledged,
      totalDonorsCount: uniqueEmails.size,
      completedDonationsCount: completedCount,
      pendingDonationsCount: pendingCount,
      avgDonationAmount,
      impactKitsFunded,
      impactScholarshipsFunded,
    },
  };
}

export async function updateDonationStatusAction(
  orderId: string,
  newStatus: OrderStatus,
  adminNotes?: string
) {
  const admin = await requireAdmin();

  try {
    const existing = await db.order.findUnique({
      where: { id: orderId },
    });

    if (!existing) {
      return { success: false, error: 'Donation order not found.' };
    }

    const currentShipping = (existing.shippingAddress as Record<string, unknown>) || {};
    const updatedShipping = {
      ...currentShipping,
      ...(adminNotes !== undefined ? { adminNotes } : {}),
      statusLastChangedBy: admin.email,
      statusLastChangedAt: new Date().toISOString(),
    };

    // Corresponding payment status
    let paymentStatus: PaymentStatus = PaymentStatus.INITIATED;
    if (newStatus === 'PAID') paymentStatus = PaymentStatus.VERIFIED;
    else if (newStatus === 'CANCELLED') paymentStatus = PaymentStatus.FAILED;

    await db.$transaction([
      db.order.update({
        where: { id: orderId },
        data: {
          status: newStatus,
          shippingAddress: updatedShipping,
        },
      }),
      db.payment.updateMany({
        where: { orderId },
        data: {
          status: paymentStatus,
        },
      }),
    ]);

    revalidatePath('/admin/donations');
    revalidatePath('/admin');
    revalidatePath('/ayeyo-koris');

    logger.info(`Donation ${existing.orderNumber} status updated to ${newStatus} by admin ${admin.email}`);
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update donation status.';
    logger.error('updateDonationStatusAction error:', msg);
    return { success: false, error: msg };
  }
}

const manualDonationSchema = z.object({
  donorName: z.string().min(2, 'Name is required').max(100),
  donorEmail: z.string().email('Valid email is required'),
  amount: z.number().min(1, 'Amount must be at least $1'),
  paymentMethod: z.string().min(1),
  status: z.enum(['PAID', 'PENDING_PAYMENT']).default('PAID'),
  donorNotes: z.string().optional(),
  adminNotes: z.string().optional(),
});

export type ManualDonationInput = z.infer<typeof manualDonationSchema>;

export async function createManualDonationAction(input: ManualDonationInput) {
  const admin = await requireAdmin();

  const parsed = manualDonationSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || 'Invalid manual donation input.',
    };
  }

  const { donorName, donorEmail, amount, paymentMethod, status, donorNotes, adminNotes } = parsed.data;
  const orderNumber = `DONATE-MANUAL-${Date.now().toString().slice(-6)}`;

  try {
    const order = await db.order.create({
      data: {
        orderNumber,
        totalAmount: amount,
        status: status as OrderStatus,
        customerName: donorName,
        customerEmail: donorEmail,
        shippingAddress: {
          type: 'DONATION',
          channel: 'MANUAL_ENTRY',
          initiative: 'Ayeeyo Koris Children Educational Scholarship',
          donorName,
          donorEmail,
          paymentMethod,
          notes: donorNotes || 'Direct community contribution',
          adminNotes: adminNotes || `Manually recorded by ${admin.fullName || admin.email}`,
          recordedBy: admin.email,
          recordedAt: new Date().toISOString(),
        },
      },
    });

    await db.payment.create({
      data: {
        orderId: order.id,
        provider: paymentMethod,
        amount,
        status: status === 'PAID' ? PaymentStatus.VERIFIED : PaymentStatus.INITIATED,
        metadata: {
          type: 'DONATION',
          channel: 'MANUAL_ENTRY',
          donorName,
          donorEmail,
          paymentMethod,
          recordedBy: admin.email,
        },
      },
    });

    revalidatePath('/admin/donations');
    revalidatePath('/admin');
    revalidatePath('/ayeyo-koris');

    logger.info(`Manual donation ${orderNumber} for $${amount} recorded by admin ${admin.email}`);
    return { success: true, orderNumber };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to record manual donation.';
    logger.error('createManualDonationAction error:', msg);
    return { success: false, error: msg };
  }
}
