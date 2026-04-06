// src/app/api/payment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const amount = searchParams.get('amount');

  const adminUpiId = process.env.ADMIN_UPI_ID || 'admin@upi';
  const adminUpiName = process.env.ADMIN_UPI_NAME || 'Silk Drapes';

  // Generate UPI deep-link QR
  const upiString = `upi://pay?pa=${adminUpiId}&pn=${encodeURIComponent(adminUpiName)}&am=${amount || ''}&cu=INR&tn=${encodeURIComponent('Silk Drapes Order')}`;

  let qrDataUrl = '';
  try {
    qrDataUrl = await QRCode.toDataURL(upiString, {
      width: 300,
      margin: 2,
      color: { dark: '#3d1a2a', light: '#fdf8f3' },
    });
  } catch (e) {
    console.error('QR generation failed:', e);
  }

  return NextResponse.json({
    adminUpiId,
    adminUpiName,
    qrDataUrl,
    upiString,
  });
}
