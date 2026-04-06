'use client';
// src/app/(customer)/product/[id]/page.tsx
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/customer/Navbar';
import Footer from '@/components/customer/Footer';
import { useCartStore } from '@/lib/store';
import { IProduct } from '@/types';
import { Heart, ShoppingBag, Zap, Star, Package, RefreshCw, Shield, ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const addToCart = useCartStore((s) => s.addToCart);

  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFav, setIsFav] = useState(false);
  const [tab, setTab] = useState<'description' | 'details' | 'reviews'>('description');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!id) return;
    axios.get(`/api/products/${id}`)
      .then(({ data }) => { setProduct(data.product); setLoading(false); })
      .catch(() => { setLoading(false); });
  }, [id]);

  useEffect(() => {
    if (session && product) {
      axios.get('/api/user').then(({ data }) => {
        setIsFav(data.user.favourites?.some((f: IProduct | string) =>
          typeof f === 'string' ? f === product._id : f._id === product._id
        ));
      }).catch(() => {});
    }
  }, [session, product]);

  const handleFavourite = async () => {
    if (!session) { toast.error('Please login to save favourites'); return; }
    try {
      await axios.post('/api/user/favourites', { productId: product!._id });
      setIsFav(!isFav);
      toast.success(isFav ? 'Removed from favourites' : '❤️ Added to favourites');
    } catch { toast.error('Failed'); }
  };

  const handleAddToCart = () => {
    if (!product) return;
    setAdding(true);
    addToCart(product, quantity);
    toast.success(`Added ${quantity} × ${product.name} to cart! 🛍️`);
    setTimeout(() => setAdding(false), 800);
  };

  const handleBuyNow = () => {
    if (!session) { toast.error('Please login to continue'); router.push('/login'); return; }
    if (!product) return;
    addToCart(product, quantity);
    router.push('/checkout');
  };

  const discount = product?.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;

  if (loading) return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">
        <div className="aspect-square shimmer rounded-2xl" />
        <div className="space-y-4">
          <div className="h-8 shimmer rounded-xl w-3/4" />
          <div className="h-6 shimmer rounded-xl w-1/2" />
          <div className="h-24 shimmer rounded-xl" />
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="text-center"><p className="text-5xl mb-4">😔</p>
        <h2 className="text-xl font-display text-[#3d1a2a] mb-4">Product not found</h2>
        <Link href="/shop" className="btn-primary">Back to Shop</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[#9e7b8a] mb-6">
          <Link href="/" className="hover:text-[#8B1A4A]">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#8B1A4A]">Shop</Link>
          <span>/</span>
          <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-[#8B1A4A]">{product.category}</Link>
          <span>/</span>
          <span className="text-[#3d1a2a] line-clamp-1">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          {/* Image gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-[#fdf8f3] rounded-2xl overflow-hidden border border-[#f0e8e0]">
              {product.images?.[selectedImage] ? (
                <Image src={product.images[selectedImage]} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" priority />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl">🥻</div>
              )}
              {discount > 0 && (
                <span className="absolute top-4 left-4 px-3 py-1 bg-[#8B1A4A] text-white text-sm rounded-xl font-semibold">-{discount}% OFF</span>
              )}
              {product.images?.length > 1 && (
                <>
                  <button onClick={() => setSelectedImage((s) => (s - 1 + product.images.length) % product.images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white">
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={() => setSelectedImage((s) => (s + 1) % product.images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white">
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${i === selectedImage ? 'border-[#8B1A4A]' : 'border-[#f0e8e0] hover:border-[#d4a0b5]'}`}>
                    <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="animate-fadeInUp">
            <p className="text-sm text-[#9e7b8a] mb-2 uppercase tracking-wide">{product.category}</p>
            <h1 className="text-2xl md:text-3xl font-display text-[#3d1a2a] mb-3">{product.name}</h1>

            {product.averageRating > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">{Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} className={i < Math.round(product.averageRating) ? 'text-[#C9933A] fill-[#C9933A]' : 'text-gray-200'} />
                ))}</div>
                <span className="text-sm text-[#9e7b8a]">{product.averageRating.toFixed(1)} ({product.totalReviews} reviews)</span>
              </div>
            )}

            <div className="flex items-center gap-3 mb-6">
              {product.discountPrice ? (
                <>
                  <span className="text-3xl font-bold text-[#8B1A4A]">₹{product.discountPrice.toLocaleString('en-IN')}</span>
                  <span className="text-xl text-[#b89aa8] line-through">₹{product.price.toLocaleString('en-IN')}</span>
                  <span className="px-2.5 py-0.5 bg-green-100 text-green-700 text-sm rounded-lg font-medium">Save ₹{(product.price - product.discountPrice).toLocaleString('en-IN')}</span>
                </>
              ) : (
                <span className="text-3xl font-bold text-[#8B1A4A]">₹{product.price.toLocaleString('en-IN')}</span>
              )}
            </div>

            {/* Material & Colors */}
            <div className="bg-[#fdf8f3] rounded-2xl p-4 mb-6 space-y-2">
              <div className="flex gap-2 text-sm"><span className="text-[#9e7b8a] w-24">Material</span><span className="font-medium text-[#3d1a2a]">{product.material}</span></div>
              {product.color?.length > 0 && (
                <div className="flex gap-2 text-sm"><span className="text-[#9e7b8a] w-24">Colors</span><span className="font-medium text-[#3d1a2a]">{product.color.join(', ')}</span></div>
              )}
              {product.occasion?.length > 0 && (
                <div className="flex gap-2 text-sm"><span className="text-[#9e7b8a] w-24">Occasion</span><span className="font-medium text-[#3d1a2a]">{product.occasion.join(', ')}</span></div>
              )}
              <div className="flex gap-2 text-sm">
                <span className="text-[#9e7b8a] w-24">Stock</span>
                <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                </span>
              </div>
            </div>

            {/* Quantity */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-medium text-[#3d1a2a]">Quantity</span>
                <div className="flex items-center border border-[#e8d5db] rounded-xl overflow-hidden">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-[#fdf8f3] transition-colors">
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-semibold text-[#3d1a2a]">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-[#fdf8f3] transition-colors">
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 mb-6">
              <button onClick={handleAddToCart} disabled={product.stock === 0 || adding}
                className="flex-1 btn-outline flex items-center justify-center gap-2">
                <ShoppingBag size={18} />
                {adding ? 'Added! ✓' : 'Add to Cart'}
              </button>
              <button onClick={handleBuyNow} disabled={product.stock === 0}
                className="flex-1 btn-primary flex items-center justify-center gap-2">
                <Zap size={18} />
                Buy Now
              </button>
              <button onClick={handleFavourite}
                className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all ${isFav ? 'border-[#8B1A4A] bg-[#8B1A4A] text-white' : 'border-[#e8d5db] text-[#9e7b8a] hover:border-[#8B1A4A] hover:text-[#8B1A4A]'}`}>
                <Heart size={20} fill={isFav ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { icon: <Package size={18} />, text: 'Free Delivery above ₹999' },
                { icon: <RefreshCw size={18} />, text: '7-Day Returns' },
                { icon: <Shield size={18} />, text: 'Authentic Guarantee' },
              ].map((item) => (
                <div key={item.text} className="flex flex-col items-center gap-1.5 p-3 bg-[#fdf8f3] rounded-xl text-[#8B1A4A]">
                  {item.icon}
                  <span className="text-xs text-[#9e7b8a] leading-tight">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12 bg-white rounded-2xl border border-[#f0e8e0] overflow-hidden">
          <div className="flex border-b border-[#f0e8e0]">
            {(['description', 'details', 'reviews'] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-6 py-4 text-sm font-medium capitalize transition-colors ${tab === t ? 'text-[#8B1A4A] border-b-2 border-[#8B1A4A] -mb-px' : 'text-[#9e7b8a] hover:text-[#3d1a2a]'}`}>
                {t}
              </button>
            ))}
          </div>
          <div className="p-6">
            {tab === 'description' && (
              <p className="text-[#6b4d57] leading-relaxed whitespace-pre-line">{product.description}</p>
            )}
            {tab === 'details' && (
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  ['Category', product.category], ['Material', product.material],
                  ['SKU', product.sku], ['Stock', `${product.stock} units`],
                  ['Colors', product.color?.join(', ')], ['Occasion', product.occasion?.join(', ')],
                ].filter(([, v]) => v).map(([k, v]) => (
                  <div key={k} className="flex gap-3 py-2 border-b border-[#f0e8e0]">
                    <span className="text-[#9e7b8a] w-28 flex-shrink-0 text-sm">{k}</span>
                    <span className="text-[#3d1a2a] text-sm font-medium">{v}</span>
                  </div>
                ))}
              </div>
            )}
            {tab === 'reviews' && (
              product.ratings?.length > 0 ? (
                <div className="space-y-4">
                  {product.ratings.map((r, i) => (
                    <div key={i} className="border-b border-[#f0e8e0] pb-4 last:border-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">{Array.from({ length: 5 }).map((_, j) => (
                          <Star key={j} size={14} className={j < r.rating ? 'text-[#C9933A] fill-[#C9933A]' : 'text-gray-200'} />
                        ))}</div>
                        <span className="text-xs text-[#9e7b8a]">{new Date(r.createdAt).toLocaleDateString('en-IN')}</span>
                      </div>
                      {r.review && <p className="text-sm text-[#6b4d57]">{r.review}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#9e7b8a] text-center py-8">No reviews yet. Be the first to review!</p>
              )
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
