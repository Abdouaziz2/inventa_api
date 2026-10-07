import React, { useState } from 'react';
import type { JewelleryItem } from '../types/inventory.types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatCurrency, formatWeight } from '@/lib/formatters';
import { useMetalRatesStore } from '../stores/metalRates.store';
import { UpcScan, Search, PlusLg, Printer, Cart3, Diamond } from 'react-bootstrap-icons';
import { BarcodePrintModal } from '@/features/barcode/components/BarcodePrintModal';

export interface InventoryTableProps {
  items: JewelleryItem[];
  isLoading: boolean;
  onAddItem: () => void;
  onAddToCart?: (item: JewelleryItem) => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  items,
  isLoading,
  onAddItem,
  onAddToCart,
}) => {
  const { getRateFor } = useMetalRatesStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItemsForPrint, setSelectedItemsForPrint] = useState<JewelleryItem[]>([]);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.sku && item.sku.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePrintSingle = (item: JewelleryItem) => {
    setSelectedItemsForPrint([item]);
    setIsPrintModalOpen(true);
  };

  const handlePrintAllFiltered = () => {
    if (filteredItems.length === 0) return;
    setSelectedItemsForPrint(filteredItems);
    setIsPrintModalOpen(true);
  };

  const getStockBadge = (qty: number) => {
    if (qty <= 0) return <Badge variant="destructive">Épuisé</Badge>;
    if (qty <= 2) return <Badge variant="warning">Faible ({qty})</Badge>;
    return <Badge variant="success">En stock ({qty})</Badge>;
  };

  return (
    <div className="space-y-4 text-left">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-1 items-center gap-2.5 w-full sm:w-auto">
          <div className="w-full sm:w-72">
            <Input
              placeholder="Rechercher par nom ou SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-3.5 h-3.5 text-slate-400" />}
              className="text-xs"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            aria-label="Filtrer les bijoux par catégorie"
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 focus:border-amber-500 focus:outline-none"
          >
            <option value="all">Toutes catégories</option>
            <option value="bague">Bagues</option>
            <option value="collier">Colliers</option>
            <option value="bracelet">Bracelets</option>
            <option value="boucle_oreille">Boucles d’oreilles</option>
            <option value="pendentif">Pendentifs</option>
            <option value="chaine">Chaînes</option>
            <option value="parure">Parures</option>
            <option value="montre">Montres</option>
            <option value="autre">Autres</option>
          </select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {filteredItems.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Printer className="w-3.5 h-3.5 text-slate-600" />}
              onClick={handlePrintAllFiltered}
            >
              Étiquettes ({filteredItems.length})
            </Button>
          )}

          <Button
            variant="gold"
            size="sm"
            leftIcon={<PlusLg className="w-3.5 h-3.5" />}
            onClick={onAddItem}
          >
            Nouveau bijou
          </Button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-100 text-xs font-semibold uppercase text-slate-500 tracking-wider">
              <tr>
                <th scope="col" className="py-3.5 px-4">Désignation</th>
                <th scope="col" className="py-3.5 px-4">Code SKU / Barres</th>
                <th scope="col" className="py-3.5 px-4">Métal & Titre</th>
                <th scope="col" className="py-3.5 px-4">Poids net</th>
                <th scope="col" className="py-3.5 px-4">Valeur indicative (cours)</th>
                <th scope="col" className="py-3.5 px-4">Disponibilité</th>
                <th scope="col" className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center text-slate-400">
                    <div className="inline-flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                      <span>Chargement du stock de bijoux...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="max-w-xs mx-auto text-center space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                        <Diamond className="w-5 h-5" />
                      </div>
                      <p className="text-sm font-semibold text-slate-800 m-0">
                        {searchTerm ? 'Aucun résultat' : 'Aucun article en stock'}
                      </p>
                      <p className="text-xs text-slate-400 m-0">
                        {searchTerm
                          ? 'Modifiez votre recherche.'
                          : 'Ajoutez un premier article à votre inventaire.'}
                      </p>
                      {!searchTerm && (
                        <Button variant="gold" size="sm" onClick={onAddItem}>
                          Ajouter un article
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const rate = getRateFor(item.metalType, item.karat);
                  const estimatedValue = item.priceSell > 0
                    ? item.priceSell
                    : Math.round(item.weightGrams * rate);

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Nom & Catégorie */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{item.name}</div>
                        <div className="text-xs text-slate-400 capitalize">{item.category}</div>
                      </td>

                      {/* SKU & Code-barres */}
                      <td className="py-3 px-4 font-mono text-xs">
                        <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
                          <UpcScan className="w-3 h-3 text-slate-400" />
                          {item.sku || 'SANS SKU'}
                        </span>
                      </td>

                      {/* Métal & Titre */}
                      <td className="py-3 px-4">
                        <Badge variant="gold">
                          {item.metalType === 'or' ? `Or ${item.karat}k` : item.metalType}
                        </Badge>
                      </td>

                      {/* Poids net */}
                      <td className="py-3 px-4 font-extrabold text-slate-900">
                        {formatWeight(item.weightGrams)}
                      </td>

                      {/* Valeur indicative */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-amber-700">
                          {formatCurrency(estimatedValue)}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {item.priceSell > 0 ? 'Prix fixe' : 'Au cours'}
                        </div>
                      </td>

                      {/* Disponibilité */}
                      <td className="py-3 px-4">{getStockBadge(item.stockQty)}</td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handlePrintSingle(item)}
                            title={`Imprimer l'étiquette de ${item.name}`}
                            aria-label={`Imprimer l'étiquette code-barres de ${item.name}`}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-amber-600 hover:border-amber-300 transition-colors cursor-pointer bg-white flex items-center justify-center focus:outline-none"
                          >
                            <UpcScan className="w-3.5 h-3.5" />
                          </button>

                          {onAddToCart && item.stockQty > 0 && (
                            <button
                              type="button"
                              onClick={() => onAddToCart(item)}
                              title={`Ajouter ${item.name} au comptoir`}
                              aria-label={`Ajouter ${item.name} au comptoir de vente`}
                              className="p-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center focus:outline-none"
                            >
                              <Cart3 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal d'impression */}
      <BarcodePrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        items={selectedItemsForPrint}
      />
    </div>
  );
};
