'use client';

import { TrustScore } from '@/types';
import { getTrustTierColors } from '@/lib/trustScore';
import { Shield } from 'lucide-react';

interface TrustScoreBadgeProps {
  trustScore: TrustScore;
  size?: 'sm' | 'md' | 'lg';
  showBreakdown?: boolean;
}

const componentLabels: Record<string, string> = {
  institutionTier: 'Institution Tier',
  courseEmployability: 'Course Employability',
  coApplicantStrength: 'Co-Applicant Strength',
  documentVerification: 'Document Verification',
  incomeStability: 'Income Stability',
};

export default function TrustScoreBadge({ trustScore, size = 'md', showBreakdown = false }: TrustScoreBadgeProps) {
  const colors = getTrustTierColors(trustScore.tier);

  if (size === 'sm') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${colors.bg} ${colors.text} ${colors.border}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} />
        {trustScore.score} · {trustScore.tier}
      </span>
    );
  }

  return (
    <div className={`rounded-xl border p-4 ${colors.bg} ${colors.border}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Shield className={`h-4 w-4 ${colors.text}`} />
          <span className={`text-sm font-semibold ${colors.text}`}>AI Trust Score</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className={`text-3xl font-black ${colors.text}`}>{trustScore.score}</span>
          <span className="text-xs text-slate-500">/100</span>
        </div>
      </div>

      <div className="mb-3">
        <div className="h-2 w-full rounded-full bg-slate-800">
          <div
            className={`h-2 rounded-full transition-all ${colors.dot}`}
            style={{ width: `${trustScore.score}%` }}
          />
        </div>
      </div>

      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${colors.bg} ${colors.text} ${colors.border}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} />
        {trustScore.tier}
      </span>

      {showBreakdown && (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Score Breakdown</p>
          {Object.entries(trustScore.components).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              <span className="w-36 shrink-0 text-xs text-slate-400">{componentLabels[key]}</span>
              <div className="flex-1 h-1.5 rounded-full bg-slate-800">
                <div
                  className={`h-1.5 rounded-full ${colors.dot}`}
                  style={{ width: `${value}%` }}
                />
              </div>
              <span className={`w-8 text-right text-xs font-semibold ${colors.text}`}>{value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
