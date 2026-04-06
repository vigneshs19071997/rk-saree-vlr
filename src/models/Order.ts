// src/models/Order.ts
import mongoose, { Schema, Document } from 'mongoose';
import { OrderStatus, PaymentMethod, PaymentStatus } from '@/types';

export interface IOrderDocument extends Document {
  orderNumber: string;
  user: mongoose.Types.ObjectId;
  items: {
    product: mongoose.Types.ObjectId;
    name: string;
    image: string;
    price: number;
    quantity: number;
  }[];
  shippingAddress: {
    fullName: string; phone: string; line1: string; line2?: string;
    city: string; state: string; pincode: string; country: string;
  };
  subtotal: number;
  shippingCharge: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentTransactionId?: string;
  orderStatus: OrderStatus;
  tracking: { status: OrderStatus; message: string; timestamp: Date; updatedBy?: string }[];
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

const AddressSnapshotSchema = new Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  line1: { type: String, required: true },
  line2: String,
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  country: { type: String, default: 'India' },
});

const TrackingSchema = new Schema({
  status: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  updatedBy: String,
});

const OrderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const ORDER_STATUSES: OrderStatus[] = [
  'pending', 'payment_received', 'confirmed', 'processing',
  'shipped', 'out_for_delivery', 'delivered',
  'return_requested', 'return_approved', 'returned', 'cancelled',
];

const OrderSchema = new Schema<IOrderDocument>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [OrderItemSchema],
    shippingAddress: AddressSnapshotSchema,
    subtotal: { type: Number, required: true },
    shippingCharge: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['upi', 'upi_id', 'cod'], required: true },
    paymentStatus: { type: String, enum: ['pending', 'received', 'failed', 'refunded'], default: 'pending' },
    paymentTransactionId: String,
    orderStatus: { type: String, enum: ORDER_STATUSES, default: 'pending' },
    tracking: [TrackingSchema],
    estimatedDelivery: Date,
    deliveredAt: Date,
    returnRequestedAt: Date,
    returnApprovedAt: Date,
    returnDeadline: Date,
    notes: String,
    adminNotes: String,
  },
  { timestamps: true }
);

// Auto-generate order number
OrderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const count = await Order.countDocuments({});
    this.orderNumber = `SD${Date.now()}${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ orderStatus: 1 });

export const Order = mongoose.models.Order || mongoose.model<IOrderDocument>('Order', OrderSchema);
