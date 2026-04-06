// src/app/(customer)/about/page.tsx
import Navbar from '@/components/customer/Navbar';
import Footer from '@/components/customer/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'About Us' };

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-display text-[#3d1a2a] mb-4">Our Story</h1>
        <div className="w-16 h-1 bg-[#8B1A4A] rounded-full mb-8" />
        <div className="prose prose-lg text-[#6b4d57] space-y-5">
          <p>
            Silk Drapes was born from a deep love for India's rich textile heritage. We work
            directly with master weavers across Tamil Nadu, Varanasi, Gujarat, and West Bengal
            to bring you authentic, handcrafted sarees that carry centuries of tradition.
          </p>
          <p>
            Every saree in our collection is carefully sourced, quality-checked, and shipped
            directly to you — no middlemen, no compromises.
          </p>
          <div className="grid sm:grid-cols-3 gap-6 not-prose my-10">
            {[
              { icon: '🧵', title: '500+', sub: 'Artisan families supported' },
              { icon: '🥻', title: '1200+', sub: 'Unique sarees curated' },
              { icon: '📦', title: '15,000+', sub: 'Happy customers' },
            ].map((s) => (
              <div key={s.title} className="text-center bg-white rounded-2xl p-6 border border-[#f0e8e0]">
                <div className="text-4xl mb-2">{s.icon}</div>
                <p className="text-2xl font-display font-bold text-[#8B1A4A]">{s.title}</p>
                <p className="text-sm text-[#9e7b8a] mt-1">{s.sub}</p>
              </div>
            ))}
          </div>
          <p>
            We believe every woman deserves to wear a saree that tells a story — of skilled
            hands, of patient looms, of colours drawn from nature. That's what Silk Drapes is
            all about.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
