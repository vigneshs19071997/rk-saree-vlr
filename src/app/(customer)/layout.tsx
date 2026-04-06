// src/app/(customer)/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'Silk Drapes — Premium Saree Collection', template: '%s | Silk Drapes' },
};

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
