import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInventoryQuery } from '@/features/inventory/api/inventory.api';
import { useMetalRatesStore } from '@/features/inventory/stores/metalRates.store';
import { formatCurrency, formatWeight } from '@/lib/formatters';
import {
  Square,
  Coin,
  Diamond,
  ExclamationCircle,
} from 'react-bootstrap-icons';

interface SaleRow {
  id: string;
  canal: 'store' | 'phone' | 'online';
  client: string;
  total: number;
  statut: 'Payé' | 'En attente' | 'Annulé';
}

const DEFAULT_SALES: SaleRow[] = [
  {
    id: '1',
    canal: 'store',
    client: 'Awa Diop',
    total: 182400,
    statut: 'Payé',
  },
  {
    id: '2',
    canal: 'phone',
    client: 'Moussa Ndiaye',
    total: 270400,
    statut: 'En attente',
  },
  {
    id: '3',
    canal: 'online',
    client: 'Fatou Sow',
    total: 205200,
    statut: 'Annulé',
  },
];

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: inventory = [] } = useInventoryQuery();
  const { getRateFor } = useMetalRatesStore();

  // Permettre l'interactivité sur le graphique tout en gardant 'Mai' sélectionné par défaut
  const [activeMonth, setActiveMonth] = useState<'Jan' | 'Mar' | 'Mai' | 'Juil' | 'Sep' | 'Nov'>('Mai');

  // Données réelles si disponibles, sinon valeurs modèles fidèles à la maquette
  const totalPieces = inventory.length > 0 ? inventory.reduce((acc, curr) => acc + curr.stockQty, 0) : 22;

  const totalStockValue = inventory.length > 0
    ? inventory.reduce((acc, curr) => {
        const rate = getRateFor(curr.metalType, curr.karat);
        const val = curr.priceSell > 0 ? curr.priceSell : Math.round(curr.weightGrams * rate);
        return acc + val * curr.stockQty;
      }, 0)
    : 25677550;

  const totalGoldWeight = inventory.length > 0
    ? inventory
        .filter((item) => item.metalType === 'or')
        .reduce((acc, curr) => acc + curr.weightGrams * curr.stockQty, 0)
    : 92.35;

  const alertesCount = inventory.length > 0
    ? inventory.filter((item) => item.stockQty <= 2).length
    : 6;

  // Calcul pour la jauge semi-circulaire (Objectif du mois)
  const objectifMontant = 10000000;
  const realiseMontant = 6228000;
  const pourcentageObjectif = 62.28;
  const gaugeCircumference = Math.PI * 75; // ~235.62
  const gaugeOffset = gaugeCircumference * (1 - pourcentageObjectif / 100);

  // Données d'infobulle pour les statistiques
  const monthData: Record<string, { ventes: string; achats: string }> = {
    Jan: { ventes: '3 450 000', achats: '2 100 000' },
    Mar: { ventes: '4 820 000', achats: '2 950 000' },
    Mai: { ventes: '6 228 000', achats: '3 940 000' },
    Juil: { ventes: '5 700 000', achats: '3 800 000' },
    Sep: { ventes: '7 100 000', achats: '4 450 000' },
    Nov: { ventes: '8 400 000', achats: '4 800 000' },
  };

  return (
    <div className="space-y-4 sm:space-y-5 text-left">
      {/* ---------------------------------------------------- */}
      {/* LIGNE 1 : LES 4 CARTES MÉTRIQUES                    */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Valeur du stock */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-normal">Valeur du stock</span>
            <div className="w-7 h-7 rounded-lg bg-amber-100/70 text-amber-700 flex items-center justify-center">
              <Square className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-[26px] font-bold text-slate-900 tracking-tight leading-none">
              {formatCurrency(totalStockValue)}
            </div>
            <div className="mt-1.5 flex items-center gap-1.5 text-xs">
              <span className="font-semibold text-emerald-600">+2,4 %</span>
              <span className="text-slate-400">FCFA</span>
            </div>
          </div>
        </div>

        {/* 2. Or en réserve */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-normal">Or en réserve</span>
            <div className="w-7 h-7 rounded-lg bg-purple-100/70 text-purple-700 flex items-center justify-center">
              <Coin className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-[26px] font-bold text-slate-900 tracking-tight leading-none">
              {formatWeight(totalGoldWeight)}
            </div>
            <div className="mt-1.5 text-xs text-slate-400">
              18k, 21k, 24k
            </div>
          </div>
        </div>

        {/* 3. Pièces */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-normal">Pièces</span>
            <div className="w-7 h-7 rounded-lg bg-blue-100/70 text-blue-700 flex items-center justify-center">
              <Diamond className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-[26px] font-bold text-slate-900 tracking-tight leading-none">
              {totalPieces}
            </div>
            <div className="mt-1.5 text-xs text-slate-400">
              8 modèles
            </div>
          </div>
        </div>

        {/* 4. Alertes */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-normal">Alertes</span>
            <div className="w-7 h-7 rounded-lg bg-rose-100/70 text-rose-700 flex items-center justify-center">
              <ExclamationCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-[26px] font-bold text-slate-900 tracking-tight leading-none">
              {alertesCount}
            </div>
            <div className="mt-1.5 text-xs font-semibold text-rose-800">
              À réapprovisionner
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* LIGNE 2 : OBJECTIF DU MOIS & STATISTIQUES           */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        {/* GAUCHE : Objectif du mois (5 colonnes) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 m-0">Objectif du mois</h2>
            <p className="text-xs text-slate-400 mt-0.5 m-0">Chiffre d'affaires</p>
          </div>

          {/* Jauge semi-circulaire */}
          <div className="relative flex flex-col items-center justify-center my-4">
            <svg
              viewBox="0 0 200 115"
              className="w-56 sm:w-64 max-w-full overflow-visible"
            >
              {/* Arc de fond (gris clair) */}
              <path
                d="M 25 100 A 75 75 0 0 1 175 100"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="16"
                strokeLinecap="round"
              />
              {/* Arc de progression (ocre/ambre doré chaud) */}
              <path
                d="M 25 100 A 75 75 0 0 1 175 100"
                fill="none"
                stroke="#b47214"
                strokeWidth="16"
                strokeLinecap="round"
                strokeDasharray={gaugeCircumference}
                strokeDashoffset={gaugeOffset}
                style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
              />
            </svg>

            {/* Texte au centre de la jauge */}
            <div className="text-center mt-[-40px]">
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {pourcentageObjectif.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %
              </div>
              <div className="text-xs text-slate-400 font-normal mt-0.5">
                de l'objectif
              </div>
            </div>
          </div>

          {/* Métriques bas : Objectif / Réalisé */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div>
              <span className="text-xs text-slate-400 block font-normal">Objectif</span>
              <span className="text-sm sm:text-base font-bold text-slate-900 block mt-0.5">
                {formatCurrency(objectifMontant)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block font-normal">Réalisé</span>
              <span className="text-sm sm:text-base font-bold text-slate-900 block mt-0.5">
                {formatCurrency(realiseMontant)}
              </span>
            </div>
          </div>
        </div>

        {/* DROITE : Statistiques Ventes, achats d'or et réparations (7 colonnes) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 m-0">Statistiques</h2>
              <p className="text-xs text-slate-400 mt-0.5 m-0">
                Ventes, achats d'or et réparations
              </p>
            </div>
            <span className="text-xs font-medium text-slate-400">2026</span>
          </div>

          {/* Graphique de lignes lissées (Courbes splines) */}
          <div className="relative my-4">
            <svg
              viewBox="0 0 520 180"
              className="w-full h-48 sm:h-52 overflow-visible select-none"
            >
              {/* Lignes horizontales discrètes de repère */}
              <line x1="20" y1="40" x2="500" y2="40" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="20" y1="80" x2="500" y2="80" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="20" y1="120" x2="500" y2="120" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="20" y1="150" x2="500" y2="150" stroke="#f1f5f9" strokeWidth="1" />

              {/* Ligne pointillée verticale pour le mois sélectionné (Mai) */}
              <line
                x1="230"
                y1="30"
                x2="230"
                y2="155"
                stroke="#cbd5e1"
                strokeWidth="1.2"
                strokeDasharray="3 3"
              />

              {/* 1. Courbe Réparations (Rose / Magenta) */}
              <path
                d="M 20 155 C 60 156, 95 152, 140 148 C 185 144, 210 140, 230 135 C 265 137, 290 134, 330 128 C 370 122, 410 124, 450 126 C 480 127, 495 118, 500 114"
                fill="none"
                stroke="#db2777"
                strokeWidth="2.2"
                strokeLinecap="round"
              />

              {/* 2. Courbe Achats d'or (Bleu vif) */}
              <path
                d="M 20 144 C 60 142, 95 138, 140 132 C 185 125, 205 110, 230 98 C 260 102, 290 98, 330 88 C 370 78, 410 75, 450 78 C 480 80, 495 82, 500 82"
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.2"
                strokeLinecap="round"
              />

              {/* 3. Courbe Ventes (Doré / Ambre chaud) */}
              <path
                d="M 20 130 C 60 124, 95 115, 140 105 C 185 96, 205 75, 230 55 C 260 70, 290 65, 330 50 C 370 42, 410 38, 450 42 C 480 44, 495 30, 500 25"
                fill="none"
                stroke="#b47214"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Infobulle élégante épousant la maquette (positionnée au-dessus de Mai) */}
              <g transform="translate(165, 10)" className="pointer-events-none">
                <rect
                  width="135"
                  height="48"
                  rx="8"
                  fill="#ffffff"
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))"
                />
                <text x="12" y="16" fontSize="10" fontWeight="700" fill="#1e293b">
                  {activeMonth}
                </text>
                <text x="12" y="29" fontSize="9.5" fill="#64748b">
                  Ventes {monthData[activeMonth]?.ventes || '6 228 000'}
                </text>
                <text x="12" y="41" fontSize="9.5" fill="#64748b">
                  Achats or {monthData[activeMonth]?.achats || '3 940 000'}
                </text>
              </g>

              {/* Points interactifs sur l'axe X pour changer le mois au survol/clic */}
              {[
                { name: 'Jan', x: 20 },
                { name: 'Mar', x: 125 },
                { name: 'Mai', x: 230 },
                { name: 'Juil', x: 335 },
                { name: 'Sep', x: 420 },
                { name: 'Nov', x: 480 },
              ].map((tick) => (
                <text
                  key={tick.name}
                  x={tick.x}
                  y="175"
                  fontSize="11"
                  fill={activeMonth === tick.name ? '#0f172a' : '#94a3b8'}
                  fontWeight={activeMonth === tick.name ? '600' : '400'}
                  textAnchor="middle"
                  className="cursor-pointer hover:fill-slate-900 transition-colors"
                  onClick={() => setActiveMonth(tick.name as any)}
                >
                  {tick.name}
                </text>
              ))}
            </svg>
          </div>

          {/* Légende du graphique */}
          <div className="flex items-center gap-5 pt-3 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#b47214]" />
              <span className="text-slate-600 font-medium">Ventes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb]" />
              <span className="text-slate-600 font-medium">Achats d'or</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#db2777]" />
              <span className="text-slate-600 font-medium">Réparations</span>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* LIGNE 3 : DERNIÈRES VENTES & STOCK PAR TITRE        */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        {/* GAUCHE : Dernières ventes (7 colonnes) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 m-0">Dernières ventes</h2>
            <button
              type="button"
              onClick={() => navigate('/pos')}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline cursor-pointer bg-transparent border-0 p-0"
            >
              Tout voir
            </button>
          </div>

          {/* Tableau des ventes */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="text-slate-400 font-normal border-b border-slate-100">
                  <th className="pb-3 font-normal w-16">Canal</th>
                  <th className="pb-3 font-normal">Client</th>
                  <th className="pb-3 font-normal">Total</th>
                  <th className="pb-3 font-normal text-right">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {DEFAULT_SALES.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5">
                      {sale.canal === 'store' && (
                        <div className="w-5 h-5 rounded border border-amber-400 text-amber-600 flex items-center justify-center">
                          <Square className="w-2.5 h-2.5" />
                        </div>
                      )}
                      {sale.canal === 'phone' && (
                        <div className="w-5 h-5 rounded border border-emerald-400 text-emerald-600 flex items-center justify-center">
                          <Square className="w-2.5 h-2.5" />
                        </div>
                      )}
                      {sale.canal === 'online' && (
                        <div className="w-5 h-5 rounded border border-blue-400 text-blue-600 flex items-center justify-center">
                          <Square className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 font-medium text-slate-800 text-xs sm:text-sm">
                      {sale.client}
                    </td>
                    <td className="py-3.5 font-medium text-slate-900 text-xs sm:text-sm">
                      {formatCurrency(sale.total)}
                    </td>
                    <td className="py-3.5 text-right">
                      {sale.statut === 'Payé' && (
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#dcfce7] text-[#15803d]">
                          Payé
                        </span>
                      )}
                      {sale.statut === 'En attente' && (
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#fef3c7] text-[#b45309]">
                          En attente
                        </span>
                      )}
                      {sale.statut === 'Annulé' && (
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#fee2e2] text-[#b91c1c]">
                          Annulé
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* DROITE : Stock par titre (5 colonnes) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 m-0">Stock par titre</h2>
            <p className="text-xs text-slate-400 mt-0.5 m-0">Répartition en valeur</p>
          </div>

          {/* Barres de répartition colorées */}
          <div className="space-y-4 my-auto py-3">
            {/* 18k : 58% */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="font-medium text-slate-700">18k</span>
                <span className="font-bold text-slate-900">58 %</span>
              </div>
              <div className="w-full bg-transparent">
                <div className="h-2 rounded-full bg-[#b47214] w-[58%]" />
              </div>
            </div>

            {/* 21k : 30% */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="font-medium text-slate-700">21k</span>
                <span className="font-bold text-slate-900">30 %</span>
              </div>
              <div className="w-full bg-transparent">
                <div className="h-2 rounded-full bg-[#0d9488] w-[30%]" />
              </div>
            </div>

            {/* 24k : 12% */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="font-medium text-slate-700">24k</span>
                <span className="font-bold text-slate-900">12 %</span>
              </div>
              <div className="w-full bg-transparent">
                <div className="h-2 rounded-full bg-[#6366f1] w-[12%]" />
              </div>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-400 text-left">
            Total or en stock consolidé
          </div>
        </div>
      </div>
    </div>
  );
};
