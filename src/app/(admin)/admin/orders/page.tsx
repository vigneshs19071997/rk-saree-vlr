'use client';
// src/app/(admin)/admin/orders/page.tsx
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { IOrder, OrderStatus } from '@/types';
import axios from 'axios';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { ChevronDown, Search, X, MapPin, Package } from 'lucide-react';

const ALL_STATUSES: OrderStatus[] = ['pending','payment_received','confirmed','processing','shipped','out_for_delivery','delivered','return_requested','return_approved','returned','cancelled'];

const STATUS_COLORS: Record<string, string> = {
  pending: 'text-amber-700 bg-amber-50 border-amber-200',
  payment_received: 'text-blue-700 bg-blue-50 border-blue-200',
  confirmed: 'text-blue-700 bg-blue-50 border-blue-200',
  processing: 'text-violet-700 bg-violet-50 border-violet-200',
  shipped: 'text-purple-700 bg-purple-50 border-purple-200',
  out_for_delivery: 'text-pink-700 bg-pink-50 border-pink-200',
  delivered: 'text-green-700 bg-green-50 border-green-200',
  return_requested: 'text-orange-700 bg-orange-50 border-orange-200',
  return_approved: 'text-cyan-700 bg-cyan-50 border-cyan-200',
  returned: 'text-gray-700 bg-gray-50 border-gray-200',
  cancelled: 'text-red-700 bg-red-50 border-red-200',
};

const STATUS_MESSAGES: Record<string, string> = {
  pending: 'Order placed. Awaiting payment.',
  payment_received: 'Payment received! Preparing your order.',
  confirmed: 'Your order has been confirmed.',
  processing: 'We are carefully packing your saree.',
  shipped: 'Your order is on the way!',
  out_for_delivery: 'Your delivery is out today!',
  delivered: 'Order delivered successfully.',
  return_requested: 'Return request received.',
  return_approved: 'Return approved. Please arrange pickup.',
  returned: 'Return completed. Refund will be processed.',
  cancelled: 'Your order has been cancelled.',
};

