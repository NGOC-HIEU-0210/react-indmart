import { Order, OrderItem, OrderTracking, PaymentMethod } from '@/types';

export interface CheckoutPayload {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  note?: string;
  couponCode?: string;
  paymentMethod: PaymentMethod;
  items?: { productId: number; quantity: number }[];
}

export type { Order, OrderItem, OrderTracking, PaymentMethod };

