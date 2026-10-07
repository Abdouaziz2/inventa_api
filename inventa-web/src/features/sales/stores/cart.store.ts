import { create } from 'zustand';
import type { JewelleryItem } from '@/features/inventory/types/inventory.types';
import type { CartItem, PaymentMethod } from '../types/sales.types';

export interface CartStore {
  items: CartItem[];
  paymentMethod: PaymentMethod;
  discount: number;
  customerName: string;
  customerPhone: string;
  amountReceived: number;
  addItem: (item: JewelleryItem, customUnitPrice?: number, ratePerGram?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateItemPrice: (itemId: string, newUnitPrice: number) => void;
  setDiscount: (discount: number) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setCustomer: (name: string, phone: string) => void;
  setAmountReceived: (amount: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTotal: () => number;
  getChange: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  paymentMethod: 'CASH',
  discount: 0,
  customerName: '',
  customerPhone: '',
  amountReceived: 0,

  addItem: (item: JewelleryItem, customUnitPrice?: number, ratePerGram?: number) => {
    set((state) => {
      const existing = state.items.find((i) => i.item.id === item.id);
      if (existing) {
        if (existing.quantity >= item.stockQty) {
          return state;
        }
        return {
          items: state.items.map((i) =>
            i.item.id === item.id
              ? {
                  ...i,
                  quantity: i.quantity + 1,
                  totalPrice: (i.quantity + 1) * i.unitPrice,
                }
              : i
          ),
        };
      }

      // Calcul du prix initial :
      // 1. Prix personnalisé passé
      // 2. Ou si l'article a un prix fixé
      // 3. Ou calculé selon poids * cours
      let price = customUnitPrice || item.priceSell;
      if (!price && ratePerGram && item.weightGrams > 0) {
        price = Math.round(item.weightGrams * ratePerGram);
      }
      price = price || 0;

      return {
        items: [
          ...state.items,
          {
            item,
            quantity: 1,
            ratePerGramUsed: ratePerGram,
            laborPrice: 0,
            unitPrice: price,
            totalPrice: price,
          },
        ],
      };
    });
  },

  removeItem: (itemId: string) => {
    set((state) => ({
      items: state.items.filter((i) => i.item.id !== itemId),
    }));
  },

  updateQuantity: (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }
    set((state) => ({
      items: state.items.map((i) =>
        i.item.id === itemId
          ? {
              ...i,
              quantity: Math.min(quantity, i.item.stockQty),
              totalPrice: Math.min(quantity, i.item.stockQty) * i.unitPrice,
            }
          : i
      ),
    }));
  },

  updateItemPrice: (itemId: string, newUnitPrice: number) => {
    const validPrice = Math.max(0, newUnitPrice);
    set((state) => ({
      items: state.items.map((i) =>
        i.item.id === itemId
          ? {
              ...i,
              unitPrice: validPrice,
              totalPrice: i.quantity * validPrice,
            }
          : i
      ),
    }));
  },

  setDiscount: (discount: number) => set({ discount: Math.max(0, discount) }),
  setPaymentMethod: (paymentMethod: PaymentMethod) => set({ paymentMethod }),
  setCustomer: (customerName: string, customerPhone: string) =>
    set({ customerName, customerPhone }),
  setAmountReceived: (amountReceived: number) => set({ amountReceived: Math.max(0, amountReceived) }),

  clearCart: () =>
    set({
      items: [],
      discount: 0,
      customerName: '',
      customerPhone: '',
      paymentMethod: 'CASH',
      amountReceived: 0,
    }),

  getSubtotal: () => {
    return get().items.reduce((acc, curr) => acc + curr.totalPrice, 0);
  },

  getTotal: () => {
    const subtotal = get().getSubtotal();
    return Math.max(0, subtotal - get().discount);
  },

  getChange: () => {
    const received = get().amountReceived;
    const total = get().getTotal();
    return Math.max(0, received - total);
  },
}));
