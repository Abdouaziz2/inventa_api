import React from 'react';
import type { JewelleryItem } from '@/features/inventory/types/inventory.types';
import { BarcodeRenderer } from './BarcodeRenderer';
import { formatCurrency, formatWeight } from '@/lib/formatters';

export interface JewelleryTagProps {
  item: JewelleryItem;
  showPrice?: boolean;
  showWeight?: boolean;
  showKarat?: boolean;
}

export const JewelleryTag: React.FC<JewelleryTagProps> = ({
  item,
  showPrice = false,
  showWeight = true,
  showKarat = true,
}) => {
  const barcodeValue = item.sku || `INV-${item.id.slice(0, 8).toUpperCase()}`;

  return (
    <div className="printable-tag w-[62mm] h-[34mm] bg-white border border-slate-300 rounded-md p-2 flex flex-col justify-between text-black shadow-xs box-border overflow-hidden print:border-black print:shadow-none print:m-0 print:break-inside-avoid">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-0.5">
        <span className="text-[9px] font-black tracking-widest uppercase text-amber-700">INVENTA</span>
        <div className="flex items-center gap-1">
          {showKarat && item.karat > 0 && (
            <span className="text-[8px] font-bold bg-amber-100 text-amber-900 px-1 rounded-sm">
              {item.metalType === 'or' ? `${item.karat}k` : item.metalType}
            </span>
          )}
          {showWeight && item.weightGrams > 0 && (
            <span className="text-[8px] font-bold text-slate-800">
              {formatWeight(item.weightGrams)}
            </span>
          )}
        </div>
      </div>

      {/* Item Name */}
      <div className="py-0.5">
        <h5 className="text-[10px] font-bold truncate leading-tight text-slate-900">
          {item.name}
        </h5>
      </div>

      {/* Barcode SVG */}
      <div className="flex justify-center items-center -my-0.5">
        <BarcodeRenderer
          value={barcodeValue}
          width={1.1}
          height={24}
          fontSize={8}
          displayValue={true}
        />
      </div>

      {/* Tag Footer */}
      <div className="flex items-center justify-between border-t border-slate-200 pt-0.5 mt-0.5 text-[8px]">
        {showPrice && item.priceSell > 0 ? (
          <>
            <span className="uppercase tracking-wider text-slate-500 font-medium">Prix</span>
            <span className="text-[10px] font-extrabold text-slate-900">
              {formatCurrency(item.priceSell)}
            </span>
          </>
        ) : (
          <>
            <span className="font-mono text-slate-500">{barcodeValue}</span>
            <span className="font-semibold text-amber-800">Garanti Authentique</span>
          </>
        )}
      </div>
    </div>
  );
};
