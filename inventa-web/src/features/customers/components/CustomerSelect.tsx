import React, { useState, useRef, useEffect } from 'react';
import type { Customer } from '../types/customer.types';
import { useCustomersQuery } from '../api/customers.api';
import { CustomerModal } from './CustomerModal';
import { Badge } from '@/components/ui/Badge';
import { Person, PlusLg, XLg, Search } from 'react-bootstrap-icons';

export interface CustomerSelectProps {
  selectedCustomerName: string;
  selectedCustomerPhone: string;
  onSelectCustomer: (name: string, phone: string) => void;
  onClearCustomer: () => void;
}

export const CustomerSelect: React.FC<CustomerSelectProps> = ({
  selectedCustomerName,
  selectedCustomerPhone,
  onSelectCustomer,
  onClearCustomer,
}) => {
  const { data: customers = [] } = useCustomersQuery();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Fermeture au clic extérieur et sur Escape
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const filtered = customers.filter(
    (c) =>
      c.fullName.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  const handleSelect = (customer: Customer) => {
    onSelectCustomer(customer.fullName, customer.phone);
    setIsOpen(false);
    setSearch('');
  };

  const handleCustomerCreated = (newCustomer: Customer) => {
    onSelectCustomer(newCustomer.fullName, newCustomer.phone);
    setIsModalOpen(false);
  };

  return (
    <div ref={containerRef} className="relative text-left w-full">
      {selectedCustomerName ? (
        // Client sélectionné
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/90 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-amber-200 text-amber-900 font-bold text-[10px] flex items-center justify-center shrink-0">
              {selectedCustomerName.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <span className="font-bold text-slate-900 block truncate leading-tight">
                {selectedCustomerName}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {selectedCustomerPhone || 'Sans téléphone'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClearCustomer}
            title="Changer de client"
            aria-label="Dissocier ce client de la vente en cours"
            className="p-1 rounded-md text-slate-400 hover:text-rose-600 transition-colors cursor-pointer min-w-[28px] min-h-[28px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <XLg className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        // Bouton pour ouvrir la sélection ou créer
        <div>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-label="Associer un client à la vente en cours"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-600 hover:border-amber-400 hover:bg-slate-50/50 transition-all cursor-pointer shadow-2xs min-h-[38px] focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <div className="flex items-center gap-2">
              <Person className="w-4 h-4 text-slate-400" />
              <span>Associer un client (optionnel)</span>
            </div>
            <span className="text-xs font-bold text-amber-700">Choisir</span>
          </button>

          {/* Menu déroulant de recherche */}
          {isOpen && (
            <div
              role="dialog"
              aria-label="Sélectionner ou créer un client"
              className="absolute left-0 right-0 mt-1.5 bg-white rounded-2xl border border-slate-200 shadow-xl p-3 z-40 space-y-2"
            >
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Rechercher par nom ou numéro..."
                  aria-label="Rechercher un client existant"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Fermer la liste des clients"
                  className="text-slate-400 hover:text-slate-600 p-1 min-w-[28px] min-h-[28px] flex items-center justify-center"
                >
                  <XLg className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Bouton créer client rapide */}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setIsModalOpen(true);
                }}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-amber-50 text-amber-900 text-xs font-bold hover:bg-amber-100 transition-colors cursor-pointer min-h-[36px]"
              >
                <PlusLg className="w-3.5 h-3.5 text-amber-600" />
                <span>Nouveau client rapide</span>
              </button>

              {/* Liste des résultats */}
              <div
                role="listbox"
                aria-label="Clients trouvés"
                className="max-h-48 overflow-y-auto space-y-1"
              >
                {filtered.length === 0 ? (
                  <p className="text-xs text-slate-400 py-3 text-center">
                    Aucun client trouvé.
                  </p>
                ) : (
                  filtered.map((c) => (
                    <div
                      key={c.id}
                      role="option"
                      tabIndex={0}
                      aria-selected={false}
                      onClick={() => handleSelect(c)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleSelect(c);
                        }
                      }}
                      className="p-2 rounded-lg hover:bg-slate-50 cursor-pointer flex items-center justify-between text-xs transition-colors focus:bg-amber-50 focus:outline-none"
                    >
                      <div>
                        <span className="font-bold text-slate-900 block">{c.fullName}</span>
                        <span className="text-xs text-slate-500 font-mono">{c.phone}</span>
                      </div>
                      {c.category === 'vip' && (
                        <Badge variant="gold" className="text-[10px] px-1.5 py-0">VIP</Badge>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal de création rapide */}
      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCustomerCreated={handleCustomerCreated}
      />
    </div>
  );
};
