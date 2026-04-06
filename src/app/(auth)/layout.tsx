// src/app/(auth)/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'Account', template: '%s | Silk Drapes' },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
