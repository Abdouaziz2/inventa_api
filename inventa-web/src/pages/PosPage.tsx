import React from 'react';
import { useInventoryQuery } from '@/features/inventory/api/inventory.api';
import { PosCashier } from '@/features/sales/components/PosCashier';

export const PosPage: React.FC = () => {
  const { data: inventory = [] } = useInventoryQuery();

  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 m-0">
          Caisse Enregistreuse & Vente Comptoir
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Scannez les codes-barres des bijoux, appliquez les remises et encaissez en Espèces, Wave ou Orange Money.
        </p>
      </div>

      <PosCashier inventory={inventory} />
    </div>
  );
};
