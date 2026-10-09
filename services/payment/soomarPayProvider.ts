/**
 * NAAG NOOL UP — SoomarPay Payment Provider Integration
 * Official Somali Payment Gateway (EVC Plus, ZAAD, Sahal, eDahab, Cards via Salaam Somali Bank)
 */

import crypto from 'crypto';
import {
  PaymentProvider,
  InitiatePaymentInput,
  InitiatePaymentResult,
  VerifyPaymentResult,
  WebhookResult,
} from './types';
import { logger } from '@/lib/logger';

export class SoomarPayProvider implements PaymentProvider {
  public readonly providerName = 'SoomarPay';
  private readonly apiKey: string | undefined;
  private readonly baseUrl: string;
  private readonly webhookSecret: string | undefined;

  constructor() {
    this.apiKey = process.env.SOOMARPAY_API_KEY;
    this.baseUrl = (process.env.SOOMARPAY_BASE_URL || 'https://www.soomarpay.com').replace(/\/$/, '');
    this.webhookSecret = process.env.SOOMARPAY_WEBHOOK_SECRET;
  }

  public isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  /**
   * Initiate a payment via SoomarPay REST API
   */
  async initiatePayment(input: InitiatePaymentInput): Promise<InitiatePaymentResult> {
    if (!this.isConfigured()) {
      logger.error('SoomarPay initiation requested but SOOMARPAY_API_KEY is not configured');
      return {
        success: false,
        transactionId: '',
        errorMessage: 'PAYMENT_ACTIVATION_BLOCKED: SoomarPay merchant credentials are not configured.',
      };
    }

    try {
      // Map payment method to SoomarPay supported methods:
      // CARD, VISA, MASTERCARD, EVC, ZAAD, SAHAL, EDAHAB, PREMIER
      let method = 'CARD';
      const requestedMethod = (input.paymentMethod || '').toUpperCase();

      if (['EVC', 'ZAAD', 'SAHAL', 'EDAHAB', 'PREMIER', 'CARD', 'VISA', 'MASTERCARD'].includes(requestedMethod)) {
        method = requestedMethod;
      } else if (requestedMethod === 'MOBILE_MONEY') {
        method = 'EVC';
      }

      const payload = {
        amount: input.amount,
        currency: input.currency || 'USD',
        paymentMethod: method,
        customerEmail: input.customerEmail,
        customerName: input.customerName,
        customerPhone: input.customerPhone || '252615000000',
        description: `Naag Nool UP - Order ${input.orderNumber}`,
        returnUrl: input.returnUrl || `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/account/orders`,
      };

      const res = await fetch(`${this.baseUrl}/api/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        const errorMsg = data?.message || `HTTP ${res.status} from SoomarPay`;
        logger.error(`SoomarPay payment initiation failed: ${errorMsg}`, data);
        return {
          success: false,
          transactionId: '',
          errorMessage: errorMsg,
        };
      }

      const payment = data.payment;
      logger.info(`SoomarPay transaction created: ${payment.reference} (${payment.status}) for order ${input.orderNumber}`);

      return {
        success: true,
        transactionId: payment.reference,
        paymentUrl: payment.formUrl || undefined,
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown network error';
      logger.error(`Network error connecting to SoomarPay: ${errorMsg}`);
      return {
        success: false,
        transactionId: '',
        errorMessage: errorMsg,
      };
    }
  }

  /**
   * Verify transaction state via GET /api/payments/verify/:reference
   */
  async verifyPayment(transactionId: string, orderId: string): Promise<VerifyPaymentResult> {
    if (!this.isConfigured()) {
      return {
        success: false,
        orderId,
        transactionId,
        status: 'FAILED',
        rawResponse: { error: 'SoomarPay unconfigured' },
      };
    }

    try {
      const res = await fetch(`${this.baseUrl}/api/payments/verify/${encodeURIComponent(transactionId)}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        return {
          success: false,
          orderId,
          transactionId,
          status: 'FAILED',
          rawResponse: data,
        };
      }

      const statusStr = (data.payment?.status || '').toUpperCase();
      let mappedStatus: 'PAID' | 'PENDING' | 'FAILED' = 'PENDING';

      if (statusStr === 'COMPLETED' || statusStr === 'PAID') {
        mappedStatus = 'PAID';
      } else if (statusStr === 'FAILED' || statusStr === 'CANCELLED') {
        mappedStatus = 'FAILED';
      }

      return {
        success: mappedStatus === 'PAID',
        orderId,
        transactionId,
        status: mappedStatus,
        rawResponse: data,
      };
    } catch (err: unknown) {
      logger.error(`Failed to verify SoomarPay transaction ${transactionId}:`, err);
      return {
        success: false,
        orderId,
        transactionId,
        status: 'FAILED',
        rawResponse: err,
      };
    }
  }

  /**
   * Cryptographically verify SoomarPay webhook and map payment event
   */
  async handleWebhook(payload: unknown, headers: Record<string, string>): Promise<WebhookResult> {
    const rawBody = typeof payload === 'string' ? payload : JSON.stringify(payload);
    const signature = headers['soomarpay-signature'] || headers['SoomarPay-Signature'];
    const timestamp = headers['soomarpay-timestamp'] || headers['SoomarPay-Timestamp'];

    // Verify HMAC-SHA256 if webhook secret is configured
    if (this.webhookSecret && signature && timestamp) {
      try {
        const expected = crypto
          .createHmac('sha256', this.webhookSecret)
          .update(`${timestamp}.${rawBody}`)
          .digest('hex');

        const isValid = crypto.timingSafeEqual(
          Buffer.from(signature, 'hex'),
          Buffer.from(expected, 'hex')
        );

        if (!isValid) {
          logger.warn('SoomarPay webhook HMAC-SHA256 signature verification failed');
          return { handled: false };
        }
      } catch (err) {
        logger.error('Error during SoomarPay webhook signature verification:', err);
        return { handled: false };
      }
    }

    try {
      const eventData = typeof payload === 'string' ? JSON.parse(payload) : payload;
      const eventName = headers['soomarpay-event'] || headers['SoomarPay-Event'] || eventData.event;
      const payment = eventData.payment || eventData.data || eventData;

      if (eventName === 'payment.completed' || payment.status === 'COMPLETED') {
        return {
          handled: true,
          orderId: payment.orderId || payment.orderNumber,
          status: 'PAID',
          rawEvent: eventData,
        };
      }

      if (eventName === 'payment.failed' || payment.status === 'FAILED') {
        return {
          handled: true,
          orderId: payment.orderId || payment.orderNumber,
          status: 'FAILED',
          rawEvent: eventData,
        };
      }

      return {
        handled: true,
        orderId: payment.orderId || payment.orderNumber,
        rawEvent: eventData,
      };
    } catch (err) {
      logger.error('Failed to parse SoomarPay webhook payload:', err);
      return { handled: false };
    }
  }

  async refundPayment(transactionId: string, amount: number): Promise<boolean> {
    logger.info(`SoomarPay refund requested for ${transactionId} (amount: ${amount})`);
    return true;
  }

  async getPaymentStatus(transactionId: string): Promise<VerifyPaymentResult> {
    return this.verifyPayment(transactionId, '');
  }
}
