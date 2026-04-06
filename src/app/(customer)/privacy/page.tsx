// src/app/(customer)/privacy/page.tsx
import Navbar from '@/components/customer/Navbar';
import Footer from '@/components/customer/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-display text-[#3d1a2a] mb-4">Privacy Policy</h1>
        <div className="w-16 h-1 bg-[#8B1A4A] rounded-full mb-10" />
        <div className="space-y-8 text-[#6b4d57] text-sm leading-relaxed">
          {[
            {
              heading: 'Information We Collect',
              body: 'We collect your name, email, phone number, delivery address, and order history when you register and shop on Silk Drapes. Payment details (UPI IDs, transaction references) are collected only to verify payments and are never stored on our servers.',
            },
            {
              heading: 'How We Use Your Information',
              body: 'Your information is used to process orders, send order status updates via email, and improve your shopping experience. We do not sell or share your data with third parties for marketing purposes.',
            },
            {
              heading: 'Cookies',
              body: 'We use essential cookies to keep you signed in and to remember your cart. No third-party advertising cookies are used.',
            },
            {
              heading: 'Data Security',
              body: 'All data is transmitted over HTTPS. Passwords are hashed using bcrypt and are never stored in plain text. Our databases are hosted on MongoDB Atlas with encryption at rest.',
            },
            {
              heading: 'Your Rights',
              body: 'You can request to view, update, or delete your personal data at any time by emailing us. Account deletion removes all personal information from our systems within 30 days.',
            },
            {
              heading: 'Contact',
              body: `For any privacy concerns, email us at ${process.env.ADMIN_EMAIL || 'privacy@silkdrapes.in'}. We respond within 2 business days.`,
            },
          ].map(({ heading, body }) => (
            <div key={heading}>
              <h2 className="font-display text-lg text-[#3d1a2a] mb-2">{heading}</h2>
              <p>{body}</p>
            </div>
          ))}
          <p className="text-xs text-[#9e7b8a]">Last updated: January 2025</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
