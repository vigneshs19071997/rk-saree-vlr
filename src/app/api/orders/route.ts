// src/app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Order } from '@/models/Order';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { sendOrderEmail, sendAdminOrderAlert } from '@/lib/email';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const user = session.user as { id: string; role: string };
    const query = user.role === 'admin' ? {} : { user: user.id };

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Order.countDocuments(query),
    ]);

    return NextResponse.json({ orders, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Please login to place an order' }, { status: 401 });

    await connectDB();
    const body = await req.json();
    console.log('Order request body:', body);
    
    const user = session.user as { id: string; name: string; email: string };

    // Generate orderNumber before creating the order
    const count = await Order.countDocuments({});
    const orderNumber = `SD${Date.now()}${String(count + 1).padStart(4, '0')}`;

    const order = await Order.create({
      ...body,
      user: user.id,
      orderNumber,
      orderStatus: 'pending',
      paymentStatus: 'pending',
      tracking: [{ status: 'pending', message: 'Order placed successfully. Awaiting payment confirmation.', timestamp: new Date() }],
    });

    console.log('order', order);
    

    // Send emails
    await Promise.allSettled([
      sendOrderEmail(user.email, user.name, order.toObject(), 'pending',
        body.paymentMethod === 'cod'
          ? 'Your order has been placed with Cash on Delivery. Pay ₹' + body.total + ' at the time of delivery.'
          : 'Once we receive your payment, we will confirm your order shortly.'),
      sendAdminOrderAlert(order.toObject(), user.name, user.email),
    ]);

    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    console.error('Order create error:', err);
    return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
  }
}
