'use client';
// src/components/customer/Navbar.tsx
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useCartStore } from '@/lib/store';
import { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Heart, User, Menu, X, Search, LogOut, Package, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const { data: session } = useSession();
  const cartCount = useCartStore((s) => s.count());
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Prevent hydration mismatch: cart count lives in localStorage (client-only)
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const categories = [
    { label: 'Silk', href: '/shop?category=Silk+Sarees' },
    { label: 'Kanjivaram', href: '/shop?category=Kanjivaram+Sarees' },
    { label: 'Banarasi', href: '/shop?category=Banarasi+Sarees' },
    { label: 'Cotton', href: '/shop?category=Cotton+Sarees' },
    { label: 'Bridal', href: '/shop?category=Bridal+Sarees' },
    { label: 'Designer', href: '/shop?category=Designer+Sarees' },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white'} border-b border-[#f0e8e0]`}>
      {/* Top announcement bar */}
      <div className="bg-gradient-to-r from-[#5e1032] via-[#8B1A4A] to-[#C0426E] text-white text-center text-xs py-2.5 px-4">
        <span className="hidden sm:inline">🎉 Free shipping on orders above ₹999 &nbsp;|&nbsp; 7-day easy returns &nbsp;|&nbsp; </span>
        <span className="text-[#f0d49a] font-medium">New Collection: Bridal Kanjivaram 2025</span>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-[#8B1A4A] to-[#C0426E] rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white text-xs font-bold tracking-wide">SD</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-display text-xl text-[#3d1a2a] font-semibold leading-none">Silk Drapes</span>
              <p className="text-[10px] text-[#9e7b8a] leading-none mt-0.5">Pure Handloom India</p>
            </div>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            <Link href="/shop"
              className="px-4 py-2 text-sm font-semibold text-[#8B1A4A] hover:bg-[#f7e8ef] rounded-lg transition-colors">
              All Sarees
            </Link>
            {categories.map((cat) => (
              <Link key={cat.label} href={cat.href}
                className="px-3 py-2 text-sm text-[#6b4d57] hover:text-[#8B1A4A] hover:bg-[#fdf8f3] rounded-lg transition-colors">
                {cat.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">

            {/* Search button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
              className="p-2 text-[#6b4d57] hover:text-[#8B1A4A] transition-colors rounded-lg hover:bg-[#fdf8f3]">
              <Search size={20} />
            </button>

            {/* Favourites (only when logged in) */}
            {session && (
              <Link href="/favourites" aria-label="Favourites"
                className="p-2 text-[#6b4d57] hover:text-[#8B1A4A] transition-colors rounded-lg hover:bg-[#fdf8f3]">
                <Heart size={20} />
              </Link>
            )}

            {/* Cart */}
            <Link href="/cart" aria-label="Cart"
              className="relative p-2 text-[#6b4d57] hover:text-[#8B1A4A] transition-colors rounded-lg hover:bg-[#fdf8f3]">
              <ShoppingBag size={20} />
              {mounted && cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#8B1A4A] text-white text-xs rounded-full flex items-center justify-center font-medium animate-scaleIn">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* ── Login / User menu ─────────────────────────────── */}
            {session ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-xl hover:bg-[#fdf8f3] transition-colors border border-transparent hover:border-[#f0e8e0]">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#8B1A4A] to-[#C0426E] rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-xs font-bold text-white">
                      {session.user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden sm:block text-xs font-medium text-[#3d1a2a] max-w-[80px] truncate">
                    {session.user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} className={`text-[#9e7b8a] transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#f0e8e0] py-2 z-50 animate-scaleIn">
                    <div className="px-4 py-3 border-b border-[#f0e8e0]">
                      <p className="font-semibold text-[#3d1a2a] text-sm truncate">{session.user?.name}</p>
                      <p className="text-xs text-[#9e7b8a] truncate mt-0.5">{session.user?.email}</p>
                    </div>
                    {(session.user as { role?: string })?.role === 'admin' && (
                      <Link href="/admin/dashboard" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#8B1A4A] hover:bg-[#fdf8f3] font-medium">
                        ⚙️ Admin Panel
                      </Link>
                    )}
                    <Link href="/account" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#3d1a2a] hover:bg-[#fdf8f3] transition-colors">
                      <User size={16} className="text-[#8B1A4A]" /> My Account
                    </Link>
                    <Link href="/orders" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#3d1a2a] hover:bg-[#fdf8f3] transition-colors">
                      <Package size={16} className="text-[#8B1A4A]" /> My Orders
                    </Link>
                    <Link href="/favourites" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#3d1a2a] hover:bg-[#fdf8f3] transition-colors">
                      <Heart size={16} className="text-[#8B1A4A]" /> Favourites
                    </Link>
                    <div className="border-t border-[#f0e8e0] mt-1 pt-1">
                      <button
                        onClick={() => { signOut({ callbackUrl: '/' }); setUserMenuOpen(false); }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* ── Guest: Login + Register buttons ─────────────── */
              <div className="flex items-center gap-2">
                <Link href="/login"
                  className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-[#8B1A4A] border border-[#e8d5db] hover:bg-[#fdf8f3] transition-all duration-200">
                  <User size={15} />
                  Sign In
                </Link>
                <Link href="/register"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-[#8B1A4A] text-white hover:bg-[#5e1032] transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5">
                  <span className="hidden xs:inline">Get Started</span>
                  <span className="xs:hidden"><User size={15} /></span>
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              className="lg:hidden p-2 text-[#6b4d57] hover:text-[#8B1A4A] rounded-lg hover:bg-[#fdf8f3] transition-colors ml-1">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="pb-4 animate-fadeInUp">
            <form action="/shop" method="get" className="relative">
              <input
                type="text"
                name="search"
                placeholder="Search sarees, materials, occasions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pr-12"
                autoFocus
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B1A4A]">
                <Search size={18} />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-[#f0e8e0] bg-white animate-fadeInUp shadow-lg">
          <div className="px-4 py-4 space-y-1">
            <Link href="/shop"
              className="flex items-center justify-between py-3 text-[#3d1a2a] font-semibold border-b border-[#f0e8e0]"
              onClick={() => setMenuOpen(false)}>
              All Sarees <span className="text-[#8B1A4A]">→</span>
            </Link>
            {categories.map((cat) => (
              <Link key={cat.label} href={cat.href}
                className="block py-2.5 text-[#6b4d57] text-sm hover:text-[#8B1A4A] transition-colors pl-2"
                onClick={() => setMenuOpen(false)}>
                {cat.label} Sarees
              </Link>
            ))}

            {/* Mobile auth buttons */}
            {!session && (
              <div className="flex gap-3 pt-4 border-t border-[#f0e8e0]">
                <Link href="/login"
                  className="flex-1 text-center py-3 rounded-xl text-sm font-medium text-[#8B1A4A] border border-[#e8d5db] hover:bg-[#fdf8f3] transition-colors"
                  onClick={() => setMenuOpen(false)}>
                  Sign In
                </Link>
                <Link href="/register"
                  className="flex-1 text-center py-3 rounded-xl text-sm font-semibold bg-[#8B1A4A] text-white hover:bg-[#5e1032] transition-colors"
                  onClick={() => setMenuOpen(false)}>
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
