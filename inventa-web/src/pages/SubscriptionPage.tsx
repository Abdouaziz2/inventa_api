import React from 'react';
import { SubscriptionCard } from '@/features/subscriptions/components/SubscriptionCard';

export const SubscriptionPage: React.FC = () => {
  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 m-0">Abonnement</h1>
        <p className="text-xs text-slate-500 mt-0.5">Licence active et règlement Wave</p>
      </div>

      <SubscriptionCard />
    </div>
  );
};
