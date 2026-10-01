import {
  PaymentProvider,
  InitiatePaymentInput,
  InitiatePaymentResult,
  VerifyPaymentResult,
  WebhookResult,
} from './types';

export class MockPaymentProvider implements PaymentProvider {
  providerName = 'MOCK_SANDBOX_PAYMENT_PROVIDER';

  async initiatePayment(input: InitiatePaymentInput): Promise<InitiatePaymentResult> {
    return {
      success: true,
      transactionId: `tx_mock_${Date.now()}_${input.orderId.substring(0, 8)}`,
      paymentUrl: `/checkout/sandbox-pay?orderId=${input.orderId}`,
    };
  }

  async verifyPayment(transactionId: string, orderId: string): Promise<VerifyPaymentResult> {
    return {
      success: true,
      orderId,
      transactionId,
      status: 'PAID',
    };
  }

  async handleWebhook(payload: unknown, _headers?: Record<string, string>): Promise<WebhookResult> {
    return {
      handled: true,
      rawEvent: payload,
    };
  }

  async refundPayment(_transactionId: string, _amount: number): Promise<boolean> {
    return true;
  }

  async getPaymentStatus(transactionId: string): Promise<VerifyPaymentResult> {
    return {
      success: true,
      orderId: 'mock-order-id',
      transactionId,
      status: 'PAID',
    };
  }
}

export const activePaymentProvider: PaymentProvider = new MockPaymentProvider();
