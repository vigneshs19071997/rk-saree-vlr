'use client';
// src/components/customer/HeroSection.tsx
import Link from 'next/link';
import { useState, useEffect } from 'react';

const slides = [
  {
    title: 'Timeless Elegance',
    subtitle: 'Kanjivaram Silk Collection',
    desc: 'Handwoven masterpieces from the looms of Tamil Nadu — crafted for weddings and grand celebrations.',
    cta: 'Explore Kanjivaram',
    link: '/shop?category=Kanjivaram+Sarees',
    bg: 'from-[#2a0f1a] via-[#6b1239] to-[#8B1A4A]',
    accent: '#f0d49a',
    tag: '🥻 Wedding & Bridal',
  },
  {
    title: 'Bridal Dreams',
    subtitle: 'Banarasi Weaves',
    desc: 'Rich zari work and vibrant colours for your most special day — straight from the looms of Varanasi.',
    cta: 'Shop Bridal',
    link: '/shop?category=Bridal+Sarees',
    bg: 'from-[#120718] via-[#3b0d54] to-[#7b2fa0]',
    accent: '#C9933A',
    tag: '👑 Bridal Special',
  },
  {
    title: 'Everyday Grace',
    subtitle: 'Cotton & Linen',
    desc: 'Lightweight, breathable drapes for everyday elegance — eco-friendly fabrics from handloom artisans.',
    cta: 'Shop Casuals',
    link: '/shop?category=Cotton+Sarees',
    bg: 'from-[#0d1a12] via-[#1a4a2a] to-[#2d7a4a]',
    accent: '#f0d49a',
    tag: '🌿 Everyday Wear',
  },
  {
    title: 'Festive Radiance',
    subtitle: 'Designer Collection',
    desc: 'Contemporary designs that blend tradition with modern aesthetics — perfect for every celebration.',
    cta: 'Shop Designer',
    link: '/shop?category=Designer+Sarees',
    bg: 'from-[#1a0d08] via-[#7a3512] to-[#C9933A]',
    accent: '#f7e8ef',
    tag: '✨ Festival Picks',
  },
];

const floatingCards = [
  { emoji: '🥻', label: 'Kanjivaram', color: 'from-[#8B1A4A]/30 to-[#C0426E]/20' },
  { emoji: '✨', label: 'Banarasi', color: 'from-[#C9933A]/30 to-[#f0d49a]/20' },
  { emoji: '🌸', label: 'Designer', color: 'from-[#5c2d7a]/30 to-[#9b59b6]/20' },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent((c) => (c + 1) % slides.length);
        setAnimating(false);
      }, 300);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (i: number) => {
    if (i === current) return;
    setAnimating(true);
    setTimeout(() => { setCurrent(i); setAnimating(false); }, 300);
  };

  const slide = slides[current];

  return (
    <section
      className={`relative min-h-[90vh] sm:min-h-[85vh] flex items-center bg-gradient-to-br ${slide.bg} transition-all duration-1000 overflow-hidden`}>

      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="silk-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M30 0 L60 30 L30 60 L0 30 Z" fill="none" stroke="white" strokeWidth="0.8"/>
              <circle cx="30" cy="30" r="4" fill="none" stroke="white" strokeWidth="0.5"/>
              <circle cx="0" cy="0" r="2" fill="white" opacity="0.5"/>
              <circle cx="60" cy="0" r="2" fill="white" opacity="0.5"/>
              <circle cx="0" cy="60" r="2" fill="white" opacity="0.5"/>
              <circle cx="60" cy="60" r="2" fill="white" opacity="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#silk-pattern)"/>
        </svg>

        {/* Radial glow */}
        <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full opacity-15 transition-all duration-1000"
          style={{ background: `radial-gradient(circle, ${slide.accent} 0%, transparent 70%)` }} />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full opacity-8 transition-all duration-1000"
          style={{ background: `radial-gradient(circle, ${slide.accent} 0%, transparent 70%)` }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Text content */}
          <div className={`text-white transition-opacity duration-300 ${animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
            style={{ transition: 'opacity 0.3s ease, transform 0.3s ease' }}>

            {/* Tag badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 text-sm mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#C9933A] animate-pulse" />
              {slide.tag}
            </div>

            {/* Main heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-semibold leading-tight mb-4 transition-all duration-300"
              style={{ color: slide.accent }}>
              {slide.title}
            </h1>

            <p className="text-base sm:text-lg text-white/80 mb-3 font-medium">{slide.subtitle}</p>
            <p className="text-sm sm:text-base text-white/60 mb-8 max-w-md leading-relaxed">{slide.desc}</p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <Link href={slide.link}
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-sm sm:text-base text-[#1a0a12] transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl shadow-lg"
                style={{ background: slide.accent }}>
                {slide.cta} →
              </Link>
              <Link href="/shop"
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-medium text-sm sm:text-base text-white border border-white/30 hover:bg-white/15 transition-all duration-200 backdrop-blur-sm">
                Browse All
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-3 mt-8">
              <div className="flex -space-x-2">
                {['P', 'A', 'M', 'L'].map((letter, i) => (
                  <div key={i}
                    className="w-8 h-8 rounded-full border-2 border-white/30 flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: ['#8B1A4A', '#C9933A', '#5c2d7a', '#2d7a4a'][i] }}>
                    {letter}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-[#C9933A] text-sm">★</span>
                  ))}
                </div>
                <p className="text-white/50 text-xs">50,000+ happy customers</p>
              </div>
            </div>
          </div>

          {/* Floating saree cards — desktop only */}
          <div className="hidden lg:flex justify-center items-center gap-5">
            {floatingCards.map((card, i) => (
              <div key={i}
                className={`flex flex-col items-center justify-center rounded-3xl p-6 text-center transition-all duration-700 bg-gradient-to-br ${card.color} backdrop-blur-md border border-white/15 shadow-xl
                  ${i === current % floatingCards.length ? 'scale-110 opacity-100 -translate-y-2' : 'scale-90 opacity-40'}`}
                style={{ width: 120, height: 180 }}>
                <span className="text-6xl mb-3">{card.emoji}</span>
                <span className="text-white/80 text-xs font-medium">{card.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2.5 items-center">
        {slides.map((_, i) => (
          <button key={i} onClick={() => goToSlide(i)} aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${i === current ? 'w-8 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/35 hover:bg-white/60'}`} />
        ))}
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 60 C360 20 720 60 1080 30 C1260 15 1380 40 1440 60 L1440 60 L0 60 Z" fill="#fdf8f3"/>
        </svg>
      </div>
    </section>
  );
}
