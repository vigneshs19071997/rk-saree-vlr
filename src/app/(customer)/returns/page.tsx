// src/app/(customer)/returns/page.tsx
import Navbar from '@/components/customer/Navbar';
import Footer from '@/components/customer/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Return Policy' };

const policies = [
  {
    title: '7-Day Return Window',
    body: 'You may request a return within 7 days of delivery. The return option is visible on your order detail page and is automatically disabled after the return period ends.',
  },
  {
    title: 'Eligible Items',
    body: 'Items must be unused, unwashed, with all original tags intact, and in their original packaging. Custom or altered sarees are not eligible for return.',
  },
  {
    title: 'How to Request a Return',
    body: 'Log in to your account → Go to My Orders → Open the order → Click "Request Return". Our team will review and approve within 1–2 business days.',
  },
  {
    title: 'Pickup & Inspection',
    body: 'Once the return is approved, we will arrange a free pickup from your address. After the item is received and inspected, the refund is processed.',
  },
  {
    title: 'Refund Timeline',
    body: 'Refunds are processed within 5–7 business days after the returned item passes inspection. UPI payments are refunded to the original UPI account. COD orders are refunded via bank transfer.',
  },
  {
    title: 'Non-Returnable Items',
    body: 'Sale items, custom orders, and items marked as "Final Sale" cannot be returned. If a product arrives damaged, please contact us within 48 hours with photographs.',
  },
];

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-display text-[#3d1a2a] mb-4">Return Policy</h1>
        <div className="w-16 h-1 bg-[#8B1A4A] rounded-full mb-10" />
        <div className="space-y-6">
          {policies.map((p) => (
            <div key={p.title} className="bg-white rounded-2xl border border-[#f0e8e0] p-6">
              <h2 className="font-display text-lg text-[#3d1a2a] mb-2">{p.title}</h2>
              <p className="text-[#6b4d57] text-sm leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 bg-[#f7e8ef] rounded-2xl p-6 border border-[#e8c8d8]">
          <p className="text-sm text-[#8B1A4A] font-medium mb-1">Need help with a return?</p>
          <p className="text-sm text-[#6b4d57]">
            Email us at{' '}
            <a href={`mailto:${process.env.ADMIN_EMAIL || 'support@silkdrapes.in'}`}
               className="underline hover:text-[#8B1A4A]">
              support@silkdrapes.in
            </a>{' '}
            and we'll sort it out within 24 hours.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
