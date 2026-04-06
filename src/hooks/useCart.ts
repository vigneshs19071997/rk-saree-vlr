// src/hooks/useCart.ts
import { useCartStore } from '@/lib/store';

export function useCart() {
  const items     = useCartStore((s) => s.items);
  const addToCart = useCartStore((s) => s.addToCart);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const total     = useCartStore((s) => s.total());
  const count     = useCartStore((s) => s.count());

  return { items, addToCart, removeFromCart, updateQuantity, clearCart, total, count };
}
