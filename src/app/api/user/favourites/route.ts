// src/app/api/user/favourites/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const { productId } = await req.json();
    const userId = (session.user as { id: string }).id;

    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const isFav = user.favourites.some((id) => id.toString() === productId);

    if (isFav) {
      user.favourites = user.favourites.filter((id) => id.toString() !== productId) as typeof user.favourites;
    } else {
      user.favourites.push(productId);
    }

    await user.save();
    return NextResponse.json({ isFavourite: !isFav, favourites: user.favourites });
  } catch {
    return NextResponse.json({ error: 'Failed to update favourites' }, { status: 500 });
  }
}
