// src/app/(customer)/shipping/page.tsx
import Navbar from '@/components/customer/Navbar';
import Footer from '@/components/customer/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Shipping Policy' };

const policies = [
  {
    title: 'Free Shipping',
    body: 'All orders above ₹999 qualify for free standard shipping across India. For orders below ₹999, a flat shipping fee of ₹99 applies.',
  },
  {
    title: 'Delivery Timeline',
    body: 'Standard delivery takes 5–7 business days. Express delivery (2–3 business days) is available for select pincodes at an additional charge of ₹149.',
  },
  {
    title: 'Order Processing',
    body: 'Orders are processed within 24 hours of payment confirmation (Monday–Saturday). Orders placed on Sunday are processed on Monday.',
  },
  {
    title: 'Tracking Your Order',
    body: 'Once your order is shipped, you will receive an email with the courier name and tracking number. You can also track your order in real-time from the My Orders section.',
  },
  {
    title: 'Delivery Partners',
    body: 'We ship via trusted courier partners — BlueDart, Delhivery, and DTDC — depending on your location for the fastest and most reliable delivery.',
  },
  {
    title: 'Cash on Delivery',
    body: 'COD is available for orders up to ₹10,000 across most serviceable pincodes in India. COD orders are confirmed and dispatched within 24 hours.',
  },
];

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-display text-[#3d1a2a] mb-4">Shipping Policy</h1>
        <div className="w-16 h-1 bg-[#8B1A4A] rounded-full mb-10" />
        <div className="space-y-6">
          {policies.map((p) => (
            <div key={p.title} className="bg-white rounded-2xl border border-[#f0e8e0] p-6">
              <h2 className="font-display text-lg text-[#3d1a2a] mb-2">{p.title}</h2>
              <p className="text-[#6b4d57] text-sm leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