interface ExtendedOrder extends IOrder {
  user: { _id: string; name: string; email: string };
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<ExtendedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ExtendedOrder | null>(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState<OrderStatus>('confirmed');
  const [trackingNote, setTrackingNote] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/orders?limit=50');
      setOrders(data.orders);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleUpdateStatus = async () => {
    if (!selected) return;
    setUpdating(true);
    try {
      const { data } = await axios.patch(`/api/orders/${selected._id}`, {
        action: 'updateStatus', status: newStatus,
        trackingNote: trackingNote || STATUS_MESSAGES[newStatus],
        adminNotes,
      });
      setSelected(data.order);
      setOrders((prev) => prev.map((o) => o._id === data.order._id ? data.order : o));
      toast.success(`Order updated to "${newStatus.replace(/_/g, ' ')}"`);
      setTrackingNote('');
    } catch { toast.error('Failed to update order'); }
    finally { setUpdating(false); }
  };

  const filtered = orders.filter((o) => {
    if (filterStatus && o.orderStatus !== filterStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      return o.orderNumber.toLowerCase().includes(q) || o.user?.name?.toLowerCase().includes(q) || o.user?.email?.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <AdminLayout>
      <div className="flex h-[calc(100vh-64px)] lg:h-screen overflow-hidden">
        {/* Orders list */}
        <div className={`${selected ? 'hidden lg:flex' : 'flex'} flex-col w-full lg:w-96 border-r border-[#f0e8e0] bg-white`}>
          <div className="p-4 border-b border-[#f0e8e0] space-y-3">
            <h1 className="text-lg font-display text-[#3d1a2a]">Orders <span className="text-[#9e7b8a] text-sm font-sans">({orders.length})</span></h1>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9e7b8a]" />
              <input placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-9 py-2 text-sm" />
            </div>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-field py-2 text-sm">
              <option value="">All Statuses</option>
              {ALL_STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
            </select>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 space-y-3">{[1,2,3,4,5].map(i => <div key={i} className="h-20 shimmer rounded-xl" />)}</div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center text-[#9e7b8a]"><Package size={32} className="mx-auto mb-2 opacity-40" /><p>No orders found</p></div>
            ) : filtered.map((order) => (
              <button key={order._id} onClick={() => { setSelected(order); setNewStatus(order.orderStatus); setAdminNotes(order.adminNotes || ''); }}
                className={`w-full text-left p-4 border-b border-[#f0e8e0] hover:bg-[#fdf8f3] transition-colors ${selected?._id === order._id ? 'bg-[#f7e8ef]' : ''}`}>
                <div className="flex items-start justify-between mb-1.5">
                  <div>
                    <p className="text-sm font-semibold text-[#3d1a2a]">#{order.orderNumber}</p>
                    <p className="text-xs text-[#9e7b8a]">{order.user?.name}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-0.5 rounded-lg border capitalize ${STATUS_COLORS[order.orderStatus] || ''}`}>
                      {order.orderStatus.replace(/_/g, ' ')}
                    </span>
                    <p className="text-sm font-bold text-[#8B1A4A] mt-0.5">₹{order.total.toLocaleString('en-IN')}</p>
                  </div>
                </div>
                <p className="text-xs text-[#b89aa8]">{new Date(order.createdAt).toLocaleString('en-IN')}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Order detail */}
        {selected ? (
          <div className="flex-1 overflow-y-auto bg-[#fdf8f3]">
            <div className="p-5">
              <div className="flex items-center gap-3 mb-5">
                <button onClick={() => setSelected(null)} className="lg:hidden p-2 text-[#9e7b8a] hover:text-[#3d1a2a]">←</button>
                <div className="flex-1">
                  <h2 className="text-lg font-display text-[#3d1a2a]">#{selected.orderNumber}</h2>
                  <p className="text-sm text-[#9e7b8a]">{selected.user?.name} · {selected.user?.email}</p>
                </div>
                <span className={`px-3 py-1.5 rounded-xl text-sm font-medium capitalize border ${STATUS_COLORS[selected.orderStatus] || ''}`}>
                  {selected.orderStatus.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Update status */}
              <div className="bg-white rounded-2xl border border-[#f0e8e0] p-5 mb-4">
                <h3 className="font-semibold text-[#3d1a2a] mb-4">Update Order Status</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-[#9e7b8a] mb-1.5">New Status</label>
                    <select value={newStatus} onChange={(e) => setNewStatus(e.target.value as OrderStatus)} className="input-field">
                      {ALL_STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#9e7b8a] mb-1.5">Customer Message (sent via email)</label>
                    <input type="text" value={trackingNote}
                      onChange={(e) => setTrackingNote(e.target.value)}
                      placeholder={STATUS_MESSAGES[newStatus]}
                      className="input-field text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#9e7b8a] mb-1.5">Admin Notes (internal only)</label>
                    <input type="text" value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Internal notes..." className="input-field text-sm" />
                  </div>
                  <button onClick={handleUpdateStatus} disabled={updating}
                    className="btn-primary w-full flex items-center justify-center gap-2">
                    {updating ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Updating...</> : 'Update Status & Notify Customer'}
                  </button>
                </div>
              </div>

              {/* Items */}
              <div className="bg-white rounded-2xl border border-[#f0e8e0] p-5 mb-4">
                <h3 className="font-semibold text-[#3d1a2a] mb-3">Order Items</h3>
                <div className="space-y-3">
                  {selected.items.map((item, i) => (
                    <div key={i} className="flex gap-3 items-center">
                      <div className="relative w-14 h-16 rounded-lg overflow-hidden bg-[#fdf8f3] flex-shrink-0">
                        {item.image ? <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                          : <div className="w-full h-full flex items-center justify-center text-xl">🥻</div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#3d1a2a] line-clamp-1">{item.name}</p>
                        <p className="text-xs text-[#9e7b8a]">Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</p>
                      </div>
                      <span className="font-bold text-[#8B1A4A] text-sm">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#f0e8e0] mt-3 pt-3 space-y-1 text-sm">
                  <div className="flex justify-between text-[#9e7b8a]"><span>Subtotal</span><span>₹{selected.subtotal.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between text-[#9e7b8a]"><span>Shipping</span><span>{selected.shippingCharge === 0 ? 'FREE' : `₹${selected.shippingCharge}`}</span></div>
                  <div className="flex justify-between font-bold text-base"><span className="text-[#3d1a2a]">Total</span><span className="text-[#8B1A4A]">₹{selected.total.toLocaleString('en-IN')}</span></div>
                </div>
              </div>

              {/* Address + Payment */}
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-2xl border border-[#f0e8e0] p-4">
                  <h3 className="font-semibold text-[#3d1a2a] mb-2 text-sm flex items-center gap-1.5"><MapPin size={14} className="text-[#8B1A4A]" /> Delivery Address</h3>
                  <p className="font-medium text-[#3d1a2a] text-xs">{selected.shippingAddress.fullName}</p>
                  <p className="text-xs text-[#9e7b8a]">{selected.shippingAddress.line1}{selected.shippingAddress.line2 ? `, ${selected.shippingAddress.line2}` : ''}</p>
                  <p className="text-xs text-[#9e7b8a]">{selected.shippingAddress.city}, {selected.shippingAddress.state} — {selected.shippingAddress.pincode}</p>
                  <p className="text-xs text-[#9e7b8a]">📞 {selected.shippingAddress.phone}</p>
                </div>
                <div className="bg-white rounded-2xl border border-[#f0e8e0] p-4">
                  <h3 className="font-semibold text-[#3d1a2a] mb-2 text-sm">Payment</h3>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between"><span className="text-[#9e7b8a]">Method</span><span className="capitalize font-medium">{selected.paymentMethod?.replace('_', ' ')}</span></div>
                    <div className="flex justify-between"><span className="text-[#9e7b8a]">Status</span>
                      <span className={`font-medium capitalize ${selected.paymentStatus === 'received' ? 'text-green-600' : 'text-amber-600'}`}>{selected.paymentStatus}</span>
                    </div>
                    {selected.paymentTransactionId && (
                      <div className="flex justify-between"><span className="text-[#9e7b8a]">UTR</span><span className="font-mono text-xs truncate max-w-[100px]">{selected.paymentTransactionId}</span></div>
                    )}
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white rounded-2xl border border-[#f0e8e0] p-4">
                <h3 className="font-semibold text-[#3d1a2a] mb-3 text-sm">Activity</h3>
                <div className="space-y-3">
                  {[...selected.tracking].reverse().map((t, i) => (
                    <div key={i} className="flex gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${i === 0 ? 'bg-[#8B1A4A]' : 'bg-[#d4a0b5]'}`} />
                      <div>
                        <p className="text-xs font-medium capitalize text-[#3d1a2a]">{t.status.replace(/_/g, ' ')}</p>
                        <p className="text-xs text-[#9e7b8a]">{t.message}</p>
                        <p className="text-xs text-[#b89aa8]">{new Date(t.timestamp).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden lg:flex flex-1 items-center justify-center bg-[#fdf8f3] text-[#9e7b8a]">
            <div className="text-center"><Package size={48} className="mx-auto mb-3 opacity-30" /><p>Select an order to view details</p></div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
