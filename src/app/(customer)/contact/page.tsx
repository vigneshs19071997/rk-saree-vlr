'use client';
// src/app/(customer)/contact/page.tsx
import Navbar from '@/components/customer/Navbar';
import Footer from '@/components/customer/Footer';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Simulate send — in production connect to an email API route
    await new Promise((r) => setTimeout(r, 1000));
    toast.success('Message sent! We\'ll reply within 24 hours. 🌸');
    setForm({ name: '', email: '', subject: '', message: '' });
    setSending(false);
  };

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-display text-[#3d1a2a] mb-4">Contact Us</h1>
        <div className="w-16 h-1 bg-[#8B1A4A] rounded-full mb-10" />

        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact info */}
          <div className="space-y-6">
            <p className="text-[#6b4d57] leading-relaxed">
              Have a question about an order, a product, or just want to say hello?
              We'd love to hear from you. Our team typically responds within 24 hours.
            </p>
            <div className="space-y-4">
              {[
                { icon: '📧', label: 'Email', value: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@silkdrapes.in' },
                { icon: '📍', label: 'Location', value: 'Chennai, Tamil Nadu, India' },
                { icon: '🕐', label: 'Support Hours', value: 'Mon–Sat, 9 AM – 6 PM IST' },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-start gap-4 bg-white rounded-2xl p-4 border border-[#f0e8e0]">
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <p className="text-xs text-[#9e7b8a] font-medium uppercase tracking-wide">{label}</p>
                    <p className="text-[#3d1a2a] font-medium mt-0.5">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#f0e8e0] p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#9e7b8a] mb-1.5">Your Name</label>
                <input type="text" required placeholder="Full name"
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#9e7b8a] mb-1.5">Email Address</label>
                <input type="email" required placeholder="you@example.com"
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#9e7b8a] mb-1.5">Subject</label>
              <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                required className="input-field">
                <option value="">Select a topic</option>
                <option>Order enquiry</option>
                <option>Return / refund</option>
                <option>Product question</option>
                <option>Wholesale enquiry</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#9e7b8a] mb-1.5">Message</label>
              <textarea required rows={5} placeholder="How can we help you?"
                value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="input-field resize-none" />
            </div>
            <button type="submit" disabled={sending} className="btn-primary w-full flex items-center justify-center gap-2">
              {sending ? (
                <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending…</>
              ) : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
