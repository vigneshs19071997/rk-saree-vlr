'use client';
// src/app/(customer)/cart/page.tsx
import Navbar from '@/components/customer/Navbar';
import Footer from '@/components/customer/Footer';
import { useCartStore } from '@/lib/store';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, Tag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_CHARGE = 99;

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, total, count } = useCartStore();
  const router = useRouter();
  const { data: session } = useSession();

  const subtotal = total();
  const itemCount = count();
  const shippingCharge = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE;
  const orderTotal = subtotal + shippingCharge;

  const handleCheckout = () => {
    if (!session) { toast.error('Please login to checkout'); router.push('/login'); return; }
    router.push('/checkout');
  };

  if (items.length === 0) return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-28 h-28 bg-[#f7e8ef] rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag size={48} className="text-[#8B1A4A]" />
        </div>
        <h2 className="text-2xl font-display text-[#3d1a2a] mb-3">Your cart is empty</h2>
        <p className="text-[#9e7b8a] mb-8">Looks like you haven't added any sarees yet</p>
        <Link href="/shop" className="btn-primary inline-flex">Browse Sarees</Link>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-display text-[#3d1a2a]">Shopping Cart <span className="text-[#9e7b8a] text-lg font-sans">({itemCount} items)</span></h1>
          <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1">
            <Trash2 size={15} /> Clear all
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const price = item.product.discountPrice || item.product.price;
              return (
                <div key={item.product._id} className="bg-white rounded-2xl border border-[#f0e8e0] p-4 flex gap-4 animate-fadeInUp">
                  <Link href={`/product/${item.product._id}`} className="relative w-24 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-[#fdf8f3]">
                    {item.product.images?.[0] ? (
                      <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" sizes="96px" />
                    ) : <div className="w-full h-full flex items-center justify-center text-4xl">🥻</div>}
                  </Link>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#9e7b8a] mb-0.5">{item.product.category}</p>
                    <Link href={`/product/${item.product._id}`}>
                      <h3 className="font-medium text-[#3d1a2a] text-sm leading-snug line-clamp-2 hover:text-[#8B1A4A]">{item.product.name}</h3>
                    </Link>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-bold text-[#8B1A4A]">₹{price.toLocaleString('en-IN')}</span>
                      {item.product.discountPrice && (
                        <span className="text-xs text-[#b89aa8] line-through">₹{item.product.price.toLocaleString('en-IN')}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-[#e8d5db] rounded-xl overflow-hidden">
                        <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-[#fdf8f3]">
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product._id, Math.min(item.product.stock, item.quantity + 1))}
                          className="w-8 h-8 flex items-center justify-center hover:bg-[#fdf8f3]">
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[#3d1a2a] text-sm">₹{(price * item.quantity).toLocaleString('en-IN')}</span>
                        <button onClick={() => removeFromCart(item.product._id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9e7b8a] hover:bg-red-50 hover:text-red-500 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-[#f0e8e0] p-6 sticky top-24">
              <h2 className="font-display text-xl text-[#3d1a2a] mb-5">Order Summary</h2>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-[#9e7b8a]">Subtotal ({itemCount} items)</span>
                  <span className="text-[#3d1a2a]">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#9e7b8a]">Shipping</span>
                  {shippingCharge === 0
                    ? <span className="text-green-600 font-medium">FREE</span>
                    : <span className="text-[#3d1a2a]">₹{shippingCharge}</span>}
                </div>
                {shippingCharge > 0 && (
                  <p className="text-xs text-[#9e7b8a] flex items-center gap-1 bg-[#fdf8f3] px-3 py-2 rounded-lg">
                    <Tag size={12} /> Add ₹{(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString('en-IN')} more for free shipping
                  </p>
                )}
              </div>

              <div className="border-t border-[#f0e8e0] pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="font-semibold text-[#3d1a2a]">Total</span>
                  <span className="text-xl font-bold text-[#8B1A4A]">₹{orderTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button onClick={handleCheckout} className="btn-primary w-full text-center flex items-center justify-center gap-2">
                Proceed to Checkout →
              </button>
              <Link href="/shop" className="block text-center text-sm text-[#8B1A4A] mt-4 hover:underline">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
