'use client';
// src/app/(customer)/orders/page.tsx
import { useEffect, useState } from 'react';
import Navbar from '@/components/customer/Navbar';
import Footer from '@/components/customer/Footer';
import { IOrder } from '@/types';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { Package } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const STATUS_COLORS: Record<string, string> = {
  pending: 'text-amber-700 bg-amber-50 border-amber-200',
  payment_received: 'text-blue-700 bg-blue-50 border-blue-200',
  confirmed: 'text-blue-700 bg-blue-50 border-blue-200',
  processing: 'text-violet-700 bg-violet-50 border-violet-200',
  shipped: 'text-purple-700 bg-purple-50 border-purple-200',
  out_for_delivery: 'text-pink-700 bg-pink-50 border-pink-200',
  delivered: 'text-green-700 bg-green-50 border-green-200',
  return_requested: 'text-orange-700 bg-orange-50 border-orange-200',
  returned: 'text-gray-700 bg-gray-50 border-gray-200',
  cancelled: 'text-red-700 bg-red-50 border-red-200',
};

export default function OrdersPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) { router.push('/login'); return; }
    axios.get('/api/orders').then(({ data }) => { setOrders(data.orders); setLoading(false); })
      .catch(() => setLoading(false));
  }, [session, router]);

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-display text-[#3d1a2a] mb-8">My Orders</h1>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-32 shimmer rounded-2xl" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-[#f7e8ef] rounded-full flex items-center justify-center mx-auto mb-5">
              <Package size={40} className="text-[#8B1A4A]" />
            </div>
            <h2 className="text-xl font-display text-[#3d1a2a] mb-3">No orders yet</h2>
            <p className="text-[#9e7b8a] mb-6">Start shopping to see your orders here</p>
            <Link href="/shop" className="btn-primary inline-block">Browse Sarees</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link key={order._id} href={`/orders/${order._id}`}
                className="block bg-white rounded-2xl border border-[#f0e8e0] hover:border-[#d4a0b5] hover:shadow-md p-5 transition-all animate-fadeInUp">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-[#3d1a2a]">#{order.orderNumber}</p>
                    <p className="text-sm text-[#9e7b8a]">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-medium border capitalize ${STATUS_COLORS[order.orderStatus] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                      {order.orderStatus.replace(/_/g, ' ')}
                    </span>
                    <p className="font-bold text-[#8B1A4A] mt-1">₹{order.total.toLocaleString('en-IN')}</p>
                  </div>
                </div>
                <div className="flex gap-2 overflow-hidden">
                  {order.items.slice(0, 4).map((item, i) => (
                    <div key={i} className="relative w-14 h-16 rounded-lg overflow-hidden bg-[#fdf8f3] flex-shrink-0">
                      {item.image ? <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                        : <div className="w-full h-full flex items-center justify-center text-xl">🥻</div>}
                    </div>
                  ))}
                  {order.items.length > 4 && (
                    <div className="w-14 h-16 rounded-lg bg-[#f7e8ef] flex items-center justify-center text-sm text-[#8B1A4A] font-medium flex-shrink-0">
                      +{order.items.length - 4}
                    </div>
                  )}
                </div>
                <p className="text-xs text-[#8B1A4A] mt-3 font-medium">View details →</p>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
