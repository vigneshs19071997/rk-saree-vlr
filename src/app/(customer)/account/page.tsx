'use client';
// src/app/(customer)/account/page.tsx
import { useState, useEffect } from 'react';
import Navbar from '@/components/customer/Navbar';
import Footer from '@/components/customer/Footer';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { IAddress } from '@/types';
import { Plus, Edit2, Trash2, Check } from 'lucide-react';

export default function AccountPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState({ name: '', phone: '' });
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddAddr, setShowAddAddr] = useState(false);
  const [newAddr, setNewAddr] = useState<Omit<IAddress, '_id'>>({ label: 'Home', fullName: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '', country: 'India', isDefault: false });

  useEffect(() => {
    if (!session) { router.push('/login'); return; }
    axios.get('/api/user').then(({ data }) => {
      setProfile({ name: data.user.name, phone: data.user.phone || '' });
      setAddresses(data.user.addresses || []);
      setLoading(false);
    });
  }, [session, router]);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      await axios.patch('/api/user', profile);
      toast.success('Profile updated!');
    } catch { toast.error('Failed to update'); }
    finally { setSaving(false); }
  };

  const saveAddress = async () => {
    if (!newAddr.fullName || !newAddr.phone || !newAddr.line1 || !newAddr.city || !newAddr.pincode) {
      toast.error('Please fill required fields'); return;
    }
    try {
      const updated = [...addresses, newAddr];
      await axios.patch('/api/user', { addresses: updated });
      setAddresses(updated as IAddress[]);
      setShowAddAddr(false);
      setNewAddr({ label: 'Home', fullName: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '', country: 'India', isDefault: false });
      toast.success('Address added!');
    } catch { toast.error('Failed to add address'); }
  };

  const deleteAddress = async (idx: number) => {
    const updated = addresses.filter((_, i) => i !== idx);
    await axios.patch('/api/user', { addresses: updated });
    setAddresses(updated);
    toast.success('Address removed');
  };

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-display text-[#3d1a2a] mb-8">My Account</h1>
        {loading ? <div className="space-y-4">{[1,2].map(i => <div key={i} className="h-40 shimmer rounded-2xl" />)}</div> : (
          <div className="space-y-5">
            {/* Profile */}
            <div className="bg-white rounded-2xl border border-[#f0e8e0] p-6">
              <h2 className="font-semibold text-[#3d1a2a] mb-4">Profile Information</h2>
              <form onSubmit={saveProfile} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className="block text-xs font-medium text-[#9e7b8a] mb-1.5">Full Name</label>
                    <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="input-field" /></div>
                  <div><label className="block text-xs font-medium text-[#9e7b8a] mb-1.5">Phone</label>
                    <input type="tel" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="input-field" /></div>
                </div>
                <div><label className="block text-xs font-medium text-[#9e7b8a] mb-1.5">Email</label>
                  <input type="email" value={session?.user?.email || ''} disabled className="input-field opacity-60 cursor-not-allowed" /></div>
                <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                  {saving ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</> : <><Check size={16} />Save Changes</>}
                </button>
              </form>
            </div>

            {/* Addresses */}
            <div className="bg-white rounded-2xl border border-[#f0e8e0] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-[#3d1a2a]">Saved Addresses</h2>
                <button onClick={() => setShowAddAddr(!showAddAddr)} className="flex items-center gap-1.5 text-sm text-[#8B1A4A] hover:underline">
                  <Plus size={15} /> Add Address
                </button>
              </div>
              <div className="space-y-3">
                {addresses.map((addr, i) => (
                  <div key={i} className="flex gap-3 p-4 bg-[#fdf8f3] rounded-xl">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-[#3d1a2a] text-sm">{addr.fullName}</span>
                        <span className="text-xs px-2 py-0.5 bg-[#f7e8ef] text-[#8B1A4A] rounded-full">{addr.label}</span>
                        {addr.isDefault && <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Default</span>}
                      </div>
                      <p className="text-xs text-[#9e7b8a]">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}, {addr.state} — {addr.pincode}</p>
                      <p className="text-xs text-[#9e7b8a]">📞 {addr.phone}</p>
                    </div>
                    <button onClick={() => deleteAddress(i)} className="text-[#9e7b8a] hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
              {showAddAddr && (
                <div className="mt-4 pt-4 border-t border-[#f0e8e0] space-y-3 animate-fadeInUp">
                  <h3 className="font-medium text-[#3d1a2a] text-sm">New Address</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      { k: 'label', l: 'Label', p: 'Home/Office' }, { k: 'fullName', l: 'Full Name *', p: 'Name' },
                      { k: 'phone', l: 'Phone *', p: 'Mobile' }, { k: 'line1', l: 'Address Line 1 *', p: 'Street' },
                      { k: 'line2', l: 'Line 2', p: 'Landmark' }, { k: 'city', l: 'City *', p: 'City' },
                      { k: 'state', l: 'State *', p: 'State' }, { k: 'pincode', l: 'PIN *', p: '6-digit' },
                    ].map(({ k, l, p }) => (
                      <div key={k}><label className="block text-xs font-medium text-[#9e7b8a] mb-1">{l}</label>
                        <input type="text" placeholder={p} value={newAddr[k as keyof typeof newAddr] as string}
                          onChange={(e) => setNewAddr({ ...newAddr, [k]: e.target.value })} className="input-field text-sm py-2" />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setShowAddAddr(false)} className="btn-outline text-sm py-2 px-5">Cancel</button>
                    <button onClick={saveAddress} className="btn-primary text-sm py-2 px-5">Save Address</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
