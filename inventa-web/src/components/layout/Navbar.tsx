import React, { useState } from 'react';
import { List, Search, Square } from 'react-bootstrap-icons';
import { useMetalRatesStore } from '@/features/inventory/stores/metalRates.store';
import { MetalRatesModal } from '@/features/inventory/components/MetalRatesModal';
import { formatCurrency } from '@/lib/formatters';

export interface NavbarProps {
  onAddItem?: () => void;
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu }) => {
  const gold18kRate = useMetalRatesStore((state) => state.rates.gold18k);
  const [isRatesModalOpen, setIsRatesModalOpen] = useState(false);

  return (
    <>
      <header className="bg-transparent px-4 sm:px-6 pt-5 pb-3 flex items-center justify-between gap-3 sticky top-0 z-20">
        <div className="flex items-center gap-3 flex-1 max-w-2xl">
          {onToggleMobileMenu && (
            <button
              type="button"
              onClick={onToggleMobileMenu}
              aria-label="Ouvrir le menu de navigation"
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-200 transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
            >
              <List className="w-5 h-5" />
            </button>
          )}

          {/* Barre de recherche avec style pill identique au screenshot */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher un bijou, un client"
              className="w-full bg-white border border-slate-200/90 rounded-2xl pl-9 pr-4 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500 shadow-2xs transition-all"
            />
          </div>

          {/* Badge Cours de l'Or 18k */}
          <button
            type="button"
            onClick={() => setIsRatesModalOpen(true)}
            aria-label="Modifier le cours de l'or"
            title="Cliquez pour ajuster les cours du gramme d'or"
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-slate-200/90 hover:border-amber-300 text-xs text-slate-700 shadow-2xs transition-all cursor-pointer whitespace-nowrap"
          >
            <Square className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-600">Or 18k</span>
            <span className="font-bold text-slate-900">
              {gold18kRate ? formatCurrency(gold18kRate) : '38 000'}
            </span>
            <span className="text-slate-500">FCFA/g</span>
          </button>
        </div>

        {/* Profil utilisateur : M. Maître Bijoutier / Admin */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Badge Or visible sur mobile si masqué plus tôt */}
          <button
            type="button"
            onClick={() => setIsRatesModalOpen(true)}
            className="sm:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-[11px] font-medium text-slate-700 shadow-2xs"
          >
            <span className="font-bold text-amber-700">18k</span>
            <span>{gold18kRate ? formatCurrency(gold18kRate) : '38 000'}</span>
          </button>

          <div className="flex items-center gap-2.5 bg-white sm:bg-transparent p-1.5 sm:p-0 rounded-2xl border sm:border-0 border-slate-200/80 shadow-2xs sm:shadow-none">
            <div className="w-9 h-9 rounded-full bg-[#deb887] text-amber-950 font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs">
              MB
            </div>
            <div className="text-left hidden sm:block">
              <span className="text-xs font-bold text-slate-900 block leading-tight">
                M. Maître Bijoutier
              </span>
              <span className="text-[11px] text-slate-400 block leading-tight mt-0.5">
                Admin
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Modal Cours de l'or */}
      <MetalRatesModal
        isOpen={isRatesModalOpen}
        onClose={() => setIsRatesModalOpen(false)}
      />
    </>
  );
};
