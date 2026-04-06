'use client';
// src/components/admin/AdminLayout.tsx
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingBag, Settings, Menu, X, LogOut, ChevronRight } from 'lucide-react';
import { signOut } from 'next-auth/react';

const NAV = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/products', icon: Package, label: 'Products' },
  { href: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/login'); return; }
    if (session && (session.user as { role?: string })?.role !== 'admin') { router.push('/'); }
  }, [session, status, router]);

  if (status === 'loading') return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="text-center"><div className="w-10 h-10 border-2 border-[#8B1A4A] border-t-transparent rounded-full animate-spin mx-auto mb-3" /><p className="text-[#9e7b8a]">Loading...</p></div>
    </div>
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-[#f0e8e0]">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#8B1A4A] rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-sm">SD</span>
          </div>
          <div><p className="font-display font-semibold text-[#3d1a2a]">Silk Drapes</p><p className="text-xs text-[#9e7b8a]">Admin Panel</p></div>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href);
          return (
            <Link key={href} href={href} onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${active ? 'bg-[#f7e8ef] text-[#8B1A4A]' : 'text-[#6b4d57] hover:bg-[#fdf8f3] hover:text-[#3d1a2a]'}`}>
              <Icon size={18} />
              {label}
              {active && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-[#f0e8e0]">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-8 h-8 bg-[#f7e8ef] rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-[#8B1A4A]">{session?.user?.name?.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#3d1a2a] truncate">{session?.user?.name}</p>
            <p className="text-xs text-[#9e7b8a] truncate">{session?.user?.email}</p>
          </div>
        </div>
        <button onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors">
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fdf8f3] flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-[#f0e8e0] flex-shrink-0 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 bg-white h-full shadow-xl"><SidebarContent /></aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-[#f0e8e0] sticky top-0 z-40">
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-[#6b4d57]"><Menu size={22} /></button>
          <span className="font-display font-semibold text-[#3d1a2a]">Admin Panel</span>
          <div className="w-9" />
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
