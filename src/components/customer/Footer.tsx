// src/components/customer/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#1a0a12] text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#8B1A4A] rounded-xl flex items-center justify-center">
                <span className="font-bold text-sm">SD</span>
              </div>
              <span className="font-display text-xl">Silk Drapes</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-4">Bringing the finest handcrafted sarees from India's master weavers to your doorstep.</p>
            <div className="flex gap-3">
              {['📘', '📸', '🐦'].map((icon, i) => (
                <button key={i} className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">{icon}</button>
              ))}
            </div>
          </div>

          {[
            { title: 'Collections', links: [['All Sarees', '/shop'], ['Silk Sarees', '/shop?category=Silk+Sarees'], ['Banarasi', '/shop?category=Banarasi+Sarees'], ['Kanjivaram', '/shop?category=Kanjivaram+Sarees'], ['Bridal', '/shop?category=Bridal+Sarees']] },
            { title: 'Account', links: [['My Orders', '/orders'], ['Favourites', '/favourites'], ['My Account', '/account'], ['Login', '/login'], ['Register', '/register']] },
            { title: 'Help', links: [['About Us', '/about'], ['Contact', '/contact'], ['Shipping Policy', '/shipping'], ['Return Policy', '/returns'], ['Privacy Policy', '/privacy']] },
          ].map(({ title, links }) => (
            <div key={title}>
              <h3 className="font-semibold mb-4 text-white/90">{title}</h3>
              <ul className="space-y-2.5">
                {links.map(([label, href]) => (
                  <li key={label}><Link href={href} className="text-white/50 text-sm hover:text-white/90 transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-sm">© 2025 Silk Drapes. All rights reserved.</p>
          <div className="flex items-center gap-3 text-white/40 text-sm">
            <span>🇮🇳 Made with love in India</span>
            <span>·</span>
            <span>₹ INR</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
