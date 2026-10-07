export type SubscriptionStatus = 'TRIAL' | 'ACTIVE' | 'PAST_DUE' | 'EXPIRED' | 'CANCELLED';

export interface SubscriptionInfo {
  id: string;
  userId: string;
  planCode: string;
  status: SubscriptionStatus;
  amount: number;
  trialEndsAt?: string;
  expiresAt?: string;
  lastPaidAt?: string;
}

export interface WaveUrlResponse {
  paymentUrl: string;
  amount: number;
  currency: string;
  merchantName: string;
}
