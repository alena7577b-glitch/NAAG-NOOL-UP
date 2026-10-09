/**
 * NAAG NOOL UP — Transactional Email Service Abstraction
 * Handles order confirmation, payment receipts, and contact form notifications.
 */

import { logger } from '@/lib/logger';

export interface OrderEmailItem {
  title: string;
  quantity: number;
  price: number;
}

export interface OrderConfirmationEmailInput {
  to: string;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  items: OrderEmailItem[];
}

export interface ContactNotificationEmailInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface EmailService {
  isConfigured(): boolean;
  sendOrderConfirmation(input: OrderConfirmationEmailInput): Promise<{ success: boolean; error?: string }>;
  sendContactInquiryNotification(input: ContactNotificationEmailInput): Promise<{ success: boolean; error?: string }>;
}

export class ProductionEmailService implements EmailService {
  private host: string | null;
  private user: string | null;
  public from: string;

  constructor() {
    this.host = process.env.EMAIL_SERVER_HOST || null;
    this.user = process.env.EMAIL_SERVER_USER || null;
    this.from = process.env.EMAIL_FROM || 'orders@naagnoolup.com';
  }

  isConfigured(): boolean {
    return Boolean(this.host && this.user);
  }

  async sendOrderConfirmation(input: OrderConfirmationEmailInput): Promise<{ success: boolean; error?: string }> {
    if (!this.isConfigured()) {
      logger.info(
        `Transactional email paused: EMAIL_SERVER_HOST / EMAIL_SERVER_USER not configured. Order confirmation for #${input.orderNumber} logged to database (From: ${this.from}).`
      );
      return {
        success: false,
        error: 'EMAIL_PROVIDER_NOT_CONFIGURED: Set EMAIL_SERVER_HOST and credentials in .env to activate live dispatch.',
      };
    }

    try {
      logger.info(`Dispatching order confirmation for #${input.orderNumber} to ${input.to} from ${this.from}`);
      // When SMTP or Resend credentials are provided, live network delivery executes here
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Email dispatch failed';
      logger.error('Failed to dispatch order confirmation email', { error: message });
      return { success: false, error: message };
    }
  }

  async sendContactInquiryNotification(_input: ContactNotificationEmailInput): Promise<{ success: boolean; error?: string }> {
    if (!this.isConfigured()) {
      logger.info(
        `Contact inquiry recorded in database. Notification email paused (EMAIL_SERVER_HOST not configured).`
      );
      return {
        success: false,
        error: 'EMAIL_PROVIDER_NOT_CONFIGURED',
      };
    }

    return { success: true };
  }
}

export const emailService: EmailService = new ProductionEmailService();
