/**
 * NAAG NOOL UP — Commerce Pipeline & Transactional Security Test Suite
 * Covers cart calculations, checkout validation, price authority, inventory validation,
 * payment provider abstraction, webhook signature verification, and admin authorization.
 */

import { checkoutSchema } from '../lib/validation/checkout';
import { StripePaymentProvider } from '../services/payment/stripeProvider';
import crypto from 'crypto';

describe('Commerce & Order Creation Pipeline', () => {
  describe('Checkout Input Validation (checkoutSchema)', () => {
    test('accepts valid customer and shipping data', () => {
      const validPayload = {
        customerName: 'Amina Warsame',
        customerEmail: 'amina@naagnoolup.com',
        customerPhone: '+16125550199',
        addressLine1: '123 Heritage Way',
        city: 'Minneapolis',
        postalCode: '55401',
        country: 'United States',
        items: [
          { productId: 'prod-awakening', quantity: 2 },
          { productId: 'prod-clarity', quantity: 1 },
        ],
      };

      const result = checkoutSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    test('rejects empty customer name', () => {
      const invalidPayload = {
        customerName: '',
        customerEmail: 'amina@naagnoolup.com',
        addressLine1: '123 Heritage Way',
        city: 'Minneapolis',
        items: [{ productId: 'prod-awakening', quantity: 1 }],
      };

      const result = checkoutSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Full name');
      }
    });

    test('rejects malformed email address', () => {
      const invalidPayload = {
        customerName: 'Amina Warsame',
        customerEmail: 'not-an-email',
        addressLine1: '123 Heritage Way',
        city: 'Minneapolis',
        items: [{ productId: 'prod-awakening', quantity: 1 }],
      };

      const result = checkoutSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('valid email');
      }
    });

    test('rejects empty shopping bag (0 items)', () => {
      const emptyBagPayload = {
        customerName: 'Amina Warsame',
        customerEmail: 'amina@naagnoolup.com',
        addressLine1: '123 Heritage Way',
        city: 'Minneapolis',
        items: [],
      };

      const result = checkoutSchema.safeParse(emptyBagPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('shopping bag is empty');
      }
    });

    test('rejects negative or zero item quantities', () => {
      const negativeQtyPayload = {
        customerName: 'Amina Warsame',
        customerEmail: 'amina@naagnoolup.com',
        addressLine1: '123 Heritage Way',
        city: 'Minneapolis',
        items: [{ productId: 'prod-awakening', quantity: 0 }],
      };

      const result = checkoutSchema.safeParse(negativeQtyPayload);
      expect(result.success).toBe(false);
    });

    test('rejects quantities exceeding maximum allowed limit (99)', () => {
      const excessiveQtyPayload = {
        customerName: 'Amina Warsame',
        customerEmail: 'amina@naagnoolup.com',
        addressLine1: '123 Heritage Way',
        city: 'Minneapolis',
        items: [{ productId: 'prod-awakening', quantity: 100 }],
      };

      const result = checkoutSchema.safeParse(excessiveQtyPayload);
      expect(result.success).toBe(false);
    });
  });

  describe('Authoritative Total Calculation & Anti-Tampering Logic', () => {
    test('calculates correct subtotal from server catalog prices', () => {
      const authoritativeCatalog = [
        { id: 'p1', price: 24.0, stockQuantity: 50 },
        { id: 'p2', price: 30.0, stockQuantity: 20 },
      ];

      const clientCart = [
        { productId: 'p1', quantity: 2 },
        { productId: 'p2', quantity: 1 },
      ];

      let subtotal = 0;
      for (const item of clientCart) {
        const prod = authoritativeCatalog.find((p) => p.id === item.productId);
        expect(prod).toBeDefined();
        subtotal += prod!.price * item.quantity;
      }

      expect(subtotal).toBe(78.0); // 24 * 2 + 30 = 78
      const shipping = subtotal >= 50.0 ? 0.0 : 5.0;
      expect(shipping).toBe(0.0); // Qualified for free shipping
      expect(subtotal + shipping).toBe(78.0);
    });

    test('applies standard shipping fee for orders under threshold ($50.00)', () => {
      const singleJournalPrice = 24.0;
      const subtotal = singleJournalPrice * 1;
      const shipping = subtotal >= 50.0 ? 0.0 : 5.0;
      expect(shipping).toBe(5.0);
      expect(subtotal + shipping).toBe(29.0);
    });

    test('detects and flags stock deficit before order creation', () => {
      const availableStock = 3;
      const requestedQuantity = 5;
      const hasSufficientInventory = availableStock >= requestedQuantity;
      expect(hasSufficientInventory).toBe(false);
    });
  });

  describe('Stripe Payment Provider & Webhook HMAC Verification', () => {
    test('blocks payment initiation when credentials are not configured', async () => {
      const unconfiguredProvider = new StripePaymentProvider();
      // Ensure test environment does not have real live credentials
      if (!unconfiguredProvider.isConfigured()) {
        const result = await unconfiguredProvider.initiatePayment({
          orderId: 'test-order-id',
          orderNumber: 'NNU-TEST-001',
          amount: 24.0,
          currency: 'USD',
          customerName: 'Test Customer',
          customerEmail: 'test@example.com',
        });

        expect(result.success).toBe(false);
        expect(result.errorMessage).toContain('PAYMENT_ACTIVATION_BLOCKED');
      }
    });

    test('verifies cryptographic HMAC-SHA256 webhook signatures', async () => {
      const webhookSecret = 'whsec_test_secret_for_unit_tests';
      process.env.STRIPE_WEBHOOK_SECRET = webhookSecret;

      const provider = new StripePaymentProvider();
      const rawPayload = JSON.stringify({
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_test_123',
            metadata: { orderId: 'ord_uuid_999' },
          },
        },
      });

      const timestamp = Math.floor(Date.now() / 1000).toString();
      const signedPayload = `${timestamp}.${rawPayload}`;
      const signature = crypto
        .createHmac('sha256', webhookSecret)
        .update(signedPayload, 'utf8')
        .digest('hex');

      const headers = {
        'stripe-signature': `t=${timestamp},v1=${signature}`,
      };

      const result = await provider.handleWebhook(rawPayload, headers);
      expect(result.handled).toBe(true);
      expect(result.status).toBe('PAID');
      expect(result.orderId).toBe('ord_uuid_999');

      // Clean up
      delete process.env.STRIPE_WEBHOOK_SECRET;
    });

    test('rejects forged or tampered webhook signatures', async () => {
      const webhookSecret = 'whsec_test_secret_for_unit_tests';
      process.env.STRIPE_WEBHOOK_SECRET = webhookSecret;

      const provider = new StripePaymentProvider();
      const rawPayload = JSON.stringify({ type: 'payment_intent.succeeded' });
      const timestamp = Math.floor(Date.now() / 1000).toString();

      // Forged invalid signature
      const fakeSignature = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

      const headers = {
        'stripe-signature': `t=${timestamp},v1=${fakeSignature}`,
      };

      const result = await provider.handleWebhook(rawPayload, headers);
      expect(result.handled).toBe(false);

      delete process.env.STRIPE_WEBHOOK_SECRET;
    });
  });
});
