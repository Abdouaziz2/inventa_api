import React from 'react';
import { Archive, ExclamationCircle } from 'react-bootstrap-icons';

export const DepotPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 text-center">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-10 shadow-xs max-w-lg mx-auto space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-100/80 text-amber-700 flex items-center justify-center mx-auto shadow-inner">
          <Archive className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-slate-900">Module Dépôt</h1>
          <p className="text-xs text-slate-500">
            Dépôts-ventes et consignations de bijoux
          </p>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs flex items-center gap-2 text-left">
          <ExclamationCircle className="w-4 h-4 text-amber-500 shrink-0" />
          <span>
            Ce module est déclaré dans le menu de navigation conformément à vos spécifications. Son implémentation métier n'est pas encore activée.
          </span>
        </div>
      </div>
    </div>
  );
};
