export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ProductImage {
  id: number;
  url: string;
}

export interface Product {
  id: number;
  name: string;
  image?: string;
  price: number;
  active: boolean;
  description?: string;
  categoryId?: number;
  categoryName?: string;
  createdDate?: string;
  updatedDate?: string;
  images?: ProductImage[];
  favouriteCount?: number;
  stock?: number;
  shelfLifeDays?: number;
  currentPrice?: number;
  discountPercent?: number;
  nearestExpiry?: string;
  daysLeft?: number;
}

export interface Category {
  id: number;
  name: string;
  image?: string;
  active: boolean;
  parentCategoryId?: number;
  parentCategoryName?: string;
  children?: Category[];
}

export interface CartItem {
  productId: number;
  productName: string;
  productImage?: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  quantity: number;
  subtotal: number;
  available: boolean;
}

export interface Cart {
  items: CartItem[];
  totalQuantity: number;
  subtotal: number;
}

export type PaymentMethod = 'COD' | 'BANK_TRANSFER';
export type PaymentStatus = 'UNPAID' | 'PAID';

export interface OrderItem {
  productId: number;
  productName: string;
  productImage?: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: number;
  orderCode: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  note?: string;
  orderDate: string;
  total: number;
  status?: string;
  statusId?: number;
  couponCode?: string;
  userId?: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  items: OrderItem[];
}

export interface OrderTracking {
  id?: number;
  status: string;
  note?: string;
  time: string;
}

export interface OrderStatus {
  id: number;
  code: string;
  name: string;
  description?: string;
}

export type DiscountType = 'PERCENT' | 'FIXED';

export interface Coupon {
  id: number;
  code: string;
  name: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  startDate?: string;
  endDate?: string;
  usageLimit?: number;
  usedCount?: number;
  active: boolean;
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  mobile?: string;
  address?: string;
  avatar?: string;
  status?: string;
  createdDate?: string;
  updatedDate?: string;
  roles?: string[];
}

export interface Dashboard {
  totalUsers: number;
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  totalCoupons: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
}

export type BatchStatus = 'ACTIVE' | 'SOLD_OUT' | 'EXPIRED';

export interface Batch {
  id: number;
  productId: number;
  productName?: string;
  initialQuantity: number;
  remainingQuantity: number;
  wastedQuantity?: number;
  costPrice: number;
  receivedDate: string;
  expiryDate?: string;
  daysLeft?: number;
  status: BatchStatus;
}

export interface WasteReportItem {
  productId: number;
  productName: string;
  wastedQuantity: number;
  totalLoss: number;
}

export interface WasteReport {
  from: string;
  to: string;
  totalWastedQuantity: number;
  totalLoss: number;
  items: WasteReportItem[];
}

