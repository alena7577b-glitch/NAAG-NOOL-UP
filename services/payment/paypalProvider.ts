/**
 * NAAG NOOL UP — PayPal Payment Gateway Provider
 * Native HTTPS integration to PayPal REST API v2 (Orders & Captures).
 */

import { logger } from '@/lib/logger';
import {
  PaymentProvider,
  InitiatePaymentInput,
  InitiatePaymentResult,
  VerifyPaymentResult,
  WebhookResult,
} from './types';

export class PayPalPaymentProvider implements PaymentProvider {
  providerName = 'PAYPAL_PAYMENT_PROVIDER';

  private clientId: string | null;
  private clientSecret: string | null;
  public webhookId: string | null;
  private isSandbox: boolean;
  private baseUrl: string;

  constructor() {
    this.clientId = process.env.PAYPAL_CLIENT_ID || null;
    this.clientSecret = process.env.PAYPAL_CLIENT_SECRET || null;
    this.webhookId = process.env.PAYPAL_WEBHOOK_ID || null;
    const envSetting = (process.env.PAYPAL_ENVIRONMENT || '').toLowerCase();
    this.isSandbox = envSetting === 'sandbox';
    this.baseUrl = this.isSandbox
      ? 'https://api-m.sandbox.paypal.com'
      : 'https://api-m.paypal.com';
  }

  isConfigured(): boolean {
    return Boolean(this.clientId && this.clientSecret);
  }

