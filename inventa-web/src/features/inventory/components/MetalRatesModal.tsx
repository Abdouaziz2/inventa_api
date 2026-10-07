import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useMetalRatesStore, DEFAULT_RATES, type MetalRates } from '../stores/metalRates.store';
import { toast } from 'sonner';
import { Coin, ArrowCounterclockwise } from 'react-bootstrap-icons';

export interface MetalRatesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MetalRatesModal: React.FC<MetalRatesModalProps> = ({ isOpen, onClose }) => {
  const { rates, updateRate } = useMetalRatesStore();

  const handleResetDefaults = () => {
    Object.entries(DEFAULT_RATES).forEach(([key, value]) => {
      updateRate(key as keyof MetalRates, value);
    });
    toast.info('Cours réinitialisés aux valeurs standards de référence.');
  };

  const rateConfig: { key: keyof MetalRates; label: string; description: string }[] = [
    { key: 'gold24k', label: 'Or 24 Carats (Or Pur / 999‰)', description: 'Lingots et bijoux 24k' },
    { key: 'gold22k', label: 'Or 22 Carats (916‰)', description: 'Bijoux traditionnels orientaux' },
    { key: 'gold21k', label: 'Or 21 Carats (875‰)', description: 'Bijoux arabes / dakarois' },
    { key: 'gold18k', label: 'Or 18 Carats (750‰)', description: 'Standard joaillerie le plus vendu' },
    { key: 'gold14k', label: 'Or 14 Carats (585‰)', description: 'Or 14 carats' },
    { key: 'silver925', label: 'Argent 925‰ (Massif)', description: 'Bijoux argent massif' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cours du Jour (Or & Argent)"
      description="Définissez les cours de référence pour l'estimation des bijoux"
      maxWidth="lg"
    >
      <div className="space-y-4">
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 flex items-start gap-2.5">
          <Coin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-900 leading-normal">
            Calcul automatique du prix : <span className="font-semibold">(Poids × Cours/g) + Façon</span>
          </p>
        </div>

        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
          {rateConfig.map(({ key, label, description }) => (
            <div
              key={key}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 gap-3"
            >
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold text-slate-900 block truncate">{label}</span>
                <span className="text-[10px] text-slate-500">{description}</span>
              </div>

              <div className="w-36">
                <Input
                  type="number"
                  step="500"
                  min="0"
                  value={rates[key]}
                  onChange={(e) => updateRate(key, parseFloat(e.target.value) || 0)}
                  rightIcon={<span className="text-[10px] font-bold text-slate-400">F/g</span>}
                  className="text-right font-bold text-xs"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            leftIcon={<ArrowCounterclockwise className="w-3.5 h-3.5" />}
            onClick={handleResetDefaults}
            className="text-xs text-slate-500"
          >
            Valeurs par défaut
          </Button>

          <Button
            type="button"
            variant="gold"
            size="sm"
            onClick={() => {
              toast.success('Cours de l’or mis à jour avec succès !');
              onClose();
            }}
          >
            Appliquer les cours
          </Button>
        </div>
      </div>
    </Modal>
  );
};
