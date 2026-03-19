import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * useCartStore — Zustand v5 + Immer + AsyncStorage persistence
 *
 * Zustand v5 changes:
 * - `create` no longer has a default export — use named import ✅ already correct
 * - Middleware stacking order: persist wraps immer (outermost to innermost)
 * - `immer` imports from 'zustand/middleware/immer' ✅ already correct
 * - `createJSONStorage` is unchanged
 * - Computed functions (totalItems, totalPrice) use `get()` from the store
 *   — in v5, these still work but should be selectors outside the store for
 *   better performance. Kept here for clarity.
 */

export interface CartItem {
  id: string;
  name: string;
  price: number;    // stored in cents to avoid float precision issues
  imageUrl?: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem:        (item: Omit<CartItem, 'quantity'>) => void;
  removeItem:     (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart:      () => void;
  totalItems:     () => number;
  totalPrice:     () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    immer((set, get) => ({
      items: [],

      addItem(item) {
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            existing.quantity += 1;
          } else {
            state.items.push({ ...item, quantity: 1 });
          }
        });
      },

      removeItem(id) {
        set((state) => {
          state.items = state.items.filter((i) => i.id !== id);
        });
      },

      updateQuantity(id, quantity) {
        set((state) => {
          if (quantity <= 0) {
            state.items = state.items.filter((i) => i.id !== id);
            return;
          }
          const item = state.items.find((i) => i.id === id);
          if (item) item.quantity = quantity;
        });
      },

      clearCart() {
        set((state) => { state.items = []; });
      },

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    })),
    {
      name:    'cart-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
