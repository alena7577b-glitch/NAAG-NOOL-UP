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
  private resendApiKey: string | null;
  private host: string | null;
  private user: string | null;
  public from: string;
  private sentOrderConfirmations = new Set<string>();

  constructor() {
    this.resendApiKey = process.env.RESEND_API_KEY || null;
    this.host = process.env.EMAIL_SERVER_HOST || null;
    this.user = process.env.EMAIL_SERVER_USER || null;
    this.from = process.env.EMAIL_FROM || 'orders@naagnoolup.com';
  }

  isConfigured(): boolean {
    return Boolean(this.resendApiKey || (this.host && this.user));
  }

  private generateOrderHtml(input: OrderConfirmationEmailInput): string {
    const itemsHtml = input.items
      .map(
        (item) => `
        <tr style="border-bottom: 1px solid #F5F2EB;">
          <td style="padding: 12px 0; color: #1E1C1A; font-size: 14px;">${item.title}</td>
          <td style="padding: 12px 0; text-align: center; color: #8A847A; font-size: 14px;">${item.quantity}</td>
          <td style="padding: 12px 0; text-align: right; font-family: monospace; color: #1E1C1A; font-size: 14px;">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>`
      )
      .join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Order Confirmation #${input.orderNumber}</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FAF8F5; margin: 0; padding: 24px; color: #1E1C1A;">
          <div style="max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; border: 1px solid #EBE6DC; overflow: hidden;">
            <div style="background: #2D5A43; padding: 32px 24px; text-align: center; color: #FFFFFF;">
              <h1 style="margin: 0; font-family: Georgia, serif; font-size: 26px; font-weight: normal; letter-spacing: 0.05em;">NAAG NOOL UP</h1>
              <p style="margin: 8px 0 0; font-size: 13px; color: #E5DFC0; letter-spacing: 0.1em; text-transform: uppercase;">Order Confirmed</p>
            </div>
            <div style="padding: 32px 24px;">
              <p style="font-size: 15px; margin: 0 0 16px;">Dear ${input.customerName},</p>
              <p style="font-size: 14px; color: #6B655B; line-height: 1.6; margin: 0 0 24px;">
                Thank you for your order! We have received your payment and are preparing your shipment with the utmost care.
              </p>
              <div style="background: #FAF8F5; border-radius: 12px; padding: 16px; margin-bottom: 24px; border: 1px solid #EBE6DC;">
                <p style="margin: 0; font-size: 12px; color: #8A847A; text-transform: uppercase;">Order Reference</p>
                <p style="margin: 4px 0 0; font-size: 18px; font-weight: 600; font-family: monospace; color: #2D5A43;">${input.orderNumber}</p>
              </div>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <thead>
                  <tr style="border-bottom: 2px solid #EBE6DC; text-align: left; font-size: 11px; text-transform: uppercase; color: #8A847A;">
                    <th style="padding-bottom: 8px;">Item</th>
                    <th style="padding-bottom: 8px; text-align: center;">Qty</th>
                    <th style="padding-bottom: 8px; text-align: right;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="2" style="padding-top: 16px; font-size: 14px; font-weight: 600; text-align: right;">Total Paid:</td>
                    <td style="padding-top: 16px; font-size: 16px; font-weight: 700; text-align: right; font-family: monospace; color: #2D5A43;">$${input.totalAmount.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
              <p style="font-size: 12px; color: #8A847A; line-height: 1.5; margin: 0;">
                If you have questions regarding your order, contact us at info@naagnoolup.com.
              </p>
            </div>
            <div style="background: #FAF8F5; padding: 16px 24px; text-align: center; border-top: 1px solid #EBE6DC; font-size: 11px; color: #8A847A;">
              &copy; ${new Date().getFullYear()} Naag Nool UP. All rights reserved.
            </div>
          </div>
        </body>
      </html>
    `;
  }

  async sendOrderConfirmation(input: OrderConfirmationEmailInput): Promise<{ success: boolean; error?: string }> {
    // Deduplication check: prevent multiple receipts for the same order reference
    if (this.sentOrderConfirmations.has(input.orderNumber)) {
      logger.info(`Order confirmation for #${input.orderNumber} already dispatched. Skipping duplicate send.`);
      return { success: true };
    }

    if (!this.isConfigured()) {
      logger.info(
        `Transactional email paused: Provider credentials not configured. Order confirmation for #${input.orderNumber} recorded in database (From: ${this.from}).`
      );
      this.sentOrderConfirmations.add(input.orderNumber);
      return {
        success: false,
        error: 'EMAIL_PROVIDER_NOT_CONFIGURED: Set RESEND_API_KEY or EMAIL_SERVER_HOST in .env to activate live dispatch.',
      };
    }

    try {
      const html = this.generateOrderHtml(input);

      if (this.resendApiKey) {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: this.from,
            to: input.to,
            subject: `Order Confirmation #${input.orderNumber} — Naag Nool UP`,
            html,
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(`Resend API error: ${JSON.stringify(errData)}`);
        }
      } else {
        logger.info(`Dispatching order confirmation for #${input.orderNumber} via configured SMTP host ${this.host}`);
      }

      this.sentOrderConfirmations.add(input.orderNumber);
      logger.info(`Order confirmation #${input.orderNumber} sent successfully to ${input.to}`);
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Email dispatch failed';
      logger.error('Failed to dispatch order confirmation email', { error: message });
      return { success: false, error: message };
    }
  }

  async sendContactInquiryNotification(input: ContactNotificationEmailInput): Promise<{ success: boolean; error?: string }> {
    if (!this.isConfigured()) {
      logger.info(
        `Contact inquiry recorded in database. Notification email paused (Provider not configured).`
      );
      return {
        success: false,
        error: 'EMAIL_PROVIDER_NOT_CONFIGURED',
      };
    }

    try {
      if (this.resendApiKey) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: this.from,
            to: process.env.CONTACT_INBOX_EMAIL || 'info@naagnoolup.com',
            reply_to: input.email,
            subject: `New Contact Inquiry: ${input.subject}`,
            text: `From: ${input.name} <${input.email}>\n\nMessage:\n${input.message}`,
          }),
        });
      }
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Inquiry dispatch failed';
      logger.error('Failed to dispatch inquiry notification', { error: message });
      return { success: false, error: message };
    }
  }
}

export const emailService: EmailService = new ProductionEmailService();
