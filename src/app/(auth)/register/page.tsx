'use client';
// src/app/(auth)/register/page.tsx
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await axios.post('/api/auth/register', { name: form.name, email: form.email, phone: form.phone, password: form.password });
      toast.success('Account created! Signing you in... 🎉');
      await signIn('credentials', { email: form.email, password: form.password, redirect: false });
      router.push('/');
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err) ? err.response?.data?.error : 'Registration failed';
      toast.error(msg || 'Registration failed');
    } finally { setLoading(false); }
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
          <h1 className="text-2xl font-display text-[#3d1a2a] mb-1">Create Account</h1>
          <p className="text-[#9e7b8a] text-sm mb-7">Join thousands of saree lovers</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Your full name' },
              { key: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com' },
              { key: 'phone', label: 'Phone Number', type: 'tel', placeholder: '10-digit mobile (optional)' },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-[#9e7b8a] mb-1.5">{label}</label>
                <input type={type} placeholder={placeholder} required={key !== 'phone'}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="input-field" />
              </div>
            ))}
            {(['password', 'confirm'] as const).map((key) => (
              <div key={key}>
                <label className="block text-xs font-medium text-[#9e7b8a] mb-1.5">
                  {key === 'password' ? 'Password' : 'Confirm Password'}
                </label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} required
                    placeholder={key === 'password' ? 'Min. 6 characters' : 'Re-enter password'}
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="input-field pr-12" />
                  {key === 'password' && (
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9e7b8a] hover:text-[#8B1A4A]">
                      {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
              {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating...</> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-[#9e7b8a] mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-[#8B1A4A] font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
