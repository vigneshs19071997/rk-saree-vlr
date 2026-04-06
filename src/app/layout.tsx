// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
// Note: globals.css is at src/app/globals.css
import { Providers } from '@/components/shared/Providers';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: { default: 'Silk Drapes — Premium Saree Collection', template: '%s | Silk Drapes' },
  description: 'Discover exquisite handcrafted sarees — Kanjivaram, Banarasi, Silk & more. Free shipping on orders above ₹999.',
  keywords: ['saree', 'silk saree', 'kanjivaram', 'banarasi', 'designer saree', 'buy saree online'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Providers>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#fff',
                color: '#1a0a12',
                borderRadius: '12px',
                border: '1px solid #f0e8e0',
                boxShadow: '0 8px 32px rgba(139,26,74,0.12)',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#8B1A4A', secondary: '#fff' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
