'use client';
// src/components/customer/ProductCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/lib/store';
import { IProduct } from '@/types';
import { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

interface Props {
  product: IProduct;
  favouriteIds?: string[];
  onFavouriteToggle?: (productId: string) => void;
}

export default function ProductCard({ product, favouriteIds = [], onFavouriteToggle }: Props) {
  const { data: session } = useSession();
  const addToCart = useCartStore((s) => s.addToCart);
  const [isFav, setIsFav] = useState(favouriteIds.includes(product._id));
  const [favLoading, setFavLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock === 0) { toast.error('Out of stock'); return; }
    addToCart(product);
    toast.success(`${product.name} added to cart! 🛍️`);
  };

  const handleFavourite = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!session) { toast.error('Please login to save favourites'); return; }
    setFavLoading(true);
    try {
      await axios.post('/api/user/favourites', { productId: product._id });
      setIsFav(!isFav);
      onFavouriteToggle?.(product._id);
      toast.success(isFav ? 'Removed from favourites' : '❤️ Added to favourites');
    } catch {
      toast.error('Failed to update favourites');
    } finally {
      setFavLoading(false);
    }
  };

  return (
    <Link href={`/product/${product._id}`} className="saree-card group block bg-white rounded-2xl overflow-hidden border border-[#f0e8e0] hover:border-[#d4a0b5] hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-[3/4] bg-[#fdf8f3] overflow-hidden">
        {product.images?.[0] && !imageError ? (
          <Image src={product.images[0]} alt={product.name} fill className="saree-img object-cover"
            onError={() => setImageError(true)} sizes="(max-width: 640px) 50vw, 25vw" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-[#f7e8ef] to-[#fdf8f3]">🥻</div>
        )}

        {/* Overlay */}
        <div className="saree-overlay absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 flex items-end justify-center pb-4">
          <button onClick={handleAddToCart}
            className="flex items-center gap-2 bg-white text-[#8B1A4A] px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-[#8B1A4A] hover:text-white transition-all duration-200 shadow-lg transform translate-y-2 group-hover:translate-y-0">
            <ShoppingBag size={16} />
            Add to Cart
          </button>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="px-2 py-0.5 bg-[#8B1A4A] text-white text-xs rounded-lg font-medium">-{discount}%</span>
          )}
          {product.featured && (
            <span className="px-2 py-0.5 bg-[#C9933A] text-white text-xs rounded-lg font-medium">★ Featured</span>
          )}
          {product.stock === 0 && (
            <span className="px-2 py-0.5 bg-gray-500 text-white text-xs rounded-lg font-medium">Sold Out</span>
          )}
        </div>

        {/* Favourite */}
        <button onClick={handleFavourite} disabled={favLoading}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200 ${isFav ? 'bg-[#8B1A4A] text-white' : 'bg-white text-[#9e7b8a] hover:text-[#8B1A4A]'}`}>
          <Heart size={16} fill={isFav ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="p-4">
        <p className="text-xs text-[#9e7b8a] mb-1 uppercase tracking-wide">{product.category}</p>
        <h3 className="font-medium text-[#3d1a2a] text-sm leading-snug mb-2 line-clamp-2">{product.name}</h3>

        {product.averageRating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <Star size={12} fill="#C9933A" className="text-[#C9933A]" />
            <span className="text-xs text-[#9e7b8a]">{product.averageRating.toFixed(1)} ({product.totalReviews})</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          {product.discountPrice ? (
            <>
              <span className="text-base font-bold text-[#8B1A4A]">₹{product.discountPrice.toLocaleString('en-IN')}</span>
              <span className="text-sm text-[#b89aa8] line-through">₹{product.price.toLocaleString('en-IN')}</span>
            </>
          ) : (
            <span className="text-base font-bold text-[#8B1A4A]">₹{product.price.toLocaleString('en-IN')}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
