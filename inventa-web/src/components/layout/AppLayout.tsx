import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { ItemModal } from '@/features/inventory/components/ItemModal';

export const AppLayout: React.FC = () => {
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900 antialiased">
      {/* Sidebar navigation */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main content viewport */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Navbar
          onAddItem={() => setIsAddItemModalOpen(true)}
          onToggleMobileMenu={() => setIsMobileSidebarOpen((prev) => !prev)}
        />
        <main className="flex-1 px-4 sm:px-6 pb-8 w-full max-w-7xl mx-auto">
          <Outlet context={{ openAddItemModal: () => setIsAddItemModalOpen(true) }} />
        </main>
      </div>

      {/* Modal d'ajout de bijou global */}
      <ItemModal
        isOpen={isAddItemModalOpen}
        onClose={() => setIsAddItemModalOpen(false)}
      />
    </div>
  );
};
