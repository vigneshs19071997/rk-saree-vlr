// src/app/api/admin/stats/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';
import { User } from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role: string }).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const [
      totalOrders, pendingOrders, totalRevenue, totalProducts, totalUsers,
      recentOrders, lowStockProducts,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ orderStatus: 'pending' }),
      Order.aggregate([{ $match: { paymentStatus: 'received' } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
      Product.countDocuments({ active: true }),
      User.countDocuments({ role: 'customer' }),
      Order.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(5).lean(),
      Product.find({ stock: { $lte: 5 }, active: true }).select('name stock').lean(),
    ]);

    return NextResponse.json({
      totalOrders,
      pendingOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalProducts,
      totalUsers,
      recentOrders,
      lowStockProducts,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
