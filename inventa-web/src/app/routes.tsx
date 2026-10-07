import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ArrowRepeat } from 'react-bootstrap-icons';

const DashboardPage = lazy(() =>
  import('@/pages/DashboardPage').then((m) => ({ default: m.DashboardPage }))
);
const InventoryPage = lazy(() =>
  import('@/pages/InventoryPage').then((m) => ({ default: m.InventoryPage }))
);
const PosPage = lazy(() =>
  import('@/pages/PosPage').then((m) => ({ default: m.PosPage }))
);
const BarcodePage = lazy(() =>
  import('@/pages/BarcodePage').then((m) => ({ default: m.BarcodePage }))
);
const CustomersPage = lazy(() =>
  import('@/pages/CustomersPage').then((m) => ({ default: m.CustomersPage }))
);
const SubscriptionPage = lazy(() =>
  import('@/pages/SubscriptionPage').then((m) => ({ default: m.SubscriptionPage }))
);
const DepotPage = lazy(() =>
  import('@/pages/DepotPage').then((m) => ({ default: m.DepotPage }))
);

const PageFallback: React.FC = () => (
  <div
    role="status"
    aria-label="Chargement"
    className="flex flex-col items-center justify-center py-24 text-slate-400 gap-3"
  >
    <ArrowRepeat className="w-6 h-6 text-amber-500 animate-spin" />
    <span className="text-xs text-slate-500 font-medium">Chargement...</span>
  </div>
);

export const AppRoutes = () => {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/pos" element={<PosPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/barcodes" element={<BarcodePage />} />
          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route path="/depot" element={<DepotPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
};
