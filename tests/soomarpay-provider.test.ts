/**
 * Automated Tests: SoomarPay Provider Integration
 */

import crypto from 'crypto';
import { SoomarPayProvider } from '@/services/payment/soomarPayProvider';

describe('SoomarPayProvider', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('reports unconfigured when SOOMARPAY_API_KEY is not set', () => {
    delete process.env.SOOMARPAY_API_KEY;
    const provider = new SoomarPayProvider();
    expect(provider.isConfigured()).toBe(false);
  });

  it('reports configured when SOOMARPAY_API_KEY is present', () => {
    process.env.SOOMARPAY_API_KEY = 'sk_test_fake_key_12345';
    const provider = new SoomarPayProvider();
    expect(provider.isConfigured()).toBe(true);
    expect(provider.providerName).toBe('SoomarPay');
  });

  it('returns blocked result if initiatePayment is called while unconfigured', async () => {
    delete process.env.SOOMARPAY_API_KEY;
    const provider = new SoomarPayProvider();
    const result = await provider.initiatePayment({
      orderId: 'order-1',
      orderNumber: 'NNU-TEST-1',
      amount: 24.0,
      currency: 'USD',
      customerName: 'Amina Warsame',
      customerEmail: 'amina@example.com',
    });

    expect(result.success).toBe(false);
    expect(result.errorMessage).toContain('PAYMENT_ACTIVATION_BLOCKED');
  });

  it('correctly dispatches POST /api/payments with Authorization header', async () => {
    process.env.SOOMARPAY_API_KEY = 'sk_test_mock_123';
    process.env.SOOMARPAY_BASE_URL = 'https://mock.soomarpay.com';

    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        payment: {
          reference: 'PAY-REF-999',
          status: 'COMPLETED',
          amount: 24,
          formUrl: null,
        },
      }),
    });
    global.fetch = mockFetch;

    const provider = new SoomarPayProvider();
    const result = await provider.initiatePayment({
      orderId: 'order-1',
      orderNumber: 'NNU-TEST-1',
      amount: 24.0,
      currency: 'USD',
      customerName: 'Amina Warsame',
      customerEmail: 'amina@example.com',
      customerPhone: '252615112233',
      paymentMethod: 'EVC',
    });

    expect(mockFetch).toHaveBeenCalledWith(
      'https://mock.soomarpay.com/api/payments',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer sk_test_mock_123',
        }),
      })
    );

    expect(result.success).toBe(true);
    expect(result.transactionId).toBe('PAY-REF-999');
  });

  it('verifies transaction status via GET /api/payments/verify/:reference', async () => {
    process.env.SOOMARPAY_API_KEY = 'sk_test_mock_123';
    process.env.SOOMARPAY_BASE_URL = 'https://mock.soomarpay.com';

    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        payment: {
          reference: 'PAY-REF-999',
          status: 'COMPLETED',
          amount: 24,
        },
      }),
    });
    global.fetch = mockFetch;

    const provider = new SoomarPayProvider();
    const result = await provider.verifyPayment('PAY-REF-999', 'order-1');

    expect(mockFetch).toHaveBeenCalledWith(
      'https://mock.soomarpay.com/api/payments/verify/PAY-REF-999',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Authorization: 'Bearer sk_test_mock_123',
        }),
      })
    );

    expect(result.success).toBe(true);
    expect(result.status).toBe('PAID');
  });

  it('verifies HMAC-SHA256 signature for webhooks when secret is configured', async () => {
    const webhookSecret = 'whsec_test_secret_abc123';
    process.env.SOOMARPAY_WEBHOOK_SECRET = webhookSecret;
    const provider = new SoomarPayProvider();

    const timestamp = '1791480000';
    const payload = JSON.stringify({
      event: 'payment.completed',
      payment: {
        orderNumber: 'NNU-TEST-1',
        reference: 'PAY-1234',
        status: 'COMPLETED',
      },
    });

    const validSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(`${timestamp}.${payload}`)
      .digest('hex');

    const result = await provider.handleWebhook(payload, {
      'soomarpay-signature': validSignature,
      'soomarpay-timestamp': timestamp,
      'soomarpay-event': 'payment.completed',
    });

    expect(result.handled).toBe(true);
    expect(result.status).toBe('PAID');
    expect(result.orderId).toBe('NNU-TEST-1');
  });

  it('rejects webhooks with invalid HMAC-SHA256 signature', async () => {
    process.env.SOOMARPAY_WEBHOOK_SECRET = 'whsec_correct_secret';
    const provider = new SoomarPayProvider();

    const result = await provider.handleWebhook('{}', {
      'soomarpay-signature': 'deadbeef0000111122223333444455556666777788889999aaaabbbbccccdddd',
      'soomarpay-timestamp': '12345678',
      'soomarpay-event': 'payment.completed',
    });

    expect(result.handled).toBe(false);
  });
});
