import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  getPaymentProvider,
  PaymentProvider,
  StripePaymentProvider,
  PayPalPaymentProvider,
} from '@/services/payment';
import { emailService } from '@/services/email';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const headersList: Record<string, string> = {};

    req.headers.forEach((value, key) => {
      headersList[key.toLowerCase()] = value;
    });

    let provider: PaymentProvider;
    if (headersList['paypal-auth-algo'] || headersList['paypal-transmission-id']) {
      provider = new PayPalPaymentProvider();
    } else if (headersList['stripe-signature']) {
      provider = new StripePaymentProvider();
    } else {
      provider = getPaymentProvider();
    }

    const webhookResult = await provider.handleWebhook(rawBody, headersList);

    if (!webhookResult.handled) {
      logger.warn('Payment webhook signature or payload validation failed', {
        provider: provider.providerName,
        error: webhookResult.error || 'Verification failed',
      });
      return NextResponse.json(
        { error: webhookResult.error || 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    const { orderId: orderRef, status, amount, currency, transactionId } = webhookResult;

    if (!orderRef || typeof orderRef !== 'string' || orderRef.trim() === '') {
      logger.warn('Webhook acknowledged but missing valid order identifier');
      return NextResponse.json({ received: true, warning: 'No order identifier provided' });
    }

    const validatedRef = orderRef.trim();

    // 1. Look up existing order by unique identifier (UUID or human-readable orderNumber)
    const existingOrder = await db.order.findFirst({
      where: {
        OR: [{ id: validatedRef }, { orderNumber: validatedRef }],
      },
      include: {
        payments: true,
        items: {
          include: { product: true },
        },
      },
    });

    if (!existingOrder) {
      logger.warn(`Webhook received for non-existent order reference: ${validatedRef}`);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // 2. Validate Amount and Currency if supplied by gateway
    if (amount !== undefined) {
      const expectedAmount = Number(existingOrder.totalAmount);
      // Allow 0.05 tolerance for minor rounding differences across payment networks
      if (Math.abs(amount - expectedAmount) > 0.05) {
        logger.error(
          `Webhook amount mismatch for order ${existingOrder.orderNumber}: expected ${expectedAmount}, received ${amount}`
        );
        return NextResponse.json(
          { error: 'Payment amount mismatch detected' },
          { status: 400 }
        );
      }
    }

    if (currency && currency.toUpperCase() !== 'USD') {
      logger.warn(
        `Webhook currency differs from order currency for ${existingOrder.orderNumber}: ${currency}`
      );
    }

    // 3. Idempotency Check: if order is already PAID, return 200 without duplicate mutations
    if (existingOrder.status === 'PAID') {
      logger.info(
        `Idempotent webhook: Order ${existingOrder.orderNumber} is already marked as PAID`
      );
      return NextResponse.json({ received: true, alreadyProcessed: true });
    }

    // 4. Process Payment Success (PAID)
    if (status === 'PAID') {
      await db.$transaction(async (tx) => {
        // ALWAYS update using actual database primary key existingOrder.id
        await tx.order.update({
          where: { id: existingOrder.id },
          data: { status: 'PAID' },
        });

        const activePayment = existingOrder.payments[0];
        if (activePayment) {
          await tx.payment.update({
            where: { id: activePayment.id },
            data: {
              status: 'VERIFIED',
              transactionId: transactionId || activePayment.transactionId,
              metadata: {
                ...(typeof activePayment.metadata === 'object' && activePayment.metadata !== null
                  ? (activePayment.metadata as Record<string, unknown>)
                  : {}),
                verifiedAt: new Date().toISOString(),
                provider: provider.providerName,
                transactionId: transactionId || undefined,
              },
            },
          });
        }
      });

      logger.info(
        `Order ${existingOrder.orderNumber} (ID: ${existingOrder.id}) successfully marked PAID via ${provider.providerName}`
      );

      // Trigger transactional order confirmation email
      emailService
        .sendOrderConfirmation({
          to: existingOrder.customerEmail,
          orderNumber: existingOrder.orderNumber,
          customerName: existingOrder.customerName,
          totalAmount: Number(existingOrder.totalAmount),
          items: existingOrder.items.map((item) => ({
            title: item.product?.title || 'Bespoke Journal',
            quantity: item.quantity,
            price: Number(item.unitPrice),
          })),
        })
        .catch((err) => {
          logger.error(`Failed to send order confirmation email for ${existingOrder.orderNumber}:`, err);
        });

      return NextResponse.json({ received: true, status: 'PAID', orderId: existingOrder.id });
    }

    // 5. Process Payment Failure (FAILED)
    if (status === 'FAILED') {
      await db.$transaction(async (tx) => {
        // Mark order CANCELLED and restore reserved inventory
        await tx.order.update({
          where: { id: existingOrder.id },
          data: { status: 'CANCELLED' },
        });

        // Replenish stock for cancelled order items
        for (const item of existingOrder.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stockQuantity: {
                increment: item.quantity,
              },
            },
          });
        }

        const activePayment = existingOrder.payments[0];
        if (activePayment) {
          await tx.payment.update({
            where: { id: activePayment.id },
            data: {
              status: 'FAILED',
              metadata: {
                ...(typeof activePayment.metadata === 'object' && activePayment.metadata !== null
                  ? (activePayment.metadata as Record<string, unknown>)
                  : {}),
                failedAt: new Date().toISOString(),
                provider: provider.providerName,
              },
            },
          });
        }
      });

      logger.warn(
        `Order ${existingOrder.orderNumber} (ID: ${existingOrder.id}) payment marked FAILED; stock released`
      );
      return NextResponse.json({ received: true, status: 'FAILED', orderId: existingOrder.id });
    }

    return NextResponse.json({ received: true, status: 'UNHANDLED_EVENT' });
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
