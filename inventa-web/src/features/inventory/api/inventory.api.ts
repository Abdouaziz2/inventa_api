import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/types/api';
import type { JewelleryItem, CreateJewelleryDto } from '../types/inventory.types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const INVENTORY_QUERY_KEY = ['inventory'];

export const inventoryApi = {
  getAll: async (): Promise<JewelleryItem[]> => {
    const res = await apiClient.get<ApiResponse<JewelleryItem[]>>('/inventory');
    return res.data.data || [];
  },

  create: async (dto: CreateJewelleryDto): Promise<JewelleryItem> => {
    const res = await apiClient.post<ApiResponse<JewelleryItem>>('/inventory', dto);
    return res.data.data;
  },
};

export function useInventoryQuery() {
  return useQuery({
    queryKey: INVENTORY_QUERY_KEY,
    queryFn: inventoryApi.getAll,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useCreateInventoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: inventoryApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_QUERY_KEY });
    },
  });
}
