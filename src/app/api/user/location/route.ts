// src/app/api/user/location/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Get IP from forwarded headers (works on Vercel/nginx)
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || '';

    // Skip for localhost
    if (!ip || ip === '127.0.0.1' || ip === '::1') {
      return NextResponse.json({ city: '', state: '', pincode: '', country: 'India', detected: false });
    }

    // Free geolocation API
    const res = await fetch(`https://ipapi.co/${ip}/json/`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error('Geo API failed');

    const data = await res.json();

    return NextResponse.json({
      city: data.city || '',
      state: data.region || '',
      pincode: data.postal || '',
      country: data.country_name || 'India',
      detected: true,
    });
  } catch {
    return NextResponse.json({ city: '', state: '', pincode: '', country: 'India', detected: false });
  }
}
