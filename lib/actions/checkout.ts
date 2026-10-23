'use server';

import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/server';
import { getPaymentProvider } from '@/services/payment';
import { logger } from '@/lib/logger';
import { checkoutSchema, CheckoutFormInput, CheckoutResult } from '@/lib/validation/checkout';
import { CANONICAL_JOURNALS } from '@/lib/products';

export type { CheckoutFormInput, CheckoutResult };

/**
 * Resolves candidate product IDs/slugs for a cart item, safely stripping
 * edition and color suffixes (e.g. "prod-grateful-english" -> "prod-grateful", "grateful-journal").
 */
function resolveBaseCandidateKeys(rawId: string): string[] {
  const candidates = new Set<string>();
  if (!rawId) return [];

  const raw = rawId.trim();
  candidates.add(raw);
  const normalized = raw.toLowerCase();
  candidates.add(normalized);

  // Strip known variant suffixes (editions, colors)
  const stripped = normalized
    .replace(
      /-(english|somali|black|white|natural|forest-green|royal-navy|burgundy-wine|sage-green|blush-pink|camel-tan|warm-taupe|charcoal|ivory)$/i,
      ''
    )
    .trim();
  candidates.add(stripped);

  if (stripped.startsWith('prod-')) {
    const withoutProd = stripped.replace('prod-', '');
    candidates.add(`the-${withoutProd}`);
    candidates.add(`${withoutProd}-journal`);
    candidates.add(withoutProd);
  }

  // Find matching canonical journal to include its canonical id and slug
  const canonical = CANONICAL_JOURNALS.find(
    (c) =>
      c.id === raw ||
      c.id === stripped ||
      c.slug === normalized ||
      c.slug === stripped ||
      c.slug === `${stripped}-journal` ||
      (Array.isArray(c.metadata?.aliases) &&
        (c.metadata?.aliases.includes(normalized) || c.metadata?.aliases.includes(stripped)))
  );

  if (canonical) {
    candidates.add(canonical.id);
    candidates.add(canonical.slug);
  }

  return Array.from(candidates);
}

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

    // 3. Query Authoritative Products from Database with Variant Normalization
    const candidateKeysByItem = items.map((item) => ({
      item,
      candidates: resolveBaseCandidateKeys(item.productId),
    }));

    const allCandidateKeys = Array.from(
      new Set(candidateKeysByItem.flatMap((c) => c.candidates))
    );

    let dbProducts: any[] = [];
    try {
      dbProducts = await db.product.findMany({
        where: {
          OR: [
            { id: { in: allCandidateKeys } },
            { slug: { in: allCandidateKeys } },
          ],
        },
      });
    } catch (dbErr) {
      logger.error('Error querying products during checkout:', {
        error: dbErr instanceof Error ? dbErr.message : String(dbErr),
      });
    }

    // Auto-seed canonical products if missing from database
    for (const { candidates } of candidateKeysByItem) {
      const existsInDb = dbProducts.some(
        (p) => candidates.includes(p.id) || candidates.includes(p.slug)
      );
      if (!existsInDb) {
        const canonical = CANONICAL_JOURNALS.find(
          (c) => candidates.includes(c.id) || candidates.includes(c.slug)
        );
        if (canonical) {
          try {
            const autoCreated = await db.product.upsert({
              where: { id: canonical.id },
              update: {},
              create: {
                id: canonical.id,
                title: canonical.title,
                slug: canonical.slug,
                description: canonical.description,
                price: canonical.price,
                category: canonical.category || 'Journals',
                stockQuantity: canonical.stockQuantity,
                isAvailable: canonical.isAvailable,
                metadata: (canonical.metadata as any) || undefined,
                images: {
                  create: canonical.images.map((img) => ({
                    id: img.id,
                    url: img.url,
                    altText: img.altText,
                    sortOrder: img.sortOrder,
                  })),
                },
              },
            });
            dbProducts.push(autoCreated);
            logger.info(`Auto-seeded canonical product during checkout: ${canonical.title} (${canonical.id})`);
          } catch (upsertErr) {
            logger.warn('Failed auto-seeding canonical product during checkout, fallback to in-memory definition:', {
              error: upsertErr instanceof Error ? upsertErr.message : String(upsertErr),
            });
            dbProducts.push({
              id: canonical.id,
              title: canonical.title,
              slug: canonical.slug,
              description: canonical.description,
              price: canonical.price,
              category: canonical.category,
              stockQuantity: canonical.stockQuantity,
              isAvailable: canonical.isAvailable,
            });
          }
        }
      }
    }

    const productMap = new Map<string, typeof dbProducts[0]>();
    for (const p of dbProducts) {
      productMap.set(p.id, p);
      productMap.set(p.slug, p);
      if (p.id.startsWith('prod-')) {
        productMap.set(`the-${p.id.replace('prod-', '')}`, p);
        productMap.set(p.id.replace('prod-', ''), p);
      }
    }

    const resolvedItems: Array<{
      item: (typeof items)[0];
      product: (typeof dbProducts)[0];
    }> = [];

    // Verify all items exist and are active
    for (const { item, candidates } of candidateKeysByItem) {
      let product = productMap.get(item.productId);
      if (!product) {
        for (const candidate of candidates) {
          if (productMap.has(candidate)) {
            product = productMap.get(candidate);
            break;
          }
        }
      }

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

      resolvedItems.push({ item, product });
    }

    // 4. Authoritative Server-Side Calculation (Pricing, Shipping, Totals)
    let subtotal = 0;
    for (const { item, product } of resolvedItems) {
      subtotal += Number(product.price) * item.quantity;
    }

    const pledge = parsed.data.sponsorshipPledge || 0;
    // Standard business rule: Free shipping over $50 threshold, otherwise $5.00 flat rate
    const shippingFee = subtotal >= 50.0 ? 0.0 : 5.0;
    const totalAmount = Number((subtotal + shippingFee + pledge).toFixed(2));

    // 5. Generate Human-Readable Unique Order Number
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `NNU-${Date.now().toString().slice(-6)}-${randomSuffix}`;

    const paymentProvider = getPaymentProvider(paymentMethod);

    // 6. Concurrency-Safe Atomic Stock Reservation & Order Creation Transaction
    let order;
    try {
      order = await db.$transaction(async (tx) => {
        // Concurrency-safe atomic check and decrement:
        // Ensures stockQuantity >= item.quantity at the exact moment of execution
        for (const { item, product } of resolvedItems) {
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
              create: resolvedItems.map(({ item, product }) => ({
                productId: product.id,
                quantity: item.quantity,
                unitPrice: product.price,
              })),
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
        for (const { item, product } of resolvedItems) {
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
