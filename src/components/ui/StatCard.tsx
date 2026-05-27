'use client';

import { LucideIcon } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';

interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  accentColor?: 'blue' | 'emerald' | 'amber' | 'violet';
  delay?: number;
}

const accentMap = {
  blue: { icon: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  emerald: { icon: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  amber: { icon: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  violet: { icon: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
};

export default function StatCard({
  label,
  value,
  subValue,
  icon: Icon,
  trend,
  accentColor = 'blue',
  delay = 0,
}: StatCardProps) {
  const accent = accentMap[accentColor];

  return (
    <FadeIn delay={delay}>
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-5 backdrop-blur-sm hover:border-slate-700/80 transition-colors">
        <div className="flex items-start justify-between mb-4">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg border ${accent.bg} ${accent.border}`}>
            <Icon className={`h-5 w-5 ${accent.icon}`} />
          </div>
          {trend && (
            <span className={`text-xs font-semibold rounded-full px-2 py-0.5 ${
              trend.positive
                ? 'bg-emerald-500/10 text-emerald-400'
                : 'bg-red-500/10 text-red-400'
            }`}>
              {trend.positive ? '+' : ''}{trend.value}
            </span>
          )}
        </div>
        <p className="text-sm text-slate-500 mb-1">{label}</p>
        <p className="text-2xl font-black text-white tracking-tight">{value}</p>
        {subValue && <p className="text-xs text-slate-500 mt-1">{subValue}</p>}
      </div>
    </FadeIn>
  );
}
