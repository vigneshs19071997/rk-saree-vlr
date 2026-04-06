// src/app/api/admin/products/featured/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role: string }).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await connectDB();
    const { id, featured } = await req.json();
    const product = await Product.findByIdAndUpdate(id, { featured }, { new: true }).select('name featured');
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    return NextResponse.json({ product });
  } catch {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
