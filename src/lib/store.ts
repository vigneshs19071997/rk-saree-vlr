// src/lib/store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IProduct } from '@/types';

interface CartItem {
  product: IProduct;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addToCart: (product: IProduct, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
  count: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.product._id === product._id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product._id === product._id
                  ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) }
                  : i
              ),
            };
          }
          return { items: [...state.items, { product, quantity }] };
        });
      },
      removeFromCart: (productId) => {
        set((state) => ({ items: state.items.filter((i) => i.product._id !== productId) }));
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product._id === productId ? { ...i, quantity } : i
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      total: () => {
        return get().items.reduce((acc, item) => {
          const price = item.product.discountPrice || item.product.price;
          return acc + price * item.quantity;
        }, 0);
      },
      count: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
    }),
    { name: 'silk-drapes-cart' }
  )
);
