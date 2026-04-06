// src/app/(customer)/page.tsx  (Homepage)
import { Suspense } from 'react';
import Navbar from '@/components/customer/Navbar';
import HeroSection from '@/components/customer/HeroSection';
import CategoryGrid from '@/components/customer/CategoryGrid';
import FeaturedProducts from '@/components/customer/FeaturedProducts';
import Footer from '@/components/customer/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <CategoryGrid />
        <Suspense fallback={<ProductsSkeleton />}>
          <FeaturedProducts />
        </Suspense>
        <AboutSection />
        <WhyUsSection />
        <TestimonialsSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
}

function ProductsSkeleton() {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="h-8 w-48 shimmer rounded-lg mb-8" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-2xl overflow-hidden">
            <div className="aspect-[3/4] shimmer" />
            <div className="p-4 space-y-2">
              <div className="h-4 shimmer rounded" />
              <div className="h-4 w-1/2 shimmer rounded" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function StatsSection() {
  const stats = [
    { value: '25+', label: 'Years of Legacy' },
    { value: '500+', label: 'Unique Designs' },
    { value: '50,000+', label: 'Happy Customers' },
    { value: '200+', label: 'Master Weavers' },
  ];
  return (
    <section className="bg-[#8B1A4A] text-white py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label} className="py-2">
              <p className="text-3xl md:text-4xl font-display font-semibold text-[#f0d49a]">{s.value}</p>
              <p className="text-sm text-white/70 mt-1 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="py-20 bg-[#fdf8f3]" id="about">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1 rounded-full bg-[#f7e8ef] text-[#8B1A4A] text-sm font-medium mb-3">
            Our Story
          </span>
          <h2 className="text-3xl md:text-5xl font-display text-[#3d1a2a] mb-4">
            Woven with Passion,<br className="hidden md:block" /> Crafted with Heritage
          </h2>
          <p className="text-[#9e7b8a] max-w-2xl mx-auto leading-relaxed">
            Since 1999, Silk Drapes has been a bridge between India's finest weaving communities and saree lovers across the world.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          {/* Story text */}
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-[#f7e8ef] rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">🧵</div>
              <div>
                <h3 className="font-semibold text-[#3d1a2a] text-lg mb-2">Born from Tradition</h3>
                <p className="text-[#6b4d57] leading-relaxed text-sm md:text-base">
                  Founded in Chennai in 1999 by Meenakshi Sundaram, Silk Drapes began as a small boutique with a dream —
                  to make authentic handloom sarees accessible to every Indian household. What started as a tiny shop in
                  T. Nagar has grown into one of India's most trusted saree destinations.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-[#f7e8ef] rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">🌏</div>
              <div>
                <h3 className="font-semibold text-[#3d1a2a] text-lg mb-2">Supporting Artisan Communities</h3>
                <p className="text-[#6b4d57] leading-relaxed text-sm md:text-base">
                  We work directly with over 200 master weavers across Kanchipuram, Varanasi, Sambalpuri,
                  Pochampally and other legendary weaving hubs. By eliminating middlemen, we ensure fair wages
                  for artisans and genuine handcrafted sarees for you.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-[#f7e8ef] rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">✨</div>
              <div>
                <h3 className="font-semibold text-[#3d1a2a] text-lg mb-2">Quality You Can Trust</h3>
                <p className="text-[#6b4d57] leading-relaxed text-sm md:text-base">
                  Every saree in our collection undergoes a rigorous 12-point quality check.
                  We use only natural dyes and certified silk yarns. Our in-house authentication
                  label guarantees 100% pure handloom certification for every piece.
                </p>
              </div>
            </div>
          </div>

          {/* Visual grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl overflow-hidden aspect-[3/4] bg-gradient-to-br from-[#8B1A4A] to-[#C0426E] flex items-center justify-center shadow-lg">
              <span className="text-8xl">🥻</span>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden aspect-square bg-gradient-to-br from-[#C9933A] to-[#f0d49a] flex items-center justify-center shadow-lg">
                <span className="text-6xl">✨</span>
              </div>
              <div className="rounded-2xl overflow-hidden aspect-square bg-gradient-to-br from-[#3d1a2a] to-[#8B1A4A] flex items-center justify-center shadow-lg">
                <span className="text-6xl">🪡</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision cards */}
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              icon: '🎯',
              title: 'Our Mission',
              text: 'To preserve and promote India\'s rich handloom heritage by connecting skilled artisans with saree lovers, ensuring every woman finds her perfect drape.',
              bg: 'bg-[#8B1A4A]',
              textCol: 'text-white',
              subCol: 'text-white/75',
            },
            {
              icon: '👁️',
              title: 'Our Vision',
              text: 'A world where handloom sarees are celebrated globally, and every weaver earns a dignified livelihood through the art passed down generations.',
              bg: 'bg-white',
              textCol: 'text-[#3d1a2a]',
              subCol: 'text-[#6b4d57]',
            },
            {
              icon: '💎',
              title: 'Our Promise',
              text: 'Every saree is authentic, every thread is ethically sourced, and every purchase supports a family of weavers who put their heart into their craft.',
              bg: 'bg-[#3d1a2a]',
              textCol: 'text-white',
              subCol: 'text-white/75',
            },
          ].map((card) => (
            <div key={card.title} className={`${card.bg} rounded-2xl p-7 shadow-sm`}>
              <div className="text-4xl mb-4">{card.icon}</div>
              <h3 className={`font-display text-xl font-semibold ${card.textCol} mb-3`}>{card.title}</h3>
              <p className={`${card.subCol} text-sm leading-relaxed`}>{card.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyUsSection() {
  const features = [
    { icon: '🧵', title: 'Handcrafted Quality', desc: 'Each saree is carefully sourced from master weavers across India' },
    { icon: '🚚', title: 'Free Shipping', desc: 'Complimentary delivery on all orders above ₹999' },
    { icon: '↩️', title: '7-Day Returns', desc: 'Hassle-free returns within 7 days of delivery' },
    { icon: '💳', title: 'Secure Payments', desc: 'Pay via UPI, QR scan, or Cash on Delivery' },
    { icon: '🎁', title: 'Gift Wrapping', desc: 'Complimentary gift packaging on request' },
    { icon: '📞', title: '24/7 Support', desc: 'Expert styling advice, anytime you need it' },
  ];
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display text-[#3d1a2a] mb-3">Why Choose Silk Drapes?</h2>
          <p className="text-[#9e7b8a]">A shopping experience as special as the saree itself</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {features.map((f) => (
            <div key={f.title} className="text-center group">
              <div className="w-16 h-16 bg-[#fdf8f3] rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl group-hover:bg-[#f7e8ef] transition-colors duration-300 group-hover:scale-110 transform">
                {f.icon}
              </div>
              <h3 className="font-semibold text-[#3d1a2a] mb-1 text-sm">{f.title}</h3>
              <p className="text-xs text-[#9e7b8a] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Priya Ramasubramanian',
      location: 'Chennai, Tamil Nadu',
      rating: 5,
      text: 'I ordered a Kanjivaram silk for my daughter\'s wedding and the quality was absolutely breathtaking. The zari work was exactly as shown, and it arrived beautifully packaged. Will definitely shop again!',
      saree: 'Royal Kanjivaram Silk',
      avatar: 'PR',
      avatarBg: '#8B1A4A',
    },
    {
      name: 'Ananya Krishnaswamy',
      location: 'Bengaluru, Karnataka',
      rating: 5,
      text: 'Bought the Mysore Silk for my anniversary. My husband was speechless! The fabric quality is outstanding and it drapes like a dream. Customer service was also very responsive. Highly recommended!',
      saree: 'Mysore Silk in Royal Purple',
      avatar: 'AK',
      avatarBg: '#C9933A',
    },
    {
      name: 'Meena Venkataraman',
      location: 'Hyderabad, Telangana',
      rating: 5,
      text: 'The Pochampally Ikat saree is a work of art! I could feel the precision and effort that went into every thread. Silk Drapes has earned a loyal customer. The packaging was exquisite too.',
      saree: 'Pochampally Ikat',
      avatar: 'MV',
      avatarBg: '#3d1a2a',
    },
    {
      name: 'Lakshmi Subramaniam',
      location: 'Coimbatore, Tamil Nadu',
      rating: 5,
      text: 'Purchased the Kerala Kasavu saree for Onam and received so many compliments. The cotton is so soft and the kasavu border is perfectly woven. Delivery was quick and the saree was neatly folded.',
      saree: 'Kerala Kasavu Saree',
      avatar: 'LS',
      avatarBg: '#C0426E',
    },
    {
      name: 'Deepa Narayanan',
      location: 'Mumbai, Maharashtra',
      rating: 5,
      text: 'I\'ve bought sarees from many online stores but Silk Drapes is by far the best. The Banarasi brocade I ordered for my sister\'s baby shower was stunning. Authentic quality at fair prices!',
      saree: 'Banarasi Brocade Peacock Blue',
      avatar: 'DN',
      avatarBg: '#5c2d7a',
    },
    {
      name: 'Saranya Murugesan',
      location: 'Madurai, Tamil Nadu',
      rating: 5,
      text: 'Ordered the Bridal Patola for my wedding — it was exactly as described, every detail perfect. Several guests mistook it for a family heirloom! Thank you Silk Drapes for making my special day unforgettable.',
      saree: 'Bridal Patola Silk',
      avatar: 'SM',
      avatarBg: '#8B1A4A',
    },
  ];

  return (
    <section className="py-20 bg-[#1a0a12] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 rounded-full bg-white/10 text-[#f0d49a] text-sm font-medium mb-3">
            Customer Stories
          </span>
          <h2 className="text-3xl md:text-4xl font-display text-white mb-3">
            Loved by Women Across India
          </h2>
          <p className="text-white/50 max-w-lg mx-auto">
            Real reviews from real customers — women who found their perfect drape with us
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 flex flex-col">
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} className="text-[#C9933A] text-lg">★</span>
                ))}
              </div>

              {/* Review text */}
              <p className="text-white/70 text-sm leading-relaxed flex-1 mb-5 italic">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Saree label */}
              <div className="mb-4">
                <span className="inline-block bg-[#8B1A4A]/30 text-[#f0d49a] text-xs px-3 py-1 rounded-full border border-[#8B1A4A]/40">
                  🥻 {t.saree}
                </span>
              </div>

              {/* Customer info */}
              <div className="flex items-center gap-3 border-t border-white/10 pt-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{ background: t.avatarBg }}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-white/40 text-xs">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 text-center">
          {[
            { icon: '⭐', value: '4.8/5', label: 'Average Rating' },
            { icon: '💬', value: '12,000+', label: 'Reviews' },
            { icon: '🏆', value: '98%', label: 'Recommend Us' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="text-3xl">{item.icon}</span>
              <div className="text-left">
                <p className="text-[#f0d49a] font-display font-semibold text-xl">{item.value}</p>
                <p className="text-white/50 text-xs">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsletterSection() {
  return (
    <section className="py-16 bg-gradient-to-r from-[#8B1A4A] to-[#C0426E]">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <span className="text-3xl mb-4 block">💌</span>
        <h2 className="text-2xl md:text-3xl font-display text-white font-semibold mb-3">
          Stay in the Loop
        </h2>
        <p className="text-white/70 mb-8">
          Get exclusive offers, new arrivals and styling tips — straight to your inbox.
        </p>
        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email address"
            className="flex-1 px-5 py-3 rounded-xl text-[#1a0a12] placeholder-[#9e7b8a] focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
          />
          <button
            type="submit"
            className="bg-[#C9933A] hover:bg-[#a67828] text-white font-medium px-6 py-3 rounded-xl transition-colors duration-200 text-sm whitespace-nowrap">
            Subscribe
          </button>
        </form>
        <p className="text-white/40 text-xs mt-4">No spam ever. Unsubscribe anytime.</p>
      </div>
    </section>
  );
}
