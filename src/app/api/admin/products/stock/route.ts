// src/app/api/admin/products/stock/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

// PATCH /api/admin/products/stock
// Body: { updates: [{ id: string, stock: number }] }
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role: string }).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { updates } = await req.json() as { updates: { id: string; stock: number }[] };

    if (!Array.isArray(updates)) {
      return NextResponse.json({ error: 'updates must be an array' }, { status: 400 });
    }

    const results = await Promise.all(
      updates.map(({ id, stock }) =>
        Product.findByIdAndUpdate(id, { stock }, { new: true }).select('name stock')
      )
    );

    return NextResponse.json({ updated: results.filter(Boolean) });
  } catch {
    return NextResponse.json({ error: 'Failed to update stock' }, { status: 500 });
  }
}
