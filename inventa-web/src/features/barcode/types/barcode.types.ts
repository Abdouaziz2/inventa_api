import type { JewelleryItem } from '@/features/inventory/types/inventory.types';

export interface LabelPrintConfig {
  showPrice: boolean;
  showKarat: boolean;
  showWeight: boolean;
  tagSize: 'standard' | 'mini' | 'dumbbell'; // dumbbell = étiquette haltère spéciale bague
  copies: number;
}

export interface BarcodeScanResult {
  code: string;
  matchedItem?: JewelleryItem;
  scannedAt: Date;
}
