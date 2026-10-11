'use server';

import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/server';
import { getPaymentProvider } from '@/services/payment';
import { logger } from '@/lib/logger';
import { checkoutSchema, CheckoutFormInput, CheckoutResult } from '@/lib/validation/checkout';

export type { CheckoutFormInput, CheckoutResult };

export async function createOrderAction(formData: CheckoutFormInput): Promise<CheckoutResult> {
  try {
    // 1. Validate Form Payload
    const parsed = checkoutSchema.safeParse(formData);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || 'Invalid checkout information';
      return { success: false, error: firstError };
    }

    const {
      customerName,
      customerEmail,
      customerPhone,
      addressLine1,
      addressLine2,
      city,
      postalCode,
      country,
      deliveryNotes,
      items,
      paymentMethod,
    } = parsed.data;

    // 2. Identify Authenticated Customer (if signed in)
    const authenticatedUser = await getCurrentUser();
    const userId = authenticatedUser?.id || null;

    // 3. Query Authoritative Products from Database
    const productIds = items.map((i) => i.productId);
    const dbProducts = await db.product.findMany({
      where: {
        OR: [
          { id: { in: productIds } },
          { slug: { in: productIds } },
          { slug: { in: productIds.map((id) => (id.startsWith('prod-') ? `the-${id.replace('prod-', '')}` : id)) } },
        ],
      },
    });

    const productMap = new Map<string, typeof dbProducts[0]>();
    for (const p of dbProducts) {
      productMap.set(p.id, p);
      productMap.set(p.slug, p);
      if (p.id.startsWith('prod-')) {
        productMap.set(`the-${p.id.replace('prod-', '')}`, p);
      }
    }

    // Verify all items exist and are active
    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        return {
          success: false,
          error: 'One of the items in your shopping bag is no longer available.',
        };
      }

      if (!product.isAvailable) {
        return {
          success: false,
          error: `"${product.title}" is currently unavailable for purchase.`,
        };
      }

      if (product.stockQuantity < item.quantity) {
        return {
          success: false,
          error: `"${product.title}" has only ${product.stockQuantity} copies remaining in stock.`,
        };
      }
    }

    // 4. Authoritative Server-Side Calculation (Pricing, Shipping, Totals)
    let subtotal = 0;
    for (const item of items) {
      const product = productMap.get(item.productId)!;
      subtotal += Number(product.price) * item.quantity;
    }

    // Standard business rule: Free shipping over $50 threshold, otherwise $5.00 flat rate
    const shippingFee = subtotal >= 50.0 ? 0.0 : 5.0;
    const totalAmount = Number((subtotal + shippingFee).toFixed(2));

    // 5. Generate Human-Readable Unique Order Number
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `NNU-${Date.now().toString().slice(-6)}-${randomSuffix}`;

    const paymentProvider = getPaymentProvider();

    // 6. Concurrency-Safe Atomic Stock Reservation & Order Creation Transaction
    let order;
    try {
      order = await db.$transaction(async (tx) => {
        // Concurrency-safe atomic check and decrement:
        // Ensures stockQuantity >= item.quantity at the exact moment of execution
        for (const item of items) {
          const product = productMap.get(item.productId)!;
          const updateResult = await tx.product.updateMany({
            where: {
              id: product.id,
              stockQuantity: { gte: item.quantity },
            },
            data: {
              stockQuantity: {
                decrement: item.quantity,
              },
            },
          });

          if (updateResult.count === 0) {
            throw new Error(`Insufficient inventory for "${product.title}". Stock changed during checkout.`);
          }
        }

        // Create Order record (always starts PENDING_PAYMENT)
        const newOrder = await tx.order.create({
          data: {
            orderNumber,
            userId,
            customerName,
            customerEmail,
            customerPhone: customerPhone || null,
            totalAmount,
            status: 'PENDING_PAYMENT',
            shippingAddress: {
              addressLine1,
              addressLine2: addressLine2 || '',
              city,
              postalCode: postalCode || '',
              country,
              deliveryNotes: deliveryNotes || '',
            },
            items: {
              create: items.map((item) => {
                const product = productMap.get(item.productId)!;
                return {
                  productId: product.id,
                  quantity: item.quantity,
                  unitPrice: product.price,
                };
              }),
            },
          },
        });

        // Create Payment record
        await tx.payment.create({
          data: {
            orderId: newOrder.id,
            provider: paymentProvider.providerName,
            amount: totalAmount,
            status: 'INITIATED',
            metadata: {
              paymentMethod: paymentMethod || 'CARD',
              initiatedAt: new Date().toISOString(),
            },
          },
        });

        return newOrder;
      });
    } catch (txErr: unknown) {
      const msg = txErr instanceof Error ? txErr.message : 'Inventory reservation failed';
      logger.warn(`Checkout reservation rejected: ${msg}`);
      return {
        success: false,
        error: msg,
      };
    }

    // 7. Initiate Payment Gateway Intent
    const paymentResult = await paymentProvider.initiatePayment({
      orderId: order.id,
      orderNumber: order.orderNumber,
      amount: totalAmount,
      currency: 'USD',
      customerName,
      customerEmail,
      customerPhone: customerPhone || undefined,
      paymentMethod: paymentMethod,
    });

    // 8. Handle Payment Provider Rejection: Revert stock reservation and return clear error
    if (!paymentResult.success) {
      logger.warn(
        `Payment initiation failed for order ${order.orderNumber} via ${paymentProvider.providerName}: ${paymentResult.errorMessage}`
      );

      // Revert stock reservation immediately in transactional cleanup
      await db.$transaction(async (tx) => {
        for (const item of items) {
          const product = productMap.get(item.productId)!;
          await tx.product.update({
            where: { id: product.id },
            data: {
              stockQuantity: {
                increment: item.quantity,
              },
            },
          });
        }

        await tx.order.update({
          where: { id: order.id },
          data: { status: 'CANCELLED' },
        });

        await tx.payment.updateMany({
          where: { orderId: order.id },
          data: {
            status: 'FAILED',
            metadata: {
              failureReason: paymentResult.errorMessage || 'Payment provider rejected initiation',
              failedAt: new Date().toISOString(),
            },
          },
        });
      });

      return {
        success: false,
        error:
          paymentResult.errorMessage ||
          'The payment provider could not initiate this transaction. Please verify your details or choose another payment method.',
      };
    }

    // 9. Synchronous Verification ONLY for Mock/Dev Sandbox Provider
    // For real providers (SoomarPay, Stripe), status MUST remain PENDING_PAYMENT until verified by webhook
    const isInstantDevMock =
      process.env.NODE_ENV !== 'production' &&
      paymentProvider.providerName === 'MOCK_SANDBOX_PAYMENT_PROVIDER' &&
      !paymentResult.paymentUrl;

    if (isInstantDevMock) {
      await db.$transaction(async (tx) => {
        await tx.payment.updateMany({
          where: { orderId: order.id },
          data: {
            transactionId: paymentResult.transactionId,
            status: 'VERIFIED',
            metadata: {
              paymentMethod: paymentMethod,
              verifiedAt: new Date().toISOString(),
            },
          },
        });

        await tx.order.update({
          where: { id: order.id },
          data: { status: 'PAID' },
        });
      });
    }

    logger.info(`Order placed successfully: ${order.orderNumber} for ${customerEmail} (Status: ${isInstantDevMock ? 'PAID' : 'PENDING_PAYMENT'})`);

    return {
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      totalAmount,
      paymentUrl: paymentResult.paymentUrl,
      transactionId: paymentResult.transactionId,
      paymentStatus: isInstantDevMock ? 'PAID' : 'PENDING_PAYMENT',
    };
  } catch (error: unknown) {
    logger.error('Unhandled error during order creation transaction', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return {
      success: false,
      error: 'An unexpected error occurred while placing your order. Please try again.',
    };
  }
}
