import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getPaymentProvider, PaymentProvider, StripePaymentProvider, SoomarPayProvider } from '@/services/payment';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const headersList: Record<string, string> = {};

    req.headers.forEach((value, key) => {
      headersList[key.toLowerCase()] = value;
    });

    let provider: PaymentProvider;
    if (headersList['soomarpay-signature'] || headersList['soomarpay-event']) {
      provider = new SoomarPayProvider();
    } else if (headersList['stripe-signature']) {
      provider = new StripePaymentProvider();
    } else {
      provider = getPaymentProvider();
    }

    const webhookResult = await provider.handleWebhook(rawBody, headersList);

    if (!webhookResult.handled) {
      logger.warn('Payment webhook validation failed', {
        headers: Object.keys(headersList),
      });
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    const { orderId, status } = webhookResult;

    if (!orderId) {
      // Event acknowledged but no orderId associated
      return NextResponse.json({ received: true });
    }

    // Idempotency check: Look up current order state (by ID or orderNumber)
    const existingOrder = await db.order.findFirst({
      where: {
        OR: [{ id: orderId }, { orderNumber: orderId }],
      },
      include: { payments: true },
    });

    if (!existingOrder) {
      logger.warn(`Webhook received for non-existent order: ${orderId}`);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // If order is already PAID, return 200 idempotently
    if (existingOrder.status === 'PAID') {
      return NextResponse.json({ received: true, alreadyProcessed: true });
    }

    if (status === 'PAID') {
      await db.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: orderId },
          data: { status: 'PAID' },
        });

        const activePayment = existingOrder.payments[0];
        if (activePayment) {
          await tx.payment.update({
            where: { id: activePayment.id },
            data: {
              status: 'VERIFIED',
              metadata: {
                verifiedAt: new Date().toISOString(),
                provider: provider.providerName,
              },
            },
          });
        }
      });

      logger.info(`Order ${existingOrder.orderNumber} successfully marked PAID via webhook`);
      return NextResponse.json({ received: true, status: 'PAID' });
    }

    if (status === 'FAILED') {
      await db.$transaction(async (tx) => {
        const activePayment = existingOrder.payments[0];
        if (activePayment) {
          await tx.payment.update({
            where: { id: activePayment.id },
            data: {
              status: 'FAILED',
              metadata: {
                failedAt: new Date().toISOString(),
                provider: provider.providerName,
              },
            },
          });
        }
      });

      logger.warn(`Order ${existingOrder.orderNumber} payment failed via webhook`);
      return NextResponse.json({ received: true, status: 'FAILED' });
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    logger.error('Unhandled error in payment webhook handler', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return NextResponse.json(
      { error: 'Internal server error processing webhook' },
      { status: 500 }
    );
  }
}
