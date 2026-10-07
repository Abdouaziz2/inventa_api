import type { JewelleryItem } from '@/features/inventory/types/inventory.types';

export type PaymentMethod = 'CASH' | 'WAVE' | 'ORANGE_MONEY' | 'BANK_TRANSFER' | 'OTHER';

export interface CartItem {
  item: JewelleryItem;
  quantity: number;
  ratePerGramUsed?: number;
  laborPrice?: number;
  unitPrice: number;
  totalPrice: number;
}

export interface SaleReceipt {
  receiptNumber: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  totalAmount: number;
  amountReceived?: number;
  changeGiven?: number;
  paymentMethod: PaymentMethod;
  customerName?: string;
  customerPhone?: string;
  createdAt: string;
}
