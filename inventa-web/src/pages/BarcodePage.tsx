import React, { useState } from 'react';
import { useInventoryQuery } from '@/features/inventory/api/inventory.api';
import { JewelleryTag } from '@/features/barcode/components/JewelleryTag';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { UpcScan, Printer, Sliders, CheckSquare, Square, Search } from 'react-bootstrap-icons';
import type { JewelleryItem } from '@/features/inventory/types/inventory.types';

export const BarcodePage: React.FC = () => {
  const { data: inventory = [], isLoading } = useInventoryQuery();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [copies, setCopies] = useState<number>(1);
  const [showPrice, setShowPrice] = useState(true);
  const [showWeight, setShowWeight] = useState(true);
  const [showKarat, setShowKarat] = useState(true);

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.sku && item.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredInventory.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredInventory.map((i) => i.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectedItems = inventory.filter((item) => selectedIds.includes(item.id));

  // Préparation de la liste d'impression avec les copies
  const printItems: JewelleryItem[] = [];
  selectedItems.forEach((item) => {
    for (let i = 0; i < copies; i++) {
      printItems.push(item);
    }
  });

  return (
    <div className="space-y-5 text-left">
      <div className="no-print">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 m-0">
          Étiquettes
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Impression des codes-barres pour bijoux
        </p>
      </div>

      {/* Barre de configuration & Impression */}
      <div className="no-print bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-700">
            <Sliders className="w-4 h-4 text-amber-600" />
            <span>Options :</span>
          </div>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showPrice}
              onChange={(e) => setShowPrice(e.target.checked)}
              className="rounded text-amber-600 focus:ring-amber-500"
            />
            <span>Prix avec espaces</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showWeight}
              onChange={(e) => setShowWeight(e.target.checked)}
              className="rounded text-amber-600 focus:ring-amber-500"
            />
            <span>Poids (g)</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showKarat}
              onChange={(e) => setShowKarat(e.target.checked)}
              className="rounded text-amber-600 focus:ring-amber-500"
            />
            <span>Titre / Carats</span>
          </label>

          <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
            <span className="text-slate-500">Exemplaires :</span>
            <input
              type="number"
              min="1"
              max="20"
              value={copies}
              onChange={(e) => setCopies(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-14 rounded-lg border border-slate-200 bg-white px-2 py-1 text-center font-semibold"
            />
          </div>
        </div>

        <Button
          variant="gold"
          size="md"
          disabled={selectedItems.length === 0}
          leftIcon={<Printer className="w-4 h-4" />}
          onClick={() => window.print()}
        >
          Imprimer {printItems.length} étiquette(s)
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Colonne gauche : Sélection des articles (5 cols) */}
        <div className="no-print lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Choisir les bijoux ({selectedIds.length} sélectionné(s))
            </h3>
            <button
              onClick={toggleSelectAll}
              aria-label={selectedIds.length === filteredInventory.length && filteredInventory.length > 0 ? "Tout désélectionner" : "Tout sélectionner"}
              className="text-xs text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1 cursor-pointer"
            >
              {selectedIds.length === filteredInventory.length && filteredInventory.length > 0 ? (
                <>
                  <CheckSquare className="w-3.5 h-3.5" /> Tout désélectionner
                </>
              ) : (
                <>
                  <Square className="w-3.5 h-3.5" /> Tout sélectionner
                </>
              )}
            </button>
          </div>

          <Input
            placeholder="Filtrer les bijoux..."
            aria-label="Filtrer les bijoux pour étiquetage"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          />

          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {isLoading ? (
              <p className="text-xs text-slate-400 py-6 text-center">Chargement...</p>
            ) : filteredInventory.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">Aucun bijou trouvé.</p>
            ) : (
              filteredInventory.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                    onClick={() => toggleSelectOne(item.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleSelectOne(item.id);
                      }
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/50 shadow-2xs'
                        : 'border-slate-100 hover:border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="text-amber-600">
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-900 block truncate">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {item.sku || 'SANS SKU'}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded-sm">
                      {item.metalType === 'or' ? `${item.karat}k` : item.metalType}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Colonne droite : Planche d'aperçu d'impression (7 cols) */}
        <div className="printable-area lg:col-span-7 bg-slate-50 rounded-xl border border-slate-200 p-4 sm:p-5">
          <div className="no-print flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <UpcScan className="w-4 h-4 text-slate-700" />
              <h2 className="text-xs font-semibold text-slate-700 m-0">
                Aperçu de la planche
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              Format 62x34 mm
            </span>
          </div>

          {selectedItems.length === 0 ? (
            <div className="no-print py-16 text-center text-slate-400">
              <UpcScan className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-500" />
              <p className="text-xs text-slate-500">
                Sélectionnez un bijou pour prévisualiser l'étiquette.
              </p>
            </div>
          ) : (
            <div className="printable-tag-grid grid grid-cols-1 sm:grid-cols-2 gap-3 justify-items-center max-h-[500px] overflow-y-auto p-2 bg-slate-50 rounded-xl">
              {printItems.map((item, idx) => (
                <JewelleryTag
                  key={`${item.id}-${idx}`}
                  item={item}
                  showPrice={showPrice}
                  showWeight={showWeight}
                  showKarat={showKarat}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
