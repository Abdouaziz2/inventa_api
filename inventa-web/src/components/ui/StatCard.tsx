import React from 'react';
import { cn } from '@/lib/utils';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  accentColor?: 'gold' | 'emerald' | 'blue' | 'purple';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  accentColor = 'gold',
}) => {
  const iconAccents = {
    gold: 'text-amber-600 bg-amber-50/80 border-amber-100',
    emerald: 'text-emerald-600 bg-emerald-50/80 border-emerald-100',
    blue: 'text-blue-600 bg-blue-50/80 border-blue-100',
    purple: 'text-purple-600 bg-purple-50/80 border-purple-100',
  };

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs hover:border-slate-300 transition-all text-left">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-slate-500">{title}</span>
        <div className={cn('w-8 h-8 rounded-lg border flex items-center justify-center shrink-0', iconAccents[accentColor])}>
          {icon}
        </div>
      </div>
      <div className="mt-2.5">
        <p className="text-2xl font-bold tracking-tight text-slate-900 m-0">{value}</p>
        {(subtitle || trend) && (
          <div className="mt-1 flex items-center gap-2 text-xs">
            {trend && (
              <span
                className={cn(
                  'font-medium',
                  trend.isPositive ? 'text-emerald-600' : 'text-rose-600'
                )}
              >
                {trend.value}
              </span>
            )}
            {subtitle && <span className="text-slate-400 text-[11px]">{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  );
};
