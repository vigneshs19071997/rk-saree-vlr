// src/types/index.ts

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  addresses: IAddress[];
  favourites: string[];
  createdAt: Date;
}

export interface IAddress {
  _id?: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  material: string;
  color: string[];
  occasion: string[];
  images: string[];
  stock: number;
  sku: string;
  tags: string[];
  featured: boolean;
  active: boolean;
  ratings: IRating[];
  averageRating: number;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRating {
  user: string;
  rating: number;
  review: string;
  createdAt: Date;
}

export interface IOrderItem {
  product: string | IProduct;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export type OrderStatus =
  | 'pending'
  | 'payment_received'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'return_requested'
  | 'return_approved'
  | 'returned'
  | 'cancelled';

export type PaymentMethod = 'upi' | 'upi_id' | 'cod';
export type PaymentStatus = 'pending' | 'received' | 'failed' | 'refunded';

export interface ITracking {
  status: OrderStatus;
  message: string;
  timestamp: Date;
  updatedBy?: string;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  user: string | IUser;
  items: IOrderItem[];
  shippingAddress: IAddress;
  subtotal: number;
  shippingCharge: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentTransactionId?: string;
  orderStatus: OrderStatus;
  tracking: ITracking[];
  estimatedDelivery?: Date;
  deliveredAt?: Date;
  returnRequestedAt?: Date;
  returnApprovedAt?: Date;
  returnDeadline?: Date;
  notes?: string;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICartItem {
  product: IProduct;
  quantity: number;
}

export interface ICart {
  items: ICartItem[];
  total: number;
  count: number;
}

export type ProductCategory =
  | 'Silk Sarees'
  | 'Cotton Sarees'
  | 'Georgette Sarees'
  | 'Chiffon Sarees'
  | 'Banarasi Sarees'
  | 'Kanjivaram Sarees'
  | 'Designer Sarees'
  | 'Party Wear'
  | 'Casual Wear'
  | 'Bridal Sarees';

export interface IPaymentDetails {
  method: PaymentMethod;
  upiId?: string;
  qrCode?: string;
  adminUpiId: string;
  adminUpiName: string;
}

export interface INotification {
  type: 'order_placed' | 'payment_received' | 'order_confirmed' | 'shipped' | 'delivered' | 'return_approved';
  to: string;
  subject: string;
  html: string;
}
