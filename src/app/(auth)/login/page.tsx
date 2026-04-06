'use client';
// src/app/(auth)/login/page.tsx
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await signIn('credentials', { ...form, redirect: false });
    if (res?.ok) {
      toast.success('Welcome back! 🌸');
      router.push(callbackUrl);
    } else {
      toast.error('Invalid email or password');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3d1a2a] via-[#8B1A4A] to-[#C0426E] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-[#8B1A4A] font-bold text-lg">SD</span>
            </div>
            <span className="text-white font-display text-2xl">Silk Drapes</span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 animate-scaleIn">
          <h1 className="text-2xl font-display text-[#3d1a2a] mb-1">Welcome back</h1>
          <p className="text-[#9e7b8a] text-sm mb-7">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#9e7b8a] mb-1.5">Email Address</label>
              <input type="email" required placeholder="you@example.com"
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#9e7b8a] mb-1.5">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} required placeholder="••••••••"
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-field pr-12" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9e7b8a] hover:text-[#8B1A4A]">
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
              {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Signing in...</> : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-[#9e7b8a] mt-6">
            New here?{' '}
            <Link href="/register" className="text-[#8B1A4A] font-medium hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
