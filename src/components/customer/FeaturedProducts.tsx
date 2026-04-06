// src/components/customer/FeaturedProducts.tsx
import Link from 'next/link';
import ProductCard from './ProductCard';
import { IProduct } from '@/types';

async function getFeaturedProducts(): Promise<IProduct[]> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/products?featured=true&limit=8`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const { products } = await res.json();
    return products;
  } catch {
    return [];
  }
}

export default async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  if (!products.length) {
    return (
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center py-12 text-[#9e7b8a]">
          <p className="text-5xl mb-4">🥻</p>
          <p>Products coming soon — check back later!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="text-3xl md:text-4xl font-display text-[#3d1a2a] mb-2">Featured Collection</h2>
          <p className="text-[#9e7b8a]">Handpicked favourites from our weavers</p>
        </div>
        <Link href="/shop" className="text-[#8B1A4A] font-medium text-sm hover:underline hidden sm:block">
          View all →
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      <div className="text-center mt-10 sm:hidden">
        <Link href="/shop" className="btn-outline inline-block">View All Sarees</Link>
      </div>
    </section>
  );
}
