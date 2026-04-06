'use client';
// src/app/(admin)/admin/settings/page.tsx
import AdminLayout from '@/components/admin/AdminLayout';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [qrInfo, setQrInfo] = useState<{ adminUpiId: string; adminUpiName: string; qrDataUrl: string } | null>(null);

  useEffect(() => {
    axios.get('/api/payment').then(({ data }) => setQrInfo(data));
  }, []);

  return (
    <AdminLayout>
      <div className="p-6 max-w-2xl">
        <h1 className="text-2xl font-display text-[#3d1a2a] mb-6">Settings</h1>

        <div className="bg-white rounded-2xl border border-[#f0e8e0] p-6 mb-5">
          <h2 className="font-semibold text-[#3d1a2a] mb-1">Payment QR Code</h2>
          <p className="text-sm text-[#9e7b8a] mb-5">This QR is shown to customers during checkout</p>
          {qrInfo?.qrDataUrl ? (
            <div className="flex gap-6 items-start flex-wrap">
              <div className="p-4 bg-[#fdf8f3] rounded-2xl border border-[#f0e8e0]">
                <Image src={qrInfo.qrDataUrl} alt="UPI QR" width={180} height={180} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <div><p className="text-xs text-[#9e7b8a]">UPI ID</p><p className="font-mono font-bold text-[#3d1a2a]">{qrInfo.adminUpiId}</p></div>
                <div><p className="text-xs text-[#9e7b8a]">Display Name</p><p className="font-medium text-[#3d1a2a]">{qrInfo.adminUpiName}</p></div>
                <p className="text-xs text-[#9e7b8a] mt-3 max-w-xs">To update UPI details, edit the <code className="bg-[#f0e8e0] px-1 rounded">ADMIN_UPI_ID</code> and <code className="bg-[#f0e8e0] px-1 rounded">ADMIN_UPI_NAME</code> environment variables in your <code className="bg-[#f0e8e0] px-1 rounded">.env.local</code> file.</p>
              </div>
            </div>
          ) : <div className="w-48 h-48 shimmer rounded-2xl" />}
        </div>

        <div className="bg-white rounded-2xl border border-[#f0e8e0] p-6">
          <h2 className="font-semibold text-[#3d1a2a] mb-1">Environment Variables</h2>
          <p className="text-sm text-[#9e7b8a] mb-4">Configure these in your <code className="bg-[#f0e8e0] px-1.5 py-0.5 rounded text-xs">.env.local</code> file</p>
          <div className="space-y-2">
            {[
              ['ADMIN_UPI_ID', 'Your UPI payment address'],
              ['ADMIN_UPI_NAME', 'Display name on QR'],
              ['ADMIN_EMAIL', 'Receives order notifications'],
              ['EMAIL_USER', 'SMTP email for sending'],
              ['MONGODB_URI', 'MongoDB connection string'],
              ['CLOUDINARY_CLOUD_NAME', 'For product image uploads'],
              ['NEXT_PUBLIC_RETURN_DAYS', 'Return window in days (default: 7)'],
            ].map(([key, desc]) => (
              <div key={key} className="flex gap-3 py-2 border-b border-[#f0e8e0] last:border-0">
                <code className="text-xs bg-[#f7e8ef] text-[#8B1A4A] px-2 py-0.5 rounded font-mono w-56 flex-shrink-0">{key}</code>
                <span className="text-xs text-[#9e7b8a]">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
