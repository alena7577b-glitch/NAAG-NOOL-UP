import { z } from 'zod';

export const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  customerEmail: z.string().email('Please enter a valid email address'),
  customerPhone: z.string().min(6, 'Please enter a valid phone number').max(25).optional().or(z.literal('')),
  addressLine1: z.string().min(3, 'Delivery address is required'),
  addressLine2: z.string().max(100).optional(),
  city: z.string().min(2, 'City is required'),
  postalCode: z.string().max(20).optional(),
  country: z.string().min(2, 'Country is required').default('United States'),
  deliveryNotes: z.string().max(500).optional(),
  paymentMethod: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, 'Product ID is required'),
        quantity: z.number().int().min(1, 'Quantity must be at least 1').max(99),
      })
    )
    .min(1, 'Your shopping bag is empty'),
});

export type CheckoutFormInput = z.infer<typeof checkoutSchema>;

export interface CheckoutResult {
  success: boolean;
  orderId?: string;
  orderNumber?: string;
  totalAmount?: number;
  paymentUrl?: string;
  transactionId?: string;
  error?: string;
}
