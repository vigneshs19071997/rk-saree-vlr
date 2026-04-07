// src/app/api/user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const user = await User.findById((session.user as { id: string }).id)
      .select('-password')
      .populate('favourites', 'name images price discountPrice category')
      .lean();

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const { name, phone, addresses } = await req.json();
    const userId = (session.user as { id: string }).id;

    const user = await User.findByIdAndUpdate(
      userId,
      { ...(name && { name }), ...(phone && { phone }), ...(addresses && { addresses }) },
      { new: true, runValidators: true }
    ).select('-password');

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
