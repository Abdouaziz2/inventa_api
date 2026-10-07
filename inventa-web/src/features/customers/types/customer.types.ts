export type CustomerCategory = 'particulier' | 'vip' | 'revendeur';

export interface Customer {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  city?: string;
  category: CustomerCategory;
  notes?: string;
  totalSpent: number;
  purchasesCount: number;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    sales: number;
  };
}

export interface CreateCustomerDto {
  fullName: string;
  phone: string;
  email?: string;
  city?: string;
  category?: CustomerCategory;
  notes?: string;
}

export interface UpdateCustomerDto extends Partial<CreateCustomerDto> {}