  /**
   * Fetch OAuth 2.0 Bearer Token from PayPal
   */
  private async getAccessToken(): Promise<string> {
    if (!this.clientId || !this.clientSecret) {
      throw new Error(
        'PAYMENT_ACTIVATION_BLOCKED: PayPal API credentials not configured (PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET).'
      );
    }

    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    const response = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      const err = await response.text();
      logger.error('Failed to authenticate with PayPal OAuth API:', err);
      throw new Error(`PayPal OAuth Authentication Failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.access_token;
  }

  /**
   * Initiate PayPal Order
   */
  async initiatePayment(input: InitiatePaymentInput): Promise<InitiatePaymentResult> {
    if (!this.isConfigured()) {
      if (process.env.NODE_ENV !== 'production') {
        const mockOrderId = `PAYPAL-MOCK-${Date.now()}`;
        return {
          success: true,
          transactionId: mockOrderId,
          paymentUrl: `${input.returnUrl || '/checkout'}?token=${mockOrderId}`,
        };
      }
      return {
        success: false,
        transactionId: '',
        errorMessage: 'PAYMENT_ACTIVATION_BLOCKED: PayPal credentials are not configured.',
      };
    }

    try {
      const token = await this.getAccessToken();

      const orderPayload = {
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: input.orderId,
            custom_id: input.orderNumber,
            description: `Naag Nool UP Order #${input.orderNumber}`,
            amount: {
              currency_code: input.currency.toUpperCase() || 'USD',
              value: (Number(input.amount) || 0).toFixed(2),
            },
          },
        ],
        application_context: {
          brand_name: 'Naag Nool UP',
          landing_page: 'BILLING',
          user_action: 'PAY_NOW',
          return_url:
            input.returnUrl ||
            `${process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://naagnoolup.com'}/checkout?orderNumber=${encodeURIComponent(input.orderNumber)}&success=true&provider=paypal`,
          cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://naagnoolup.com'}/checkout?cancelled=true&orderNumber=${encodeURIComponent(input.orderNumber)}`,
        },
      };

      const response = await fetch(`${this.baseUrl}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        logger.error('PayPal Order creation failed:', data);
        return {
          success: false,
          transactionId: '',
          errorMessage: data.message || 'Failed to initiate PayPal checkout order',
        };
      }

      const approveLink = data.links?.find((l: any) => l.rel === 'approve')?.href;

      return {
        success: true,
        transactionId: data.id,
        paymentUrl: approveLink || '',
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Network error communicating with PayPal API';
      logger.error('PayPal initiation exception:', err);
      return {
        success: false,
        transactionId: '',
        errorMessage: message,
      };
    }
  }

  /**
   * Capture and verify PayPal Payment
   */
  async verifyPayment(transactionId: string, orderId: string): Promise<VerifyPaymentResult> {
    if (!this.isConfigured()) {
      if (process.env.NODE_ENV !== 'production' && transactionId.startsWith('PAYPAL-MOCK-')) {
        return {
          success: true,
          orderId,
          transactionId,
          status: 'PAID',
          rawResponse: { mock: true },
        };
      }
      return {
        success: false,
        orderId,
        transactionId,
        status: 'FAILED',
        rawResponse: { error: 'PayPal unconfigured' },
      };
    }

    try {
      const token = await this.getAccessToken();

      // First check order status
      const getOrderRes = await fetch(`${this.baseUrl}/v2/checkout/orders/${transactionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const orderData = await getOrderRes.json();

      if (orderData.status === 'COMPLETED') {
        return {
          success: true,
          orderId,
          transactionId,
          status: 'PAID',
          rawResponse: orderData,
        };
      }

      // If approved, capture the order
      if (orderData.status === 'APPROVED') {
        const captureRes = await fetch(`${this.baseUrl}/v2/checkout/orders/${transactionId}/capture`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const captureData = await captureRes.json();

        if (captureRes.ok && (captureData.status === 'COMPLETED' || captureData.status === 'SAVED')) {
          return {
            success: true,
            orderId,
            transactionId,
            status: 'PAID',
            rawResponse: captureData,
          };
        }
      }

      return {
        success: false,
        orderId,
        transactionId,
        status: 'PENDING',
        rawResponse: orderData,
      };
    } catch (err) {
      logger.error('Failed to verify PayPal transaction:', err);
      return {
        success: false,
        orderId,
        transactionId,
        status: 'FAILED',
        rawResponse: { error: String(err) },
      };
    }
  }

  /**
   * Handle PayPal Webhooks
   */
  async handleWebhook(payload: unknown, _headers: Record<string, string>): Promise<WebhookResult> {
    try {
      const event = (typeof payload === 'string' ? JSON.parse(payload) : payload) as any;
      const eventType = event?.event_type;

      if (eventType === 'CHECKOUT.ORDER.APPROVED') {
        const resource = event.resource || {};
        const orderId = resource.custom_id || resource.purchase_units?.[0]?.reference_id;
        const transactionId = resource.id;

        // Automatically trigger capture for approved PayPal order
        const verifyResult = await this.verifyPayment(transactionId, orderId || '');
        if (verifyResult.success && verifyResult.status === 'PAID') {
          const amount = parseFloat(resource.purchase_units?.[0]?.amount?.value || '0');
          const currency = resource.purchase_units?.[0]?.amount?.currency_code || 'USD';

          return {
            handled: true,
            orderId,
            transactionId,
            amount,
            currency,
            eventType,
            status: 'PAID',
            rawEvent: event,
          };
        }
      }

      if (eventType === 'PAYMENT.CAPTURE.COMPLETED') {
        const resource = event.resource || {};
        const orderId = resource.custom_id || resource.purchase_units?.[0]?.reference_id;
        const transactionId = resource.id;
        const amount = parseFloat(resource.amount?.value || '0');
        const currency = resource.amount?.currency_code || 'USD';

        return {
          handled: true,
          orderId,
          transactionId,
          amount,
          currency,
          eventType,
          status: 'PAID',
          rawEvent: event,
        };
      }

      return {
        handled: true,
        eventType,
        rawEvent: event,
      };
    } catch (err) {
      logger.error('Failed to parse PayPal webhook payload:', err);
      return { handled: false, error: 'Invalid PayPal webhook payload' };
    }
  }

  /**
   * Refund a captured PayPal transaction
   */
  async refundPayment(transactionId: string, amount: number): Promise<boolean> {
    if (!this.isConfigured()) return false;
    try {
      const token = await this.getAccessToken();
      const response = await fetch(`${this.baseUrl}/v2/payments/captures/${transactionId}/refund`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: {
            value: amount.toFixed(2),
            currency_code: 'USD',
          },
        }),
      });
      return response.ok;
    } catch (err) {
      logger.error('Failed to process PayPal refund:', err);
      return false;
    }
  }

  async getPaymentStatus(transactionId: string): Promise<VerifyPaymentResult> {
    return this.verifyPayment(transactionId, '');
  }
}
