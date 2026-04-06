'use client';
// src/app/(customer)/shop/page.tsx
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/customer/Navbar';
import Footer from '@/components/customer/Footer';

const ShopContent = dynamic(() => import('@/components/customer/ShopContent'), { ssr: false });

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <Suspense fallback={<ShopSkeleton />}>
        <ShopContent />
      </Suspense>
      <Footer />
    </div>
  );
}

function ShopSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="h-8 w-52 shimmer rounded-xl mb-6" />
      <div className="flex gap-6">
        <aside className="hidden md:block w-56 h-96 shimmer rounded-2xl flex-shrink-0" />
        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden">
              <div className="aspect-[3/4] shimmer" />
              <div className="p-4 space-y-2">
                <div className="h-3 shimmer rounded w-2/3" />
                <div className="h-4 shimmer rounded" />
                <div className="h-4 shimmer rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
