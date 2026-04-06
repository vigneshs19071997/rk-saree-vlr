// src/app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6">🥻</div>
        <h1 className="text-6xl font-display font-bold text-[#8B1A4A] mb-3">404</h1>
        <h2 className="text-2xl font-display text-[#3d1a2a] mb-3">Page Not Found</h2>
        <p className="text-[#9e7b8a] mb-8 leading-relaxed">
          The page you're looking for has been woven into the fabric of another dimension.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="btn-primary">Go Home</Link>
          <Link href="/shop" className="btn-outline">Browse Sarees</Link>
        </div>
      </div>
    </div>
  );
}
