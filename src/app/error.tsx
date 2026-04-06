'use client';
// src/app/error.tsx
import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-5">⚠️</div>
        <h1 className="text-2xl font-display text-[#3d1a2a] mb-3">Something went wrong</h1>
        <p className="text-[#9e7b8a] mb-8 text-sm leading-relaxed">
          An unexpected error occurred. Please try again or return to the homepage.
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="btn-primary">Try Again</button>
          <Link href="/" className="btn-outline">Go Home</Link>
        </div>
      </div>
    </div>
  );
}
