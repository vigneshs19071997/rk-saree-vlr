// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx';

/** Merge Tailwind class names safely */
export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(' ');
}

/** Format price to Indian Rupee string */
export function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

/** Truncate text with ellipsis */
export function truncate(text: string, max = 80): string {
  return text.length > max ? text.slice(0, max - 3) + '...' : text;
}

/** Calculate discount percentage */
export function discountPercent(original: number, discounted: number): number {
  return Math.round(((original - discounted) / original) * 100);
}

/** Slugify a string */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Generate a random order number */
export function generateOrderNumber(): string {
  return `SD${Date.now()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

/** Relative time (e.g. "2 hours ago") */
export function timeAgo(date: Date | string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60)  return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

/** Free shipping threshold */
export const FREE_SHIPPING_AT = 999;
export const SHIPPING_CHARGE  = 99;
export const RETURN_DAYS      = Number(process.env.NEXT_PUBLIC_RETURN_DAYS ?? 7);

export function shippingCost(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_AT ? 0 : SHIPPING_CHARGE;
}
