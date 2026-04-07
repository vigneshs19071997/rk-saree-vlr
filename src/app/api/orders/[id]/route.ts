// src/app/api/orders/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Order } from '@/models/Order';
import { User } from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { sendOrderEmail } from '@/lib/email';
import { OrderStatus } from '@/types';

const STATUS_MESSAGES: Record<OrderStatus, string> = {
  pending: 'Order placed. Awaiting payment.',
  payment_received: 'Payment received! We are processing your order.',
  confirmed: 'Your order has been confirmed and is being prepared.',
  processing: 'Your saree is being carefully packed.',
  shipped: 'Your order has been shipped! Track using the details above.',
  out_for_delivery: 'Your order is out for delivery today!',
  delivered: 'Your order has been delivered. Enjoy your saree! 🎉',
  return_requested: 'Return request received. We will review and get back to you.',
  return_approved: 'Return approved. Please pack the item and await pickup.',
  returned: 'Return completed. Refund will be processed in 5-7 business days.',
  cancelled: 'Your order has been cancelled.',
};

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const order = await Order.findById(id).populate('user', 'name email').populate('items.product', 'name images').lean();
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    const user = session.user as { id: string; role: string };
    const orderDoc = order as unknown as { user: { _id: string } | string };
    const orderUserId = typeof orderDoc.user === 'object' ? orderDoc.user._id.toString() : orderDoc.user?.toString();
    if (user.role !== 'admin' && orderUserId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const { action, status, trackingNote, paymentTransactionId, adminNotes } = await req.json();
    const sessionUser = session.user as { id: string; role: string; name: string; email: string };

    const order = await Order.findById(id).populate('user', 'name email');
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    const orderUser = order.user as { _id: string; name: string; email: string };

    // Admin: update order status
    if (action === 'updateStatus' && sessionUser.role === 'admin') {
      const newStatus = status as OrderStatus;
      const message = trackingNote || STATUS_MESSAGES[newStatus];

      order.orderStatus = newStatus;
      order.tracking.push({ status: newStatus, message, timestamp: new Date(), updatedBy: sessionUser.name });

      if (adminNotes) order.adminNotes = adminNotes;
      if (paymentTransactionId) order.paymentTransactionId = paymentTransactionId;

      if (newStatus === 'payment_received') order.paymentStatus = 'received';
      if (newStatus === 'delivered') {
        order.deliveredAt = new Date();
        const returnDays = Number(process.env.NEXT_PUBLIC_RETURN_DAYS || 7);
        order.returnDeadline = new Date(Date.now() + returnDays * 24 * 60 * 60 * 1000);
      }

      await order.save();

      // Notify customer
      await sendOrderEmail(orderUser.email, orderUser.name, order.toObject(), newStatus, message).catch(console.error);

      return NextResponse.json({ order });
    }

    // Customer: request return
    if (action === 'requestReturn') {
      const orderOwnerId = orderUser._id.toString();
      if (sessionUser.role !== 'admin' && orderOwnerId !== sessionUser.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      if (order.orderStatus !== 'delivered') {
        return NextResponse.json({ error: 'Only delivered orders can be returned' }, { status: 400 });
      }
      if (order.returnDeadline && new Date() > order.returnDeadline) {
        return NextResponse.json({ error: 'Return window has expired' }, { status: 400 });
      }

      order.orderStatus = 'return_requested';
      order.returnRequestedAt = new Date();
      order.tracking.push({ status: 'return_requested', message: 'Customer requested a return.', timestamp: new Date() });
      await order.save();

      await sendOrderEmail(orderUser.email, orderUser.name, order.toObject(), 'return_requested').catch(console.error);
      return NextResponse.json({ order });
    }

    // Customer: confirm payment (provide UTR/transaction ID)
    if (action === 'confirmPayment') {
      const orderOwnerId = orderUser._id.toString();
      if (orderOwnerId !== sessionUser.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      if (paymentTransactionId) order.paymentTransactionId = paymentTransactionId;
      order.tracking.push({ status: 'pending', message: 'Customer submitted payment confirmation. Awaiting admin verification.', timestamp: new Date() });
      await order.save();
      return NextResponse.json({ order });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    console.error('Order patch error:', err);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
