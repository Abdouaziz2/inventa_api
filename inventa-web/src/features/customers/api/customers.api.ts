import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/types/api';
import type { Customer, CreateCustomerDto, UpdateCustomerDto } from '../types/customer.types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const CUSTOMERS_QUERY_KEY = ['customers'];

export const customersApi = {
  getAll: async (): Promise<Customer[]> => {
    const res = await apiClient.get<ApiResponse<Customer[]>>('/customers');
    return res.data.data || [];
  },

  getOne: async (id: string): Promise<Customer> => {
    const res = await apiClient.get<ApiResponse<Customer>>(`/customers/${id}`);
    return res.data.data;
  },

  create: async (dto: CreateCustomerDto): Promise<Customer> => {
    const res = await apiClient.post<ApiResponse<Customer>>('/customers', dto);
    return res.data.data;
  },

  update: async ({ id, dto }: { id: string; dto: UpdateCustomerDto }): Promise<Customer> => {
    const res = await apiClient.patch<ApiResponse<Customer>>(`/customers/${id}`, dto);
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/customers/${id}`);
  },
};

export function useCustomersQuery() {
  return useQuery({
    queryKey: CUSTOMERS_QUERY_KEY,
    queryFn: customersApi.getAll,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useCreateCustomerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: customersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
    },
  });
}

export function useDeleteCustomerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: customersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
    },
  });
}
