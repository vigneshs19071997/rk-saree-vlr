'use client';
// src/app/(admin)/admin/dashboard/page.tsx
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import axios from 'axios';
import Link from 'next/link';
import { ShoppingBag, Package, Users, DollarSign, Clock, AlertCircle, ArrowRight } from 'lucide-react';

interface Stats {
  totalOrders: number; pendingOrders: number; totalRevenue: number;
  totalProducts: number; totalUsers: number;
  recentOrders: { _id: string; orderNumber: string; total: number; orderStatus: string; createdAt: string; user: { name: string } }[];
  lowStockProducts: { _id: string; name: string; stock: number }[];
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'text-amber-700 bg-amber-50', confirmed: 'text-blue-700 bg-blue-50',
  shipped: 'text-purple-700 bg-purple-50', delivered: 'text-green-700 bg-green-50',
  cancelled: 'text-red-700 bg-red-50', payment_received: 'text-blue-700 bg-blue-50',
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/admin/stats').then(({ data }) => { setStats(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-[#8B1A4A]', bg: 'bg-[#f7e8ef]' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', alert: stats.pendingOrders > 0 },
    { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Active Products', value: stats.totalProducts, icon: Package, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Customers', value: stats.totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
  ] : [];

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-display text-[#3d1a2a]">Dashboard</h1>
            <p className="text-[#9e7b8a] text-sm mt-0.5">Welcome back, Admin</p>
          </div>
          <p className="text-sm text-[#9e7b8a]">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {loading ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-28 shimmer rounded-2xl" />) :
            statCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.label} className={`bg-white rounded-2xl border p-5 transition-shadow hover:shadow-md ${card.alert ? 'border-amber-200' : 'border-[#f0e8e0]'}`}>
                  <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
                    <Icon size={20} className={card.color} />
                  </div>
                  <p className="text-xs text-[#9e7b8a] mb-1">{card.label}</p>
                  <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
                  {card.alert && <p className="text-xs text-amber-600 mt-1">Needs attention</p>}
                </div>
              );
            })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent orders */}
          <div className="bg-white rounded-2xl border border-[#f0e8e0] p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[#3d1a2a]">Recent Orders</h2>
              <Link href="/admin/orders" className="text-xs text-[#8B1A4A] hover:underline flex items-center gap-1">View all <ArrowRight size={12} /></Link>
            </div>
            {loading ? <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 shimmer rounded-xl" />)}</div> :
              <div className="space-y-3">
                {stats?.recentOrders.map((order) => (
                  <Link key={order._id} href={`/admin/orders?id=${order._id}`}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-[#fdf8f3] transition-colors">
                    <div>
                      <p className="text-sm font-medium text-[#3d1a2a]">#{order.orderNumber}</p>
                      <p className="text-xs text-[#9e7b8a]">{order.user?.name}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-0.5 rounded-lg capitalize ${STATUS_COLORS[order.orderStatus] || 'bg-gray-50 text-gray-600'}`}>
                        {order.orderStatus.replace(/_/g, ' ')}
                      </span>
                      <p className="text-sm font-bold text-[#8B1A4A] mt-0.5">₹{order.total.toLocaleString('en-IN')}</p>
                    </div>
                  </Link>
                ))}
              </div>}
          </div>

          {/* Low stock */}
          <div className="bg-white rounded-2xl border border-[#f0e8e0] p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[#3d1a2a]">Low Stock Alert</h2>
              <Link href="/admin/products" className="text-xs text-[#8B1A4A] hover:underline flex items-center gap-1">Manage <ArrowRight size={12} /></Link>
            </div>
            {loading ? <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-12 shimmer rounded-xl" />)}</div> :
              stats?.lowStockProducts.length === 0 ? (
                <p className="text-sm text-[#9e7b8a] text-center py-6">All products are well stocked ✅</p>
              ) : (
                <div className="space-y-2">
                  {stats?.lowStockProducts.map((p) => (
                    <div key={p._id} className="flex items-center justify-between p-3 rounded-xl bg-[#fdf8f3]">
                      <div className="flex items-center gap-2">
                        <AlertCircle size={16} className={p.stock === 0 ? 'text-red-500' : 'text-amber-500'} />
                        <p className="text-sm text-[#3d1a2a] line-clamp-1">{p.name}</p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${p.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                        {p.stock} left
                      </span>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
