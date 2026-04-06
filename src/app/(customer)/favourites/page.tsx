'use client';
// src/app/(customer)/favourites/page.tsx
import { useEffect, useState } from 'react';
import Navbar from '@/components/customer/Navbar';
import Footer from '@/components/customer/Footer';
import ProductCard from '@/components/customer/ProductCard';
import { IProduct } from '@/types';
import axios from 'axios';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function FavouritesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [favourites, setFavourites] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) { router.push('/login'); return; }
    axios.get('/api/user').then(({ data }) => {
      setFavourites(data.user.favourites || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [session, router]);

  const handleRemove = (productId: string) => {
    setFavourites((prev) => prev.filter((p) => p._id !== productId));
  };

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-display text-[#3d1a2a] mb-8">
          My Favourites <span className="text-[#9e7b8a] text-lg font-sans">({favourites.length})</span>
        </h1>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden"><div className="aspect-[3/4] shimmer" /></div>
            ))}
          </div>
        ) : favourites.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-[#f7e8ef] rounded-full flex items-center justify-center mx-auto mb-5">
              <Heart size={40} className="text-[#8B1A4A]" />
            </div>
            <h2 className="text-xl font-display text-[#3d1a2a] mb-3">No favourites yet</h2>
            <p className="text-[#9e7b8a] mb-6">Heart the sarees you love while browsing</p>
            <Link href="/shop" className="btn-primary inline-block">Browse Sarees</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {favourites.map((product) => (
              <ProductCard key={product._id} product={product}
                favouriteIds={favourites.map((f) => f._id)}
                onFavouriteToggle={handleRemove} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
