import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { JewelleryCategory, MetalType } from '../types/inventory.types';
import { useCreateInventoryMutation } from '../api/inventory.api';
import { formatWeight } from '@/lib/formatters';
import { toast } from 'sonner';
import { Stars, UpcScan, CheckCircleFill, Stack, PlusLg, Trash3, InfoCircle } from 'react-bootstrap-icons';

export interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PieceBatchItem {
  weightGrams: number;
  sku: string;
}

export const ItemModal: React.FC<ItemModalProps> = ({ isOpen, onClose }) => {
  const createMutation = useCreateInventoryMutation();

  // Mode de saisie : Pièce Unique vs Lot de pièces (poids différents)
  const [entryMode, setEntryMode] = useState<'single' | 'batch'>('single');

  // Attributs du bijou
  const [name, setName] = useState('');
  const [category, setCategory] = useState<JewelleryCategory>('bague');
  const [metalType, setMetalType] = useState<MetalType>('or');
  const [karat, setKarat] = useState<number>(18);

  // Pièce unique
  const [singleWeight, setSingleWeight] = useState<number>(0);
  const [singleSku, setSingleSku] = useState<string>('');

  // Lot multi-pièces (même modèle, mais poids individuels)
  const [batchPieces, setBatchPieces] = useState<PieceBatchItem[]>([
    { weightGrams: 0, sku: '' },
  ]);

  const categories: { label: string; value: JewelleryCategory }[] = [
    { label: 'Bague', value: 'bague' },
    { label: 'Collier', value: 'collier' },
    { label: 'Bracelet', value: 'bracelet' },
    { label: 'Boucles d’oreilles', value: 'boucle_oreille' },
    { label: 'Pendentif', value: 'pendentif' },
    { label: 'Chaîne', value: 'chaine' },
    { label: 'Parure complète', value: 'parure' },
    { label: 'Montre', value: 'montre' },
    { label: 'Autre bijou', value: 'autre' },
  ];

  const metals: { label: string; value: MetalType }[] = [
    { label: 'Or Jaune / Blanc / Rose', value: 'or' },
    { label: 'Argent 925', value: 'argent' },
    { label: 'Platine', value: 'platine' },
    { label: 'Plaqué Or', value: 'plaque_or' },
  ];

  const karats = [18, 21, 22, 24, 14, 9];

  const generateSkuCode = (suffixIndex?: number) => {
    const prefix = category.slice(0, 3).toUpperCase();
    const karatStr = metalType === 'or' ? `${karat}K` : 'ARG';
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${karatStr}-${random}${suffixIndex !== undefined ? `-${suffixIndex + 1}` : ''}`;
  };

  const handleAddBatchPiece = () => {
    setBatchPieces((prev) => [
      ...prev,
      {
        weightGrams: 0,
        sku: generateSkuCode(prev.length),
      },
    ]);
  };

  const handleRemoveBatchPiece = (index: number) => {
    if (batchPieces.length <= 1) return;
    setBatchPieces((prev) => prev.filter((_, i) => i !== index));
  };

  const handleBatchWeightChange = (index: number, weight: number) => {
    setBatchPieces((prev) =>
      prev.map((p, i) => (i === index ? { ...p, weightGrams: weight } : p))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Veuillez renseigner la désignation du bijou');
      return;
    }

    try {
      if (entryMode === 'single') {
        if (singleWeight <= 0) {
          toast.error('Veuillez renseigner le poids en grammes du bijou');
          return;
        }

        const sku = singleSku.trim() || generateSkuCode();

        await createMutation.mutateAsync({
          name: name.trim(),
          sku,
          category,
          metalType,
          karat: metalType === 'or' ? karat : 0,
          weightGrams: Number(singleWeight),
          priceSell: 0, // Fixé lors de la vente au comptoir
          stockQty: 1,
        });

        toast.success(`Le bijou "${name}" (${formatWeight(singleWeight)}) a été ajouté au stock !`);
      } else {
        // Enregistrement par lot : chaque pièce avec son poids propre
        const validPieces = batchPieces.filter((p) => p.weightGrams > 0);
        if (validPieces.length === 0) {
          toast.error('Veuillez renseigner le poids d’au moins une pièce');
          return;
        }

        for (let i = 0; i < validPieces.length; i++) {
          const piece = validPieces[i];
          const sku = piece.sku.trim() || generateSkuCode(i);

          await createMutation.mutateAsync({
            name: `${name.trim()} #${i + 1}`,
            sku,
            category,
            metalType,
            karat: metalType === 'or' ? karat : 0,
            weightGrams: Number(piece.weightGrams),
            priceSell: 0, // Fixé lors de la vente
            stockQty: 1,
          });
        }

        toast.success(`${validPieces.length} pièces enregistrées avec leurs poids et étiquettes respectifs !`);
      }

      onClose();
      // Reset
      setName('');
      setSingleWeight(0);
      setSingleSku('');
      setBatchPieces([{ weightGrams: 0, sku: '' }]);
    } catch (err: any) {
      toast.error(err.message || 'Impossible d’enregistrer le bijou');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nouveau Bijou en Stock"
      description="Référencez vos pièces avec leur poids exact et générez leurs étiquettes codes-barres"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-left">
        {/* Toggle Pièce unique vs Lot */}
        <div role="tablist" aria-label="Mode d'enregistrement du bijou" className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl max-w-sm">
          <button
            type="button"
            role="tab"
            aria-selected={entryMode === 'single'}
            onClick={() => setEntryMode('single')}
            className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              entryMode === 'single'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Pièce Unique
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={entryMode === 'batch'}
            onClick={() => setEntryMode('batch')}
            className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              entryMode === 'batch'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Stack className="w-3.5 h-3.5 text-amber-600" />
            <span>Lot (Poids variables)</span>
          </button>
        </div>

        {/* Désignation du bijou */}
        <Input
          label="Désignation du bijou *"
          placeholder="ex: Bague Solitaire Or avec zircon"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* Catégorie & Métal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5 text-left">
            <label htmlFor="item-category-select" className="block text-xs font-semibold text-slate-700">Catégorie</label>
            <select
              id="item-category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value as JewelleryCategory)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-xs focus:border-amber-500 focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5 text-left">
            <label htmlFor="item-metal-select" className="block text-xs font-semibold text-slate-700">Métal précieux</label>
            <select
              id="item-metal-select"
              value={metalType}
              onChange={(e) => setMetalType(e.target.value as MetalType)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-xs focus:border-amber-500 focus:outline-none"
            >
              {metals.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Carats (si Or) */}
        {metalType === 'or' && (
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-semibold text-slate-700">Titre de l'or (Carats)</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {karats.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setKarat(k)}
                  className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    karat === k
                      ? 'border-amber-500 bg-amber-50 text-amber-900 ring-2 ring-amber-500/20 shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {k}k {k === 18 ? '★' : ''}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PIÈCE UNIQUE : Saisie du poids & code-barres */}
        {entryMode === 'single' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <Input
              label="Poids net de la pièce (en grammes) *"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="ex: 4.35"
              value={singleWeight || ''}
              onChange={(e) => setSingleWeight(parseFloat(e.target.value) || 0)}
              rightIcon={<span className="text-xs font-bold text-slate-400">g</span>}
              required
            />

            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Input
                  label="Code-barres / SKU"
                  placeholder="ex: BAG-18K-1001"
                  value={singleSku}
                  onChange={(e) => setSingleSku(e.target.value)}
                  leftIcon={<UpcScan className="w-3.5 h-3.5 text-slate-400" />}
                  helperText="Laissez vide pour générer automatiquement"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="md"
                leftIcon={<Stars className="w-3.5 h-3.5 text-amber-500" />}
                onClick={() => setSingleSku(generateSkuCode())}
              >
                Générer
              </Button>
            </div>
          </div>
        )}

        {/* LOT MULTI-PIÈCES : Liste des poids */}
        {entryMode === 'batch' && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-800">
                  Pesée des pièces ({batchPieces.length})
                </h4>
                <p className="text-[11px] text-slate-500">
                  Indiquez le poids de chaque pièce pesée sur votre balance.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                leftIcon={<PlusLg className="w-3.5 h-3.5 text-amber-600" />}
                onClick={handleAddBatchPiece}
              >
                Ajouter une pièce
              </Button>
            </div>

            <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
              {batchPieces.map((piece, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                >
                  <span className="text-xs font-bold text-slate-400 w-8">
                    #{index + 1}
                  </span>

                  <div className="w-40">
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="Poids (g)"
                      aria-label={`Poids en grammes de la pièce #${index + 1}`}
                      value={piece.weightGrams || ''}
                      onChange={(e) =>
                        handleBatchWeightChange(index, parseFloat(e.target.value) || 0)
                      }
                      rightIcon={<span className="text-xs font-bold text-slate-400">g</span>}
                    />
                  </div>

                  <div className="flex-1">
                    <Input
                      placeholder="SKU"
                      aria-label={`Code SKU de la pièce #${index + 1}`}
                      value={piece.sku || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setBatchPieces((prev) =>
                          prev.map((p, i) => (i === index ? { ...p, sku: val } : p))
                        );
                      }}
                      className="font-mono text-xs"
                    />
                  </div>

                  {batchPieces.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveBatchPiece(index)}
                      aria-label={`Supprimer la pièce #${index + 1} du lot`}
                      className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-rose-500 rounded-lg"
                    >
                      <Trash3 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-2.5 flex justify-between items-center text-xs text-amber-950 font-medium">
              <span>Nombre de pièces : <strong>{batchPieces.length}</strong></span>
              <span>
                Poids total en stock :{' '}
                <strong className="text-amber-900 font-bold">
                  {formatWeight(
                    batchPieces.reduce((acc, curr) => acc + (curr.weightGrams || 0), 0)
                  )}
                </strong>
              </span>
            </div>
          </div>
        )}

        {/* Note métier UX claire et sobre */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 flex items-start gap-2.5 text-xs text-slate-600">
          <InfoCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p>
            <strong className="font-semibold text-slate-800">Tarification à la vente :</strong>{' '}
            Le prix de chaque bijou n'est pas figé en stock. Il sera calculé ou convenu directement à la caisse selon le cours du jour et la façon.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button
            type="submit"
            variant="gold"
            isLoading={createMutation.isPending}
            leftIcon={<CheckCircleFill className="w-4 h-4" />}
          >
            {entryMode === 'single'
              ? 'Enregistrer au stock'
              : `Enregistrer les ${batchPieces.filter((p) => p.weightGrams > 0).length} pièces`}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
