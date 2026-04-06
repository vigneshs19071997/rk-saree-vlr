'use client';
// src/components/customer/CategoryGrid.tsx
import Link from 'next/link';

const categories = [
  { name: 'Kanjivaram', icon: '🥻', color: '#8B1A4A', bg: '#f7e8ef', sub: 'Silk from Tamil Nadu', count: '80+ styles' },
  { name: 'Banarasi',   icon: '✨', color: '#C9933A', bg: '#fef8ec', sub: 'Zari weaves, Varanasi', count: '60+ styles' },
  { name: 'Silk',       icon: '🌸', color: '#C0426E', bg: '#fde8ef', sub: 'Pure silk collection', count: '100+ styles' },
  { name: 'Cotton',     icon: '🌿', color: '#2d7a4a', bg: '#eaf5ee', sub: 'Breathable & everyday', count: '120+ styles' },
  { name: 'Bridal',     icon: '👑', color: '#7b2fa0', bg: '#f3eafa', sub: 'For your special day', count: '40+ styles' },
  { name: 'Designer',   icon: '💫', color: '#1a5c9e', bg: '#e8f2fc', sub: 'Contemporary designs', count: '90+ styles' },
];

export default function CategoryGrid() {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <span className="inline-block px-4 py-1 rounded-full bg-[#f7e8ef] text-[#8B1A4A] text-sm font-medium mb-3">
          Collections
        </span>
        <h2 className="text-3xl md:text-4xl font-display text-[#3d1a2a] mb-3">Shop by Category</h2>
        <p className="text-[#9e7b8a]">Explore our curated saree collections from across India</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={`/shop?category=${encodeURIComponent(cat.name === 'Silk' || cat.name === 'Cotton' || cat.name === 'Bridal' || cat.name === 'Designer' ? cat.name + ' Sarees' : cat.name + ' Sarees')}`}
            className="group flex flex-col items-center p-4 sm:p-5 bg-white rounded-2xl border border-[#f0e8e0] hover:border-[#d4a0b5] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center">

            {/* Icon */}
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl mb-3 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm"
              style={{ background: cat.bg }}>
              {cat.icon}
            </div>

            {/* Name */}
            <h3 className="font-semibold text-[#3d1a2a] text-sm mb-0.5 group-hover:text-[#8B1A4A] transition-colors">
              {cat.name}
            </h3>

            {/* Sub */}
            <p className="text-[10px] sm:text-xs text-[#9e7b8a] leading-tight mb-2 hidden sm:block">{cat.sub}</p>

            {/* Count badge */}
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-medium hidden sm:inline-block"
              style={{ background: cat.bg, color: cat.color }}>
              {cat.count}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
