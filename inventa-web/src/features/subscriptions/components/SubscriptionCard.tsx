import React from 'react';
import { useWaveUrlQuery } from '../api/subscription.api';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/formatters';
import { Phone, CheckCircleFill, ShieldCheck } from 'react-bootstrap-icons';

export const SubscriptionCard: React.FC = () => {
  const { data: waveData, isLoading } = useWaveUrlQuery(11500);

  const handleOpenWave = () => {
    if (waveData?.paymentUrl) {
      window.open(waveData.paymentUrl, '_blank');
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs text-left max-w-2xl">
      <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <Badge variant="gold" className="text-xs mb-2">
            Formule Pro
          </Badge>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 m-0">
            Inventa Bijouterie
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Gestion intégrale du point de vente et du stock
          </p>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            {formatCurrency(11500)}
          </div>
          <span className="text-xs text-slate-400 font-medium">/ mois</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-5 text-xs text-slate-700">
        <div className="flex items-center gap-2">
          <CheckCircleFill className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>Stock or & argent illimité</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircleFill className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>Étiquettes & codes-barres</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircleFill className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>Caisse & douchette USB</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircleFill className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>Rappels clients WhatsApp</span>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Paiement sécurisé Wave Sénégal</span>
        </div>

        <Button
          variant="primary"
          size="md"
          isLoading={isLoading}
          leftIcon={<Phone className="w-4 h-4" />}
          onClick={handleOpenWave}
          className="font-medium bg-sky-600 hover:bg-sky-700 text-white border-transparent"
        >
          Régler {formatCurrency(11500)} avec Wave
        </Button>
      </div>
    </div>
  );
};
