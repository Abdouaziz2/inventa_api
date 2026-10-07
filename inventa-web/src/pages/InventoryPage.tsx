import React from 'react';
import { useInventoryQuery } from '@/features/inventory/api/inventory.api';
import { InventoryTable } from '@/features/inventory/components/InventoryTable';
import type { JewelleryItem } from '@/features/inventory/types/inventory.types';
import { useCartStore } from '@/features/sales/stores/cart.store';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'sonner';

export const InventoryPage: React.FC = () => {
  const { data: inventory = [], isLoading } = useInventoryQuery();
  const addItemToCart = useCartStore((state) => state.addItem);
  const outletCtx = useOutletContext<{ openAddItemModal?: () => void }>() || {};
  const openAddItemModal = outletCtx.openAddItemModal ?? (() => {});

  const handleAddToCart = (item: JewelleryItem) => {
    addItemToCart(item);
    toast.success(`"${item.name}" ajouté à la caisse !`);
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 m-0">
          Inventaire
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Catalogue des bijoux et gestion des stocks
        </p>
      </div>

      <InventoryTable
        items={inventory}
        isLoading={isLoading}
        onAddItem={openAddItemModal}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};
