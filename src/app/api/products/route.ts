// src/app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';
    const featured = searchParams.get('featured');
    const material = searchParams.get('material');

    const query: Record<string, unknown> = { active: true };

    if (category) query.category = category;
    if (material) query.material = { $regex: material, $options: 'i' };
    if (search) query.$text = { $search: search };
    if (featured === 'true') query.featured = true;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) (query.price as Record<string, number>).$gte = Number(minPrice);
      if (maxPrice) (query.price as Record<string, number>).$lte = Number(maxPrice);
    }

    const sortObj: Record<string, 1 | -1> = { [sort]: order === 'asc' ? 1 : -1 };

    const [products, total] = await Promise.all([
      Product.find(query).sort(sortObj).skip((page - 1) * limit).limit(limit).lean(),
      Product.countDocuments(query),
    ]);

    return NextResponse.json({
      products,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role: string }).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    // Generate SKU if not provided
    if (!body.sku) {
      body.sku = `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    }

    // Generate slug from name
    if (!body.slug && body.name) {
      body.slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      // Ensure uniqueness
      const exists = await Product.findOne({ slug: body.slug });
      if (exists) body.slug = `${body.slug}-${Date.now()}`;
    }

    const product = await Product.create(body);
    return NextResponse.json({ product }, { status: 201 });
  } catch (err) {
    console.error('Product create error:', err);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
