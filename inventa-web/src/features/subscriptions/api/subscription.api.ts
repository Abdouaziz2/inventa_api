import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/types/api';
import type { WaveUrlResponse } from '../types/subscription.types';
import { useQuery } from '@tanstack/react-query';

export const subscriptionApi = {
  getWaveUrl: async (amount = 11500): Promise<WaveUrlResponse> => {
    const res = await apiClient.get<ApiResponse<WaveUrlResponse>>('/subscriptions/wave-url', {
      params: { amount },
    });
    return res.data.data;
  },

  sendReminder: async (payload: { userId: string; channel: 'email' | 'whatsapp'; targetPhone?: string; targetEmail?: string; amount?: number }) => {
    const res = await apiClient.post<ApiResponse<any>>('/subscriptions/reminder', payload);
    return res.data.data;
  },
};

export function useWaveUrlQuery(amount = 11500) {
  return useQuery({
    queryKey: ['wave-url', amount],
    queryFn: () => subscriptionApi.getWaveUrl(amount),
    staleTime: 1000 * 60 * 10,
  });
}
