// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, email, password, phone } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const user = await User.create({ name, email, password, phone, role: 'customer' });

    return NextResponse.json({
      message: 'Account created successfully',
      user: { id: user._id, name: user.name, email: user.email },
    }, { status: 201 });
  } catch (err) {
    console.error('Register error:', err);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
