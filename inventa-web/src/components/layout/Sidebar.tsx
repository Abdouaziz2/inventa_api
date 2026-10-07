import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Grid1x2,
  BoxSeam,
  Cart3,
  People,
  UpcScan,
  CreditCard,
  Archive,
  ChevronDown,
  ChevronUp,
  BoxArrowRight,
  XLg,
  Square,
  CashCoin,
  CheckCircleFill,
  ExclamationCircleFill,
  BoxArrowUpRight,
} from 'react-bootstrap-icons';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const location = useLocation();
  const [isVentesOpen, setIsVentesOpen] = useState(true);

  // Vérification de la santé du backend NestJS
  const { data: healthData, isError } = useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const healthBaseUrl = import.meta.env.VITE_API_URL
        ? new URL(import.meta.env.VITE_API_URL).origin
        : '';
      const res = await apiClient.get('/health', healthBaseUrl ? { baseURL: healthBaseUrl } : undefined);
      return res.data;
    },
    refetchInterval: 20000,
  });

  const isConnected = !isError && healthData?.data?.status === 'ok';

  // Fermer le drawer avec Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileOpen && onCloseMobile) {
        onCloseMobile();
      }
    };
    if (isMobileOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileOpen, onCloseMobile]);

  const navItems = [
    {
      to: '/',
      label: 'Tableau de bord',
      icon: <Grid1x2 className="w-4 h-4 shrink-0" />,
      exact: true,
    },
    {
      to: '/depot',
      label: 'Dépôt',
      icon: <Archive className="w-4 h-4 shrink-0" />,
      badge: 'Nouveau',
    },
    {
      to: '/inventory',
      label: 'Inventaire',
      icon: <BoxSeam className="w-4 h-4 shrink-0" />,
    },
    {
      to: '/pos',
      label: 'Caisse',
      icon: <CashCoin className="w-4 h-4 shrink-0" />,
    },
    {
      to: '/barcodes',
      label: 'Étiquettes',
      icon: <UpcScan className="w-4 h-4 shrink-0" />,
    },
    {
      to: '/customers',
      label: 'Clients',
      icon: <People className="w-4 h-4 shrink-0" />,
    },
    {
      to: '/subscription',
      label: 'Abonnement',
      icon: <CreditCard className="w-4 h-4 shrink-0" />,
    },
  ];

  const sidebarContent = (
    <aside
      className={cn(
        'w-64 bg-white text-slate-800 flex flex-col justify-between border-r border-slate-200/90 shrink-0 min-h-screen text-left transition-all duration-200 z-40',
        isMobileOpen ? 'fixed inset-y-0 left-0 shadow-2xl' : 'hidden lg:flex'
      )}
    >
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md border border-slate-700/80 flex items-center justify-center text-slate-800 bg-slate-50">
              <Square className="w-3.5 h-3.5 text-slate-700" />
            </div>
            <span className="text-base font-bold tracking-tight text-slate-900">
              Inventa
            </span>
          </div>

          {/* Bouton fermeture sur mobile */}
          {isMobileOpen && (
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Fermer le menu de navigation"
              className="lg:hidden text-slate-400 hover:text-slate-700 p-1 rounded-lg"
            >
              <XLg className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav aria-label="Navigation principale" className="p-3.5 space-y-1">
          {/* Tableau de bord */}
          <NavLink
            to="/"
            end
            onClick={() => {
              if (isMobileOpen && onCloseMobile) onCloseMobile();
            }}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all select-none min-h-[40px]',
                isActive
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
              )
            }
          >
            <Grid1x2 className="w-4 h-4 shrink-0" />
            <span>Tableau de bord</span>
          </NavLink>

          {/* Ventes avec accordéon */}
          <div>
            <button
              type="button"
              onClick={() => setIsVentesOpen((prev) => !prev)}
              className={cn(
                'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors select-none text-slate-600 hover:text-slate-900 hover:bg-slate-100/70',
                location.pathname.startsWith('/pos') && 'text-slate-900 font-semibold'
              )}
            >
              <div className="flex items-center gap-3">
                <Cart3 className="w-4 h-4 shrink-0 text-slate-600" />
                <span>Ventes</span>
              </div>
              {isVentesOpen ? (
                <ChevronUp className="w-3 h-3 text-slate-400" />
              ) : (
                <ChevronDown className="w-3 h-3 text-slate-400" />
              )}
            </button>

            {/* Sous-rubriques Ventes */}
            {isVentesOpen && (
              <div className="mt-0.5 space-y-0.5 pl-9 pr-2 py-0.5">
                <NavLink
                  to="/pos"
                  onClick={() => {
                    if (isMobileOpen && onCloseMobile) onCloseMobile();
                  }}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-colors',
                      isActive
                        ? 'text-amber-700 font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    )
                  }
                >
                  <span className="truncate">Ventes du jour</span>
                  <span className="text-xs text-slate-500 font-normal">8</span>
                </NavLink>

                <NavLink
                  to="/pos"
                  onClick={() => {
                    if (isMobileOpen && onCloseMobile) onCloseMobile();
                  }}
                  className="flex items-center justify-between px-2 py-1.5 rounded-lg text-xs text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <span className="truncate">À crédit</span>
                  <span className="text-xs text-slate-500 font-normal">3</span>
                </NavLink>
              </div>
            )}
          </div>

          {/* Dépôt (Déclaré dans le menu conformément à la demande) */}
          <NavLink
            to="/depot"
            onClick={() => {
              if (isMobileOpen && onCloseMobile) onCloseMobile();
            }}
            className={({ isActive }) =>
              cn(
                'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all select-none min-h-[40px]',
                isActive
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
              )
            }
          >
            <div className="flex items-center gap-3">
              <Archive className="w-4 h-4 shrink-0 text-slate-600" />
              <span>Dépôt</span>
            </div>
          </NavLink>

          {/* Autres modules */}
          {navItems.slice(2).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => {
                if (isMobileOpen && onCloseMobile) onCloseMobile();
              }}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all select-none min-h-[40px]',
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
                )
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer Déconnexion & statut API */}
      <div className="p-3.5 border-t border-slate-100 space-y-2">
        <button
          type="button"
          onClick={() => {
            if (isMobileOpen && onCloseMobile) onCloseMobile();
          }}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition-colors cursor-pointer text-left"
        >
          <BoxArrowRight className="w-4 h-4 text-slate-600" />
          <span>Déconnexion</span>
        </button>

        {/* Moniteur discret de connexion NestJS */}
        <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/60 text-[10px]">
          <div className="flex items-center gap-1.5">
            {isConnected ? (
              <CheckCircleFill className="w-2.5 h-2.5 text-emerald-500" />
            ) : (
              <ExclamationCircleFill className="w-2.5 h-2.5 text-amber-500" />
            )}
            <span className="text-slate-500 font-medium">
              {isConnected ? 'API active' : 'Mode hors-ligne'}
            </span>
          </div>

          <a
            href={import.meta.env.VITE_DOCS_URL || 'http://localhost:4000/docs'}
            target="_blank"
            rel="noopener noreferrer"
            title="Documentation Swagger API"
            className="text-slate-400 hover:text-amber-600 transition-colors"
          >
            <BoxArrowUpRight className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Backdrop mobile */}
      {isMobileOpen && (
        <div
          role="presentation"
          className="fixed inset-0 bg-slate-900/40 z-30 lg:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}
      {sidebarContent}
    </>
  );
};
