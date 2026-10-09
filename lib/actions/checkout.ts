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

    // Verify all items exist, are available, and have sufficient inventory
    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        return {
          success: false,
          error: 'One of the items in your bag is no longer available.',
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

    // 4. Calculate Authoritative Totals Server-Side
    let subtotal = 0;
    for (const item of items) {
      const product = productMap.get(item.productId)!;
      subtotal += Number(product.price) * item.quantity;
    }

    // Free shipping threshold over $50
    const shippingFee = subtotal >= 50.0 ? 0.0 : 5.0;
    const totalAmount = subtotal + shippingFee;

    // 5. Generate Human-Readable Unique Order Number
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `NNU-${Date.now().toString().slice(-6)}-${randomSuffix}`;

    // 6. Execute Transactional Database Write
    const paymentProvider = getPaymentProvider();

    const order = await db.$transaction(async (tx) => {
      // Safely decrement stock for each product
      for (const item of items) {
        const product = productMap.get(item.productId)!;
        await tx.product.update({
          where: { id: product.id },
          data: {
            stockQuantity: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Create Order
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
            paymentMethod: parsed.data.paymentMethod,
            initiatedAt: new Date().toISOString(),
          },
        },
      });

      return newOrder;
    });

    // 7. Initiate Payment Gateway Intent
    const paymentResult = await paymentProvider.initiatePayment({
      orderId: order.id,
      orderNumber: order.orderNumber,
      amount: totalAmount,
      currency: 'USD',
      customerName,
      customerEmail,
      customerPhone: customerPhone || undefined,
      paymentMethod: parsed.data.paymentMethod,
    });

    // If transaction succeeded and completed instantly (e.g. SoomarPay sandbox mode), update database
    if (paymentResult.success && paymentResult.transactionId) {
      await db.$transaction(async (tx) => {
        await tx.payment.updateMany({
          where: { orderId: order.id },
          data: {
            transactionId: paymentResult.transactionId,
            status: !paymentResult.paymentUrl ? 'VERIFIED' : 'INITIATED',
            metadata: {
              paymentMethod: parsed.data.paymentMethod,
              verifiedAt: !paymentResult.paymentUrl ? new Date().toISOString() : undefined,
            },
          },
        });

        if (!paymentResult.paymentUrl) {
          await tx.order.update({
            where: { id: order.id },
            data: { status: 'PAID' },
          });
        }
      });
    }

    logger.info(`Order created successfully: ${order.orderNumber} for ${customerEmail}`);

    return {
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      totalAmount,
      paymentUrl: paymentResult.paymentUrl,
      transactionId: paymentResult.transactionId,
    };
  } catch (error: unknown) {
    logger.error('Error during order creation transaction', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return {
      success: false,
      error: 'An unexpected error occurred while placing your order. Please try again.',
    };
  }
}
