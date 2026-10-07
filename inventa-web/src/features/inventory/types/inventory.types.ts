export type JewelleryCategory =
  | 'bague'
  | 'collier'
  | 'bracelet'
  | 'boucle_oreille'
  | 'pendentif'
  | 'chaine'
  | 'parure'
  | 'montre'
  | 'autre';

export type MetalType = 'or' | 'argent' | 'platine' | 'plaque_or' | 'diamant';

export interface JewelleryItem {
  id: string;
  name: string;
  sku: string;
  category: JewelleryCategory;
  metalType: MetalType;
  karat: number;
  weightGrams: number;
  priceSell: number;
  priceBuy?: number;
  stockQty: number;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateJewelleryDto {
  name: string;
  sku?: string;
  category: JewelleryCategory;
  metalType: MetalType;
  karat: number;
  weightGrams: number;
  priceSell: number;
  priceBuy?: number;
  stockQty: number;
  imageUrl?: string;
}
