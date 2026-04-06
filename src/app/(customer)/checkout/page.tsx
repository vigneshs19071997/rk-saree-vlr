'use client';
// src/app/(customer)/checkout/page.tsx
import { useState, useEffect } from 'react';
import Navbar from '@/components/customer/Navbar';
import { useCartStore } from '@/lib/store';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { IAddress } from '@/types';
import axios from 'axios';
import toast from 'react-hot-toast';
import { MapPin, Plus, Check, ChevronDown, ChevronUp } from 'lucide-react';
import PaymentModal from '@/components/customer/PaymentModal';
import Image from 'next/image';

const SHIPPING_THRESHOLD = 999;
const SHIPPING_CHARGE = 99;

const emptyAddress: Omit<IAddress, '_id'> = {
  label: 'Home', fullName: '', phone: '', line1: '', line2: '',
  city: '', state: '', pincode: '', country: 'India', isDefault: false,
};

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { items, total, clearCart } = useCartStore();

  const [savedAddresses, setSavedAddresses] = useState<IAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ ...emptyAddress });
  const [geoLoading, setGeoLoading] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<{ _id: string; orderNumber: string; total: number } | null>(null);
  const [step, setStep] = useState<'address' | 'review'>('address');

  const subtotal = total();
  const shippingCharge = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE;
  const orderTotal = subtotal + shippingCharge;

  useEffect(() => {
    if (!session) { router.push('/login'); return; }
    if (items.length === 0) { router.push('/cart'); return; }
    axios.get('/api/user').then(({ data }) => {
      setSavedAddresses(data.user.addresses || []);
      const def = data.user.addresses?.find((a: IAddress) => a.isDefault);
      if (def) setSelectedAddressId(def._id!);
    }).catch(() => {});
  }, [session, items, router]);

  const detectLocation = async () => {
    setGeoLoading(true);
    try {
      const { data } = await axios.get('/api/user/location');
      if (data.detected) {
        setNewAddress((prev) => ({ ...prev, city: data.city, state: data.state, pincode: data.pincode, country: data.country }));
        toast.success('📍 Location detected!');
      } else {
        toast('Could not auto-detect location. Please enter manually.', { icon: 'ℹ️' });
      }
    } finally { setGeoLoading(false); }
  };

  const getShippingAddress = (): IAddress => {
    if (selectedAddressId) {
      return savedAddresses.find((a) => a._id === selectedAddressId)!;
    }
    return newAddress as IAddress;
  };

  const handleProceedToPayment = async (paymentMethod: string) => {
    const addr = getShippingAddress();
    if (!addr?.fullName || !addr?.phone || !addr?.line1 || !addr?.city || !addr?.pincode) {
      toast.error('Please complete the address'); return;
    }
    setPlacingOrder(true);
    try {
      const orderPayload = {
        items: items.map((i) => ({
          product: i.product._id,
          name: i.product.name,
          image: i.product.images?.[0] || '',
          price: i.product.discountPrice || i.product.price,
          quantity: i.quantity,
        })),
        shippingAddress: addr,
        subtotal,
        shippingCharge,
        discount: 0,
        total: orderTotal,
        paymentMethod,
      };
      const { data } = await axios.post('/api/orders', orderPayload);
      setCreatedOrder(data.order);
      if (paymentMethod === 'cod') {
        clearCart();
        router.push(`/orders/${data.order._id}?success=true`);
      } else {
        setShowPayment(false);
        setCreatedOrder(data.order);
        // Trigger payment modal
        setTimeout(() => setShowPayment(true), 100);
      }
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err) ? err.response?.data?.error : 'Failed to place order';
      toast.error(msg || 'Failed to place order');
    } finally { setPlacingOrder(false); }
  };

  const handlePaymentComplete = () => {
    clearCart();
    router.push(`/orders/${createdOrder?._id}?success=true`);
  };

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-display text-[#3d1a2a] mb-8">Checkout</h1>

        {/* Steps */}
        <div className="flex items-center gap-3 mb-8">
          {['address', 'review'].map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${step === s ? 'bg-[#8B1A4A] text-white' : i === 0 && step === 'review' ? 'bg-green-100 text-green-700' : 'bg-white text-[#9e7b8a] border border-[#f0e8e0]'}`}>
                {i === 0 && step === 'review' ? <Check size={15} /> : <span>{i + 1}</span>}
                <span className="capitalize">{s}</span>
              </div>
              {i < 1 && <div className="w-8 h-px bg-[#e8d5db]" />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-5">
            {step === 'address' && (
              <div className="bg-white rounded-2xl border border-[#f0e8e0] p-6">
                <h2 className="font-display text-xl text-[#3d1a2a] mb-5 flex items-center gap-2"><MapPin size={20} className="text-[#8B1A4A]" /> Delivery Address</h2>

                {/* Saved addresses */}
                {savedAddresses.length > 0 && (
                  <div className="space-y-3 mb-5">
                    {savedAddresses.map((addr) => (
                      <label key={addr._id} className={`flex gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedAddressId === addr._id ? 'border-[#8B1A4A] bg-[#fdf8f3]' : 'border-[#f0e8e0] hover:border-[#d4a0b5]'}`}>
                        <input type="radio" name="address" value={addr._id} checked={selectedAddressId === addr._id}
                          onChange={() => { setSelectedAddressId(addr._id!); setShowNewAddress(false); }}
                          className="mt-1 accent-[#8B1A4A]" />
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-semibold text-[#3d1a2a] text-sm">{addr.fullName}</span>
                            <span className="text-xs px-2 py-0.5 bg-[#f7e8ef] text-[#8B1A4A] rounded-full">{addr.label}</span>
                            {addr.isDefault && <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Default</span>}
                          </div>
                          <p className="text-sm text-[#9e7b8a]">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p>
                          <p className="text-sm text-[#9e7b8a]">{addr.city}, {addr.state} — {addr.pincode}</p>
                          <p className="text-sm text-[#9e7b8a]">📞 {addr.phone}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                {/* Add new address toggle */}
                <button onClick={() => { setShowNewAddress(!showNewAddress); setSelectedAddressId(null); }}
                  className="flex items-center gap-2 text-[#8B1A4A] font-medium text-sm mb-4 hover:underline">
                  {showNewAddress ? <ChevronUp size={16} /> : <Plus size={16} />}
                  {showNewAddress ? 'Cancel new address' : 'Add new address'}
                </button>

                {(showNewAddress || savedAddresses.length === 0) && (
                  <div className="space-y-4 animate-fadeInUp">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-[#3d1a2a]">New Address</h3>
                      <button onClick={detectLocation} disabled={geoLoading}
                        className="text-xs text-[#8B1A4A] border border-[#8B1A4A] px-3 py-1.5 rounded-lg hover:bg-[#f7e8ef] flex items-center gap-1.5 transition-colors">
                        📍 {geoLoading ? 'Detecting...' : 'Auto-detect location'}
                      </button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {[
                        { key: 'label', label: 'Label (Home/Office)', placeholder: 'Home' },
                        { key: 'fullName', label: 'Full Name *', placeholder: 'Enter your name' },
                        { key: 'phone', label: 'Phone Number *', placeholder: '10-digit mobile number' },
                        { key: 'line1', label: 'Address Line 1 *', placeholder: 'House/Flat no., Street' },
                        { key: 'line2', label: 'Address Line 2', placeholder: 'Landmark (optional)' },
                        { key: 'city', label: 'City *', placeholder: 'City' },
                        { key: 'state', label: 'State *', placeholder: 'State' },
                        { key: 'pincode', label: 'PIN Code *', placeholder: '6-digit PIN code' },
                      ].map(({ key, label, placeholder }) => (
                        <div key={key} className={key === 'line1' || key === 'line2' ? 'sm:col-span-2' : ''}>
                          <label className="block text-xs font-medium text-[#9e7b8a] mb-1.5">{label}</label>
                          <input type="text" placeholder={placeholder}
                            value={newAddress[key as keyof typeof newAddress] as string}
                            onChange={(e) => setNewAddress((prev) => ({ ...prev, [key]: e.target.value }))}
                            className="input-field" />
                        </div>
                      ))}
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={newAddress.isDefault}
                        onChange={(e) => setNewAddress((prev) => ({ ...prev, isDefault: e.target.checked }))}
                        className="accent-[#8B1A4A]" />
                      <span className="text-sm text-[#6b4d57]">Set as default address</span>
                    </label>
                  </div>
                )}

                <button onClick={() => {
                  const addr = getShippingAddress();
                  if (!addr?.fullName || !addr?.phone || !addr?.line1 || !addr?.city || !addr?.pincode) {
                    toast.error('Please fill all required fields'); return;
                  }
                  setStep('review');
                }} className="btn-primary w-full mt-6">
                  Continue to Review →
                </button>
              </div>
            )}

            {step === 'review' && (
              <div className="bg-white rounded-2xl border border-[#f0e8e0] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-xl text-[#3d1a2a]">Review Order</h2>
                  <button onClick={() => setStep('address')} className="text-sm text-[#8B1A4A] hover:underline">Change Address</button>
                </div>
                <div className="bg-[#fdf8f3] rounded-xl p-4 mb-5">
                  {(() => { const a = getShippingAddress(); return (
                    <div>
                      <p className="font-semibold text-[#3d1a2a] text-sm">{a?.fullName} · {a?.phone}</p>
                      <p className="text-sm text-[#9e7b8a] mt-0.5">{a?.line1}{a?.line2 ? `, ${a.line2}` : ''}, {a?.city}, {a?.state} — {a?.pincode}</p>
                    </div>
                  ); })()}
                </div>
                <div className="space-y-3 mb-5">
                  {items.map((item) => (
                    <div key={item.product._id} className="flex gap-3 items-center">
                      <div className="relative w-14 h-16 rounded-lg overflow-hidden bg-[#fdf8f3] flex-shrink-0">
                        {item.product.images?.[0] ? <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" sizes="56px" /> : <div className="w-full h-full flex items-center justify-center text-xl">🥻</div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#3d1a2a] line-clamp-1">{item.product.name}</p>
                        <p className="text-xs text-[#9e7b8a]">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-semibold text-[#8B1A4A] text-sm">₹{((item.product.discountPrice || item.product.price) * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
                <h3 className="font-semibold text-[#3d1a2a] mb-3">Select Payment Method</h3>
                <div className="space-y-3">
                  {[
                    { value: 'upi', label: 'Scan QR Code', desc: 'Pay via any UPI app — PhonePe, GPay, Paytm', icon: '📱' },
                    { value: 'upi_id', label: 'Enter UPI ID', desc: 'Send directly to our UPI ID', icon: '💳' },
                    { value: 'cod', label: 'Cash on Delivery', desc: 'Pay in cash when your order arrives', icon: '💵' },
                  ].map((opt) => (
                    <button key={opt.value} onClick={() => {
                      handleProceedToPayment(opt.value);
                    }} disabled={placingOrder}
                      className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-[#f0e8e0] hover:border-[#8B1A4A] hover:bg-[#fdf8f3] transition-all text-left group disabled:opacity-50">
                      <span className="text-2xl">{opt.icon}</span>
                      <div className="flex-1">
                        <p className="font-medium text-[#3d1a2a] text-sm">{opt.label}</p>
                        <p className="text-xs text-[#9e7b8a]">{opt.desc}</p>
                      </div>
                      <ChevronDown size={16} className="text-[#9e7b8a] group-hover:text-[#8B1A4A] rotate-[-90deg]" />
                    </button>
                  ))}
                </div>
                {placingOrder && (
                  <div className="flex items-center justify-center gap-3 mt-6 py-4">
                    <div className="w-6 h-6 border-2 border-[#8B1A4A] border-t-transparent rounded-full animate-spin" />
                    <span className="text-[#9e7b8a]">Placing your order...</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Order summary */}
          <div>
            <div className="bg-white rounded-2xl border border-[#f0e8e0] p-5 sticky top-24">
              <h2 className="font-display text-lg text-[#3d1a2a] mb-4">Price Details</h2>
              <div className="space-y-2.5 text-sm mb-4">
                <div className="flex justify-between"><span className="text-[#9e7b8a]">Price ({items.length} items)</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between"><span className="text-[#9e7b8a]">Delivery</span><span className={shippingCharge === 0 ? 'text-green-600 font-medium' : ''}>{shippingCharge === 0 ? 'FREE' : `₹${shippingCharge}`}</span></div>
              </div>
              <div className="border-t border-[#f0e8e0] pt-3">
                <div className="flex justify-between font-bold">
                  <span className="text-[#3d1a2a]">Total Amount</span>
                  <span className="text-[#8B1A4A] text-lg">₹{orderTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
              {shippingCharge === 0 && (
                <p className="mt-3 text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg">🎉 You saved ₹{SHIPPING_CHARGE} on delivery!</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {showPayment && createdOrder && (
        <PaymentModal
          order={createdOrder}
          onClose={() => setShowPayment(false)}
          onComplete={handlePaymentComplete}
        />
      )}
    </div>
  );
}
