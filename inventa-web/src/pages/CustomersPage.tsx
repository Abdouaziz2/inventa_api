import React, { useState } from 'react';
import { useCustomersQuery } from '@/features/customers/api/customers.api';
import { CustomerTable } from '@/features/customers/components/CustomerTable';
import { CustomerModal } from '@/features/customers/components/CustomerModal';
import { StatCard } from '@/components/ui/StatCard';
import { formatCurrency } from '@/lib/formatters';
import { People, StarFill, CashCoin } from 'react-bootstrap-icons';

export const CustomersPage: React.FC = () => {
  const { data: customers = [], isLoading } = useCustomersQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const vipCount = customers.filter((c) => c.category === 'vip').length;
  const totalVolume = customers.reduce((acc, curr) => acc + (curr.totalSpent || 0), 0);

  return (
    <div className="space-y-5 text-left">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 m-0">
          Clients
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Répertoire client et historique des achats
        </p>
      </div>

      {/* KPI Cards Simplifiées */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total clients"
          value={isLoading ? '...' : customers.length}
          icon={<People className="w-4 h-4" />}
          accentColor="blue"
        />

        <StatCard
          title="Clients VIP"
          value={isLoading ? '...' : vipCount}
          icon={<StarFill className="w-4 h-4" />}
          accentColor="gold"
        />

        <StatCard
          title="Volume d'achats"
          value={formatCurrency(totalVolume)}
          icon={<CashCoin className="w-4 h-4" />}
          accentColor="emerald"
        />
      </div>

      {/* Table des clients */}
      <CustomerTable
        customers={customers}
        isLoading={isLoading}
        onAddCustomer={() => setIsModalOpen(true)}
      />

      {/* Modal d'ajout de client */}
      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
