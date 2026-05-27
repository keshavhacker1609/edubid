import { TrustScore, TrustTier } from '@/types';

export function getTrustTier(score: number): TrustTier {
  if (score >= 90) return 'Ultra-Low Risk';
  if (score >= 75) return 'Low Risk';
  if (score >= 55) return 'Moderate Risk';
  return 'High Risk';
}

export function getTrustTierColors(tier: TrustTier): { bg: string; text: string; border: string; dot: string } {
  switch (tier) {
    case 'Ultra-Low Risk':
      return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', dot: 'bg-emerald-400' };
    case 'Low Risk':
      return { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', dot: 'bg-blue-400' };
    case 'Moderate Risk':
      return { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', dot: 'bg-amber-400' };
    case 'High Risk':
      return { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', dot: 'bg-red-400' };
  }
}

export function formatCurrency(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatRate(rate: number): string {
  return `${rate.toFixed(2)}% p.a.`;
}

export function getTimeRemaining(isoDate: string): string {
  const diff = new Date(isoDate).getTime() - Date.now();
  if (diff <= 0) return 'Ended';
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }
  return `${hours}h ${minutes}m`;
}

export function calculateEMI(principal: number, ratePercent: number, tenureMonths: number): number {
  const r = ratePercent / 12 / 100;
  const emi = (principal * r * Math.pow(1 + r, tenureMonths)) / (Math.pow(1 + r, tenureMonths) - 1);
  return Math.round(emi);
}

export function computeTrustScore(data: {
  institution_tier: string;
  degree: string;
  co_applicant_income?: number;
  loan_amount: number;
}): TrustScore {
  let institutionTier = 60;
  if (data.institution_tier === 'IIT/IIM/AIIMS') institutionTier = 100;
  else if (data.institution_tier === 'NIT/Top-Private') institutionTier = 80;
  else if (data.institution_tier === 'State-University') institutionTier = 60;
  else institutionTier = 40;

  const techKeywords = ['computer', 'data', 'ai', 'machine', 'engineering', 'medical', 'mba', 'finance'];
  const degreeLC = data.degree.toLowerCase();
  const courseEmployability = techKeywords.some((k) => degreeLC.includes(k)) ? 85 : 65;

  const coApplicantStrength = data.co_applicant_income
    ? Math.min(100, Math.round((data.co_applicant_income / data.loan_amount) * 40 + 50))
    : 40;

  const documentVerification = 95;
  const incomeStability = coApplicantStrength > 70 ? 75 : 55;

  const score = Math.round(
    institutionTier * 0.3 +
      courseEmployability * 0.3 +
      coApplicantStrength * 0.2 +
      documentVerification * 0.1 +
      incomeStability * 0.1
  );

  const tier = getTrustTier(score);

  return {
    score,
    tier,
    components: { institutionTier, courseEmployability, coApplicantStrength, documentVerification, incomeStability },
  };
}
