'use server';

import { db } from '@/lib/db';
import { getPaymentProvider } from '@/services/payment';
import { z } from 'zod';
import { logger } from '@/lib/logger';

const donationSchema = z.object({
  donorName: z.string().min(2, 'Please enter your name (at least 2 characters)').max(100),
  donorEmail: z.string().email('Please enter a valid email address'),
  amount: z.number().min(5, 'Donation must be at least $5').max(10000),
  paymentMethod: z.enum(['CARD', 'PAYPAL']).default('CARD'),
});

export type DonationInput = z.infer<typeof donationSchema>;

export interface DonationResult {
  success: boolean;
  orderNumber?: string;
  paymentUrl?: string;
  error?: string;
}

export async function createDonationAction(input: DonationInput): Promise<DonationResult> {
  try {
    const parsed = donationSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || 'Invalid donation information provided.',
      };
    }

    const { donorName, donorEmail, amount, paymentMethod } = parsed.data;
    const orderNumber = `DONATE-AK-${Date.now().toString().slice(-6)}`;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://naagnoolup.com';

    // 1. Create Order record in database for accounting, audit trail & receipts
    const order = await db.order.create({
      data: {
        orderNumber,
        totalAmount: amount,
        status: 'PENDING_PAYMENT',
        customerName: donorName,
        customerEmail: donorEmail,
        shippingAddress: {
          type: 'DONATION',
          initiative: 'Ayeeyo Koris Children Educational Scholarship',
          donorName,
          donorEmail,
          notes: 'Direct educational scholarship, textbooks, and nutrition for Somali children raised by grandmothers',
        },
      },
    });

    // 2. Select Payment Provider (Stripe or PayPal)
    const provider = getPaymentProvider(paymentMethod);

    // 3. Create Payment record linked to this donation order
    await db.payment.create({
      data: {
        orderId: order.id,
        provider: provider.providerName,
        amount,
        status: 'INITIATED',
        rawPayload: {
          type: 'DONATION',
          initiative: 'Ayeeyo Koris Children',
          donorName,
          donorEmail,
          paymentMethod,
        },
      },
    });

    // 4. Initiate real checkout session with Stripe or PayPal
    const paymentResult = await provider.initiatePayment({
      orderId: order.id,
      orderNumber: order.orderNumber,
      amount,
      currency: 'USD',
      customerName: donorName,
      customerEmail: donorEmail,
      paymentMethod,
      returnUrl: `${siteUrl}/ayeyo-koris?orderNumber=${encodeURIComponent(orderNumber)}&success=true&amount=${amount}&name=${encodeURIComponent(donorName)}&provider=${paymentMethod.toLowerCase()}`,
    });

    if (!paymentResult.success || !paymentResult.paymentUrl) {
      logger.error('Donation payment initiation error:', paymentResult.errorMessage);
      return {
        success: false,
        error: paymentResult.errorMessage || 'Unable to connect to secure payment gateway. Please try again.',
      };
    }

    return {
      success: true,
      orderNumber,
      paymentUrl: paymentResult.paymentUrl,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An error occurred while creating your donation pledge.';
    logger.error('createDonationAction unexpected exception:', message);
    return {
      success: false,
      error: message,
    };
  }
}
