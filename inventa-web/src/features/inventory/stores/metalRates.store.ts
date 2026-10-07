import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface MetalRates {
  gold24k: number;
  gold22k: number;
  gold21k: number;
  gold18k: number;
  gold14k: number;
  gold9k: number;
  silver925: number;
}

export interface MetalRatesStore {
  rates: MetalRates;
  updateRate: (key: keyof MetalRates, value: number) => void;
  getRateFor: (metalType: string, karat?: number) => number;
}

export const DEFAULT_RATES: MetalRates = {
  gold24k: 48000,
  gold22k: 44000,
  gold21k: 42000,
  gold18k: 38000,
  gold14k: 28000,
  gold9k: 18000,
  silver925: 1500,
};

export const useMetalRatesStore = create<MetalRatesStore>()(
  persist(
    (set, get) => ({
      rates: DEFAULT_RATES,

      updateRate: (key, value) => {
        set((state) => ({
          rates: {
            ...state.rates,
            [key]: Math.max(0, value),
          },
        }));
      },

      getRateFor: (metalType: string, karat = 18) => {
        const { rates } = get();
        if (metalType === 'argent') return rates.silver925;
        if (metalType === 'or') {
          switch (karat) {
            case 24:
              return rates.gold24k;
            case 22:
              return rates.gold22k;
            case 21:
              return rates.gold21k;
            case 18:
              return rates.gold18k;
            case 14:
              return rates.gold14k;
            case 9:
              return rates.gold9k;
            default:
              return rates.gold18k;
          }
        }
        return 0;
      },
    }),
    {
      name: 'inventa_metal_rates',
    }
  )
);
