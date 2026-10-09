/**
 * NAAG NOOL UP — Production Stripe Payment Gateway Provider
 * Zero-dependency native HTTPS integration to Stripe REST API.
 */

import crypto from 'crypto';
import {
  PaymentProvider,
  InitiatePaymentInput,
  InitiatePaymentResult,
  VerifyPaymentResult,
  WebhookResult,
} from './types';

export class StripePaymentProvider implements PaymentProvider {
  providerName = 'STRIPE_PRODUCTION_PAYMENT_PROVIDER';

  private apiKey: string | null;
  private webhookSecret: string | null;

  constructor() {
    this.apiKey = process.env.STRIPE_SECRET_KEY || process.env.PAYMENT_PROVIDER_SECRET || null;
    this.webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || process.env.PAYMENT_WEBHOOK_SECRET || null;
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  async initiatePayment(input: InitiatePaymentInput): Promise<InitiatePaymentResult> {
    if (!this.isConfigured() || !this.apiKey) {
      return {
        success: false,
        transactionId: '',
        errorMessage:
          'PAYMENT_ACTIVATION_BLOCKED: Stripe merchant secret key is not configured in production environment variables (STRIPE_SECRET_KEY / PAYMENT_PROVIDER_SECRET).',
      };
    }

    try {
      // Amount in cents for USD
      const amountInCents = Math.round(input.amount * 100);

      const params = new URLSearchParams();
      params.append('amount', amountInCents.toString());
      params.append('currency', (input.currency || 'usd').toLowerCase());
      params.append('description', `Order ${input.orderNumber} — Naag Nool UP`);
      params.append('receipt_email', input.customerEmail);
      params.append('metadata[orderId]', input.orderId);
      params.append('metadata[orderNumber]', input.orderNumber);
      params.append('automatic_payment_methods[enabled]', 'true');

      const response = await fetch('https://api.stripe.com/v1/payment_intents', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          transactionId: '',
          errorMessage: data.error?.message || 'Failed to initiate Stripe payment intent',
        };
      }

      return {
        success: true,
        transactionId: data.id,
        paymentUrl: data.client_secret, // Used on client by Stripe Elements
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Network error communicating with Stripe API';
      return {
        success: false,
        transactionId: '',
        errorMessage: message,
      };
    }
  }

  async verifyPayment(transactionId: string, orderId: string): Promise<VerifyPaymentResult> {
    if (!this.isConfigured() || !this.apiKey) {
      return {
        success: false,
        orderId,
        transactionId,
        status: 'PENDING',
        rawResponse: { error: 'PAYMENT_ACTIVATION_BLOCKED' },
      };
    }

    try {
      const response = await fetch(`https://api.stripe.com/v1/payment_intents/${transactionId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          orderId,
          transactionId,
          status: 'FAILED',
          rawResponse: data,
        };
      }

      let status: 'PAID' | 'FAILED' | 'PENDING' = 'PENDING';
      if (data.status === 'succeeded') {
        status = 'PAID';
      } else if (data.status === 'canceled' || data.status === 'requires_payment_method') {
        status = 'FAILED';
      }

      return {
        success: status === 'PAID',
        orderId: data.metadata?.orderId || orderId,
        transactionId: data.id,
        status,
        rawResponse: data,
      };
    } catch (err: unknown) {
      return {
        success: false,
        orderId,
        transactionId,
        status: 'PENDING',
        rawResponse: { error: err instanceof Error ? err.message : 'Verification failed' },
      };
    }
  }

  async handleWebhook(rawBody: string | Buffer | unknown, headers: Record<string, string>): Promise<WebhookResult> {
    if (!this.webhookSecret) {
      return {
        handled: false,
        rawEvent: { error: 'PAYMENT_WEBHOOK_SECRET is not configured' },
      };
    }

    const signatureHeader = headers['stripe-signature'];
    if (!signatureHeader || typeof rawBody !== 'string') {
      return {
        handled: false,
        rawEvent: { error: 'Missing stripe-signature or invalid raw body' },
      };
    }

    // Parse stripe-signature header: t=timestamp,v1=signature
    const elements = signatureHeader.split(',');
    let timestamp = '';
    let signature = '';

    for (const elem of elements) {
      const [key, val] = elem.trim().split('=');
      if (key === 't') timestamp = val;
      if (key === 'v1') signature = val;
    }

    if (!timestamp || !signature) {
      return {
        handled: false,
        rawEvent: { error: 'Malformed stripe-signature header' },
      };
    }

    // Verify cryptographic HMAC-SHA256 signature
    const signedPayload = `${timestamp}.${rawBody}`;
    const expectedSignature = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(signedPayload, 'utf8')
      .digest('hex');

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return {
        handled: false,
        rawEvent: { error: 'Cryptographic signature mismatch' },
      };
    }

    // Parse event payload
    try {
      const event = JSON.parse(rawBody);
      const paymentIntent = event.data?.object;
      const orderId = paymentIntent?.metadata?.orderId;

      if (event.type === 'payment_intent.succeeded') {
        return {
          handled: true,
          orderId,
          status: 'PAID',
          rawEvent: event,
        };
      }

      if (event.type === 'payment_intent.payment_failed') {
        return {
          handled: true,
          orderId,
          status: 'FAILED',
          rawEvent: event,
        };
      }

      return {
        handled: true,
        orderId,
        rawEvent: event,
      };
    } catch (err: unknown) {
      return {
        handled: false,
        rawEvent: { error: err instanceof Error ? err.message : 'Invalid JSON' },
      };
    }
  }

  async refundPayment(transactionId: string, amount?: number): Promise<boolean> {
    if (!this.isConfigured() || !this.apiKey) return false;

    try {
      const params = new URLSearchParams();
      params.append('payment_intent', transactionId);
      if (amount) {
        params.append('amount', Math.round(amount * 100).toString());
      }

      const response = await fetch('https://api.stripe.com/v1/refunds', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      return response.ok;
    } catch {
      return false;
    }
  }

  async getPaymentStatus(transactionId: string): Promise<VerifyPaymentResult> {
    return this.verifyPayment(transactionId, '');
  }
}
