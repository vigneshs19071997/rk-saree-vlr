// src/app/api/products/slug/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await connectDB();
    const product = await Product.findOne({ slug, active: true }).lean();
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    return NextResponse.json({ product });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
