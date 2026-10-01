/**
 * NAAG NOOL UP — Payment Abstraction Compatibility Tests
 */

import { MockPaymentProvider, activePaymentProvider } from '../services/payment/mockProvider';
import { PaymentProvider } from '../services/payment/types';

describe('Payment Provider Abstraction Compatibility', () => {
  test('active payment provider conforms to PaymentProvider interface', () => {
    const provider: PaymentProvider = activePaymentProvider;
    expect(provider).toBeDefined();
    expect(provider.providerName).toBe('MOCK_SANDBOX_PAYMENT_PROVIDER');
  });

  test('initiatePayment returns valid transaction payload', async () => {
    const provider = new MockPaymentProvider();
    const result = await provider.initiatePayment({
      orderId: 'order_uuid_12345678',
      orderNumber: 'NNU-2026-0001',
      amount: 45.0,
      currency: 'USD',
      customerName: 'Amina Warsame',
      customerEmail: 'amina@example.com',
    });

    expect(result.success).toBe(true);
    expect(result.transactionId).toContain('tx_mock_');
    expect(result.paymentUrl).toContain('orderId=order_uuid_12345678');
  });

  test('verifyPayment returns PAID status for completed mock transactions', async () => {
    const provider = new MockPaymentProvider();
    const result = await provider.verifyPayment('tx_mock_123', 'order_123');

    expect(result.success).toBe(true);
    expect(result.status).toBe('PAID');
    expect(result.orderId).toBe('order_123');
  });

  test('handleWebhook processes external webhook callbacks safely', async () => {
    const provider = new MockPaymentProvider();
    const webhookResult = await provider.handleWebhook(
      { event: 'charge.completed', id: 'evt_123' },
      { 'x-signature': 'mock-sig' }
    );

    expect(webhookResult.handled).toBe(true);
  });

  test('refundPayment returns boolean confirmation', async () => {
    const provider = new MockPaymentProvider();
    const result = await provider.refundPayment('tx_mock_123', 45.0);
    expect(result).toBe(true);
  });
});
