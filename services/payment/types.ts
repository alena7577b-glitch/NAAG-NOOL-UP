/**
 * NAAG NOOL UP — Payment Provider Abstraction Layer
 * Separates core application logic from specific payment providers (Visa/Mastercard/Somali Mobile Money).
 */

export interface InitiatePaymentInput {
  orderId: string;
  orderNumber: string;
  amount: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  returnUrl?: string;
}

export interface InitiatePaymentResult {
  success: boolean;
  transactionId: string;
  paymentUrl?: string;
  qrCodeUrl?: string;
  errorMessage?: string;
}

export interface VerifyPaymentResult {
  success: boolean;
  orderId: string;
  transactionId: string;
  status: 'PAID' | 'FAILED' | 'PENDING';
  rawResponse?: unknown;
}

export interface WebhookResult {
  handled: boolean;
  orderId?: string;
  status?: 'PAID' | 'FAILED';
  rawEvent?: unknown;
}

export interface PaymentProvider {
  providerName: string;

  initiatePayment(input: InitiatePaymentInput): Promise<InitiatePaymentResult>;
  verifyPayment(transactionId: string, orderId: string): Promise<VerifyPaymentResult>;
  handleWebhook(payload: unknown, headers: Record<string, string>): Promise<WebhookResult>;
  refundPayment(transactionId: string, amount: number): Promise<boolean>;
  getPaymentStatus(transactionId: string): Promise<VerifyPaymentResult>;
}
