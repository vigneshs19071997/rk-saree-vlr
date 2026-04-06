'use client';
// src/app/(customer)/orders/[id]/page.tsx
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Navbar from '@/components/customer/Navbar';
import Footer from '@/components/customer/Footer';
import { IOrder } from '@/types';
import axios from 'axios';
import toast from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';
import { Package, MapPin, Check, Clock, Truck, Home, RotateCcw, XCircle } from 'lucide-react';
import Confetti from 'react-confetti';

function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const update = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return size;
}

const STATUS_STEPS = [
  { key: 'pending', label: 'Order Placed', icon: Package },
  { key: 'confirmed', label: 'Confirmed', icon: Check },
  { key: 'processing', label: 'Processing', icon: Clock },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: Home },
];

const STATUS_ORDER = ['pending', 'payment_received', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];

const STATUS_COLORS: Record<string, string> = {
  pending: 'text-amber-600 bg-amber-50',
  payment_received: 'text-blue-600 bg-blue-50',
  confirmed: 'text-blue-600 bg-blue-50',
  processing: 'text-violet-600 bg-violet-50',
  shipped: 'text-purple-600 bg-purple-50',
  out_for_delivery: 'text-pink-600 bg-pink-50',
  delivered: 'text-green-600 bg-green-50',
  return_requested: 'text-orange-600 bg-orange-50',
  return_approved: 'text-cyan-600 bg-cyan-50',
  returned: 'text-gray-600 bg-gray-50',
  cancelled: 'text-red-600 bg-red-50',
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get('success') === 'true';
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(isSuccess);
  const [returning, setReturning] = useState(false);
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (!id) return;
    axios.get(`/api/orders/${id}`).then(({ data }) => { setOrder(data.order); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (showConfetti) { const t = setTimeout(() => setShowConfetti(false), 5000); return () => clearTimeout(t); }
  }, [showConfetti]);

  const handleReturnRequest = async () => {
    if (!confirm('Are you sure you want to request a return?')) return;
    setReturning(true);
    try {
      const { data } = await axios.patch(`/api/orders/${id}`, { action: 'requestReturn' });
      setOrder(data.order);
      toast.success('Return request submitted!');
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err) ? err.response?.data?.error : 'Failed to request return';
      toast.error(msg || 'Failed');
    } finally { setReturning(false); }
  };

  const currentStepIndex = order ? STATUS_ORDER.indexOf(order.orderStatus) : -1;
  const returnExpired = order?.returnDeadline ? new Date() > new Date(order.returnDeadline) : false;

  if (loading) return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
        <div className="h-8 shimmer rounded-xl w-64" />
        <div className="h-48 shimmer rounded-2xl" />
        <div className="h-64 shimmer rounded-2xl" />
      </div>
    </div>
  );

  if (!order) return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="text-center"><p className="text-5xl mb-4">📦</p>
        <h2 className="text-xl font-display text-[#3d1a2a] mb-4">Order not found</h2>
        <Link href="/orders" className="btn-primary">My Orders</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream">
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={200} colors={['#8B1A4A', '#C9933A', '#C0426E', '#f7e8ef']} />}
      <Navbar />

      {/* Success banner */}
      {isSuccess && (
        <div className="bg-gradient-to-r from-[#8B1A4A] to-[#C0426E] text-white text-center py-4 px-4 animate-fadeInUp">
          <p className="font-semibold text-lg">🎉 Order Placed Successfully!</p>
          <p className="text-white/80 text-sm mt-1">
            {order.paymentMethod === 'cod'
              ? 'Your order is confirmed! Pay on delivery.'
              : 'Once we receive your payment, we\'ll confirm your order and send an email.'}
          </p>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/orders" className="text-sm text-[#9e7b8a] hover:text-[#8B1A4A] flex items-center gap-1 mb-1">← My Orders</Link>
            <h1 className="text-xl md:text-2xl font-display text-[#3d1a2a]">Order #{order.orderNumber}</h1>
            <p className="text-sm text-[#9e7b8a] mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <span className={`px-3 py-1.5 rounded-xl text-sm font-medium capitalize ${STATUS_COLORS[order.orderStatus] || 'bg-gray-50 text-gray-600'}`}>
            {order.orderStatus.replace(/_/g, ' ')}
          </span>
        </div>

        {/* Tracking stepper */}
        {!['cancelled', 'returned', 'return_requested', 'return_approved'].includes(order.orderStatus) && (
          <div className="bg-white rounded-2xl border border-[#f0e8e0] p-6 mb-5">
            <h2 className="font-semibold text-[#3d1a2a] mb-5">Order Tracking</h2>
            <div className="flex items-start gap-0 overflow-x-auto pb-2">
              {STATUS_STEPS.map((step, i) => {
                const stepIndex = STATUS_ORDER.indexOf(step.key);
                const isDone = currentStepIndex > stepIndex;
                const isCurrent = STATUS_ORDER[currentStepIndex] === step.key || (step.key === 'confirmed' && order.orderStatus === 'payment_received');
                const Icon = step.icon;
                return (
                  <div key={step.key} className="flex items-center flex-1 min-w-0">
                    <div className="flex flex-col items-center flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${isDone ? 'bg-[#8B1A4A] border-[#8B1A4A]' : isCurrent ? 'bg-[#f7e8ef] border-[#8B1A4A]' : 'bg-white border-[#e8d5db]'}`}>
                        <Icon size={18} className={isDone ? 'text-white' : isCurrent ? 'text-[#8B1A4A]' : 'text-[#c9b3bc]'} />
                      </div>
                      <p className={`text-xs mt-2 text-center leading-tight ${isCurrent || isDone ? 'text-[#8B1A4A] font-medium' : 'text-[#b89aa8]'}`}>{step.label}</p>
                    </div>
                    {i < STATUS_STEPS.length - 1 && (
                      <div className={`h-0.5 flex-1 mx-1 mb-5 transition-all ${isDone ? 'bg-[#8B1A4A]' : 'bg-[#f0e8e0]'}`} />
                    )}
                  </div>
                );
              })}
            </div>
            {order.estimatedDelivery && (
              <p className="text-sm text-[#9e7b8a] mt-3 text-center">Estimated delivery: <span className="font-medium text-[#3d1a2a]">{new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</span></p>
            )}
          </div>
        )}

        {/* Timeline */}
        <div className="bg-white rounded-2xl border border-[#f0e8e0] p-6 mb-5">
          <h2 className="font-semibold text-[#3d1a2a] mb-4">Activity Timeline</h2>
          <div className="space-y-4">
            {[...order.tracking].reverse().map((t, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full mt-0.5 flex-shrink-0 ${i === 0 ? 'bg-[#8B1A4A]' : 'bg-[#d4a0b5]'}`} />
                  {i < order.tracking.length - 1 && <div className="w-0.5 bg-[#f0e8e0] flex-1 my-1" />}
                </div>
                <div className="pb-3">
                  <p className={`text-sm font-medium capitalize ${i === 0 ? 'text-[#3d1a2a]' : 'text-[#9e7b8a]'}`}>{t.status.replace(/_/g, ' ')}</p>
                  <p className="text-xs text-[#9e7b8a] mt-0.5">{t.message}</p>
                  <p className="text-xs text-[#b89aa8] mt-1">{new Date(t.timestamp).toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mb-5">
          {/* Items */}
          <div className="bg-white rounded-2xl border border-[#f0e8e0] p-5">
            <h2 className="font-semibold text-[#3d1a2a] mb-4">Order Items</h2>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <div className="relative w-14 h-16 rounded-lg overflow-hidden bg-[#fdf8f3] flex-shrink-0">
                    {item.image ? <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" /> : <div className="w-full h-full flex items-center justify-center text-xl">🥻</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#3d1a2a] line-clamp-2">{item.name}</p>
                    <p className="text-xs text-[#9e7b8a]">Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</p>
                  </div>
                  <span className="font-semibold text-[#8B1A4A] text-sm">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-[#f0e8e0] pt-3 mt-3">
              <div className="flex justify-between text-sm text-[#9e7b8a] mb-1"><span>Subtotal</span><span>₹{order.subtotal.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between text-sm text-[#9e7b8a] mb-2"><span>Shipping</span><span>{order.shippingCharge === 0 ? 'FREE' : `₹${order.shippingCharge}`}</span></div>
              <div className="flex justify-between font-bold"><span className="text-[#3d1a2a]">Total</span><span className="text-[#8B1A4A]">₹{order.total.toLocaleString('en-IN')}</span></div>
            </div>
          </div>

          {/* Address + Payment */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-[#f0e8e0] p-5">
              <h2 className="font-semibold text-[#3d1a2a] mb-3 flex items-center gap-2"><MapPin size={16} className="text-[#8B1A4A]" /> Delivery Address</h2>
              <p className="font-medium text-[#3d1a2a] text-sm">{order.shippingAddress.fullName}</p>
              <p className="text-sm text-[#9e7b8a]">{order.shippingAddress.line1}{order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ''}</p>
              <p className="text-sm text-[#9e7b8a]">{order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}</p>
              <p className="text-sm text-[#9e7b8a]">📞 {order.shippingAddress.phone}</p>
            </div>
            <div className="bg-white rounded-2xl border border-[#f0e8e0] p-5">
              <h2 className="font-semibold text-[#3d1a2a] mb-3">Payment Info</h2>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-[#9e7b8a]">Method</span><span className="font-medium capitalize">{order.paymentMethod.replace('_', ' ')}</span></div>
                <div className="flex justify-between"><span className="text-[#9e7b8a]">Status</span>
                  <span className={`font-medium capitalize ${order.paymentStatus === 'received' ? 'text-green-600' : 'text-amber-600'}`}>{order.paymentStatus}</span>
                </div>
                {order.paymentTransactionId && (
                  <div className="flex justify-between"><span className="text-[#9e7b8a]">UTR</span><span className="font-mono text-xs">{order.paymentTransactionId}</span></div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Return option */}
        {order.orderStatus === 'delivered' && !returnExpired && (
          <div className="bg-white rounded-2xl border border-[#f0e8e0] p-5 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-[#3d1a2a] text-sm">Return this order?</h3>
              <p className="text-xs text-[#9e7b8a] mt-0.5">
                Return window closes on {order.returnDeadline ? new Date(order.returnDeadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' }) : 'N/A'}
              </p>
            </div>
            <button onClick={handleReturnRequest} disabled={returning}
              className="flex items-center gap-2 border-2 border-[#8B1A4A] text-[#8B1A4A] px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#f7e8ef] transition-colors">
              <RotateCcw size={15} /> Request Return
            </button>
          </div>
        )}
        {order.orderStatus === 'delivered' && returnExpired && (
          <div className="bg-[#fdf8f3] rounded-2xl border border-[#f0e8e0] p-5 flex items-center gap-3 text-[#9e7b8a]">
            <XCircle size={20} className="text-[#d4a0b5] flex-shrink-0" />
            <p className="text-sm">Return window has expired for this order.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
