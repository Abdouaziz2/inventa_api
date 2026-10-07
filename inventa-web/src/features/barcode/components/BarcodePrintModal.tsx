import React, { useState } from 'react';
import type { JewelleryItem } from '@/features/inventory/types/inventory.types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { JewelleryTag } from './JewelleryTag';
import { Printer, Sliders } from 'react-bootstrap-icons';

export interface BarcodePrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: JewelleryItem[];
}

export const BarcodePrintModal: React.FC<BarcodePrintModalProps> = ({
  isOpen,
  onClose,
  items,
}) => {
  const [copies, setCopies] = useState<number>(1);
  const [showPrice, setShowPrice] = useState<boolean>(true);
  const [showWeight, setShowWeight] = useState<boolean>(true);
  const [showKarat, setShowKarat] = useState<boolean>(true);

  const handlePrint = () => {
    window.print();
  };

  // Generate array of tags based on copies
  const printableList: JewelleryItem[] = [];
  items.forEach((item) => {
    for (let i = 0; i < copies; i++) {
      printableList.push(item);
    }
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Impression des Étiquettes"
      description="Format standard bijouterie (62x34 mm)"
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Print Configuration Controls */}
        <div className="no-print bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-700 font-medium text-xs">
            <Sliders className="w-4 h-4 text-amber-600" />
            <span>Options d'étiquette :</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={showPrice}
                onChange={(e) => setShowPrice(e.target.checked)}
                className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
              />
              <span>Afficher le prix</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={showWeight}
                onChange={(e) => setShowWeight(e.target.checked)}
                className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
              />
              <span>Afficher le poids (g)</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={showKarat}
                onChange={(e) => setShowKarat(e.target.checked)}
                className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
              />
              <span>Afficher les carats (k)</span>
            </label>

            <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
              <span className="text-slate-500">Exemplaires :</span>
              <input
                type="number"
                min="1"
                max="50"
                aria-label="Nombre d'exemplaires"
                value={copies}
                onChange={(e) => setCopies(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-14 rounded-lg border border-slate-200 bg-white px-2 py-1 text-center font-semibold"
              />
            </div>
          </div>

          <Button
            variant="gold"
            size="sm"
            leftIcon={<Printer className="w-4 h-4" />}
            onClick={handlePrint}
          >
            Lancer l'impression ({printableList.length} étiquettes)
          </Button>
        </div>

        {/* Printable Grid Area */}
        <div className="printable-area max-h-[55vh] overflow-y-auto p-4 bg-slate-100 rounded-xl border border-dashed border-slate-300">
          <div className="printable-tag-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 justify-items-center print:grid-cols-3 print:gap-2">
            {printableList.map((item, index) => (
              <JewelleryTag
                key={`${item.id}-${index}`}
                item={item}
                showPrice={showPrice}
                showWeight={showWeight}
                showKarat={showKarat}
              />
            ))}
          </div>
        </div>

        <div className="no-print flex justify-between items-center text-xs text-slate-500">
          <p>
            💡 <span className="font-semibold">Conseil :</span> Utilisez du papier autocollant ou des rouleaux d'étiquettes thermiques pour un étiquetage direct sur les bagues et colliers.
          </p>
          <Button variant="outline" size="sm" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </div>
    </Modal>
  );
};
