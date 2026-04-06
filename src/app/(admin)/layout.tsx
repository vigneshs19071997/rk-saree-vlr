// src/app/(admin)/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'Admin Panel', template: '%s | Silk Drapes Admin' },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
