'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Building2,
  IndianRupee,
  Clock,
  FileCheck,
  Shield,
  CheckCircle,
  TrendingDown,
  Users,
  BarChart3,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';
import TrustScoreBadge from '@/components/ui/TrustScoreBadge';
import AuctionTimer from '@/components/ui/AuctionTimer';
import BidModal from '@/components/ui/BidModal';
import { mockLoanRequests, mockBids } from '@/lib/mockData';
import { formatCurrency, formatRate, calculateEMI } from '@/lib/trustScore';
import { LoanRequest, Bid } from '@/types';
import { createClient } from '@/lib/supabase-browser';

const LENDER_NAME = 'HDFC Bank';

const PLACEMENT_DATA: Record<string, { rate: string; avg_salary: string; top_recruiter: string }> = {
  'IIT/IIM/AIIMS': { rate: '99%', avg_salary: '₹28 LPA', top_recruiter: 'Google, McKinsey, AIIMS PG' },
  'NIT/Top-Private': { rate: '94%', avg_salary: '₹9 LPA', top_recruiter: 'Infosys, TCS, Wipro' },
  'State-University': { rate: '78%', avg_salary: '₹5.5 LPA', top_recruiter: 'Government PSUs, SMEs' },
  'Other': { rate: '65%', avg_salary: '₹4 LPA', top_recruiter: 'Varied' },
};

export default function StudentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const request: LoanRequest | undefined = mockLoanRequests.find((r) => r.id === id);
  const bids: Bid[] = mockBids.filter((b) => b.loan_request_id === id).sort((a, b) => a.interest_rate - b.interest_rate);

  const [activeBidRequest, setActiveBidRequest] = useState<LoanRequest | null>(null);
  const [localRequest, setLocalRequest] = useState<LoanRequest | null>(request ?? null);

  if (!localRequest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Student profile not found.</p>
          <button onClick={() => router.back()} className="text-blue-400 hover:text-blue-300 transition-colors text-sm">
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const placement = PLACEMENT_DATA[localRequest.institution_tier];
  const bestBid = bids[0];
  const marketRate = 13.5;
  const marketEMI = calculateEMI(localRequest.loan_amount, marketRate, localRequest.tenure_months);
  const bestEMI = bestBid ? calculateEMI(localRequest.loan_amount, bestBid.interest_rate, localRequest.tenure_months) : null;
  const savings = bestEMI ? marketEMI - bestEMI : null;

  async function handleBidSubmit(requestId: string, newRate: number, processingFee: number, conditions: string) {
    setLocalRequest((prev) => prev ? { ...prev, current_lowest_rate: newRate, bid_count: prev.bid_count + 1 } : prev);
    setActiveBidRequest(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.from('bids').insert({
        loan_request_id: requestId,
        lender_name: LENDER_NAME,
        interest_rate: newRate,
        processing_fee_percent: processingFee,
        special_conditions: conditions || null,
        status: 'active',
      });
      if (error) console.warn('[EduBid] Bid sync failed:', error.message);
    } catch (err) {
      console.warn('[EduBid] Network error:', err);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Back */}
      <FadeIn>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Lender Dashboard
        </button>
      </FadeIn>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT — Main Info */}
        <div className="lg:col-span-2 space-y-6">

          {/* Hero Card */}
          <FadeIn>
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-8">
              <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600/20 to-slate-800 border border-slate-700 text-4xl font-black text-white">
                  {localRequest.student_name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h1 className="text-2xl font-black text-white">{localRequest.student_name}</h1>
                    <TrustScoreBadge trustScore={localRequest.trust_score} size="sm" />
                  </div>
                  <p className="text-slate-300 font-semibold">{localRequest.degree}</p>
                  <p className="text-slate-500 text-sm mt-0.5">{localRequest.institution}</p>

                  <div className="flex flex-wrap gap-3 mt-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-300">
                      <GraduationCap className="h-3 w-3 text-blue-400" />
                      {localRequest.institution_tier}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-300">
                      <Clock className="h-3 w-3 text-amber-400" />
                      {localRequest.course_duration_years}-year program
                    </span>
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${
                      localRequest.status === 'open'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Auction {localRequest.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Loan Purpose */}
          <FadeIn delay={0.05}>
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6">
              <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <IndianRupee className="h-4 w-4 text-blue-400" />
                Loan Purpose
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">{localRequest.purpose}</p>
            </div>
          </FadeIn>

          {/* Placement Stats */}
          <FadeIn delay={0.08}>
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6">
              <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-emerald-400" />
                Institution Placement Data
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-4 text-center">
                  <p className="text-2xl font-black text-emerald-400">{placement.rate}</p>
                  <p className="text-xs text-slate-500 mt-1">Placement Rate</p>
                </div>
                <div className="rounded-xl bg-blue-500/5 border border-blue-500/20 p-4 text-center">
                  <p className="text-2xl font-black text-blue-400">{placement.avg_salary}</p>
                  <p className="text-xs text-slate-500 mt-1">Avg. Starting Salary</p>
                </div>
                <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-4 text-center">
                  <p className="text-xs font-bold text-white leading-snug">{placement.top_recruiter}</p>
                  <p className="text-xs text-slate-500 mt-1">Top Recruiters</p>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Co-Applicant */}
          {localRequest.co_applicant && (
            <FadeIn delay={0.1}>
              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6">
                <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <Users className="h-4 w-4 text-violet-400" />
                  Co-Applicant Details
                </h2>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-lg font-black text-white">
                    {localRequest.co_applicant.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-white">{localRequest.co_applicant.name}</p>
                    <p className="text-sm text-slate-500">{localRequest.co_applicant.relation} of student</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-xs text-slate-500">Annual Income</p>
                    <p className="text-lg font-black text-violet-400">{formatCurrency(localRequest.co_applicant.annual_income)}</p>
                    <p className="text-xs text-slate-600">Verified via Account Aggregator</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          )}

          {/* Verification */}
          <FadeIn delay={0.12}>
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6">
              <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-400" />
                Verification Status
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { label: 'DigiLocker Connected', status: true, sub: 'Mark sheets, admission letter verified' },
                  { label: 'Account Aggregator', status: true, sub: 'Co-applicant bank statements verified' },
                  { label: 'PAN Verification', status: true, sub: 'Identity confirmed' },
                  { label: 'Aadhaar Linking', status: false, sub: 'Pending student action' },
                ].map((item) => (
                  <div key={item.label} className={`flex items-start gap-3 rounded-xl border p-3 ${
                    item.status ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-slate-800 bg-slate-900/40'
                  }`}>
                    {item.status
                      ? <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      : <Clock className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    }
                    <div>
                      <p className="text-sm font-semibold text-white">{item.label}</p>
                      <p className="text-xs text-slate-500">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Bid History */}
          {bids.length > 0 && (
            <FadeIn delay={0.14}>
              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6">
                <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-blue-400" />
                  Bid History
                  <span className="ml-auto text-xs text-slate-500 font-normal">{bids.length} bids</span>
                </h2>
                <div className="space-y-2">
                  {bids.map((bid, i) => (
                    <div key={bid.id} className={`flex items-center gap-4 rounded-xl border p-4 ${
                      i === 0 ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-slate-800 bg-slate-900/40'
                    }`}>
                      <span className={`text-xs font-black w-6 text-center ${i === 0 ? 'text-emerald-400' : 'text-slate-600'}`}>
                        #{i + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-white">{bid.lender_name}</p>
                        {bid.special_conditions && (
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{bid.special_conditions}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-black ${i === 0 ? 'text-emerald-400' : 'text-white'}`}>
                          {formatRate(bid.interest_rate)}
                        </p>
                        <p className="text-xs text-slate-500">
                          EMI: {formatCurrency(calculateEMI(localRequest.loan_amount, bid.interest_rate, localRequest.tenure_months))}
                        </p>
                      </div>
                      {i === 0 && (
                        <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-400">
                          Best
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          )}
        </div>

        {/* RIGHT — Action Sidebar */}
        <div className="space-y-5">
          {/* Trust Score */}
          <FadeIn delay={0.05}>
            <TrustScoreBadge trustScore={localRequest.trust_score} size="lg" showBreakdown />
          </FadeIn>

          {/* Auction Box */}
          <FadeIn delay={0.1}>
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-4">Auction Details</p>
              <div className="space-y-3 mb-5">
                {[
                  { label: 'Loan Amount', value: formatCurrency(localRequest.loan_amount) },
                  { label: 'Tenure', value: `${localRequest.tenure_months} months` },
                  { label: 'Bids So Far', value: String(localRequest.bid_count) },
                  { label: 'Current Best', value: formatRate(localRequest.current_lowest_rate), highlight: true },
                  ...(bestEMI ? [{ label: 'Best EMI', value: `${formatCurrency(bestEMI)}/mo` }] : []),
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">{row.label}</span>
                    <span className={`text-sm font-bold ${row.highlight ? 'text-emerald-400' : 'text-white'}`}>{row.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800">
                <span className="text-xs text-slate-500">Auction closes</span>
                <AuctionTimer endsAt={localRequest.auction_ends_at} />
              </div>

              <button
                onClick={() => setActiveBidRequest(localRequest)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20"
              >
                <TrendingDown className="h-4 w-4" />
                Place Competitive Bid
              </button>
            </div>
          </FadeIn>

          {/* Savings box */}
          {savings && savings > 0 && (
            <FadeIn delay={0.15}>
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-3">If Best Bid Accepted</p>
                <p className="text-3xl font-black text-emerald-400">{formatCurrency(savings)}<span className="text-sm font-normal text-slate-500">/mo saved</span></p>
                <p className="text-xs text-slate-500 mt-1">
                  vs market rate of {marketRate}% p.a. · Total saving: {formatCurrency(savings * localRequest.tenure_months)}
                </p>
              </div>
            </FadeIn>
          )}

          {/* Document box */}
          <FadeIn delay={0.2}>
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Verified Documents</p>
              <div className="space-y-2">
                {[
                  'Class 10 Marksheet',
                  'Class 12 Marksheet',
                  'Admission Letter',
                  'Bonafide Certificate',
                  'Co-applicant Bank Statement (6mo)',
                ].map((doc) => (
                  <div key={doc} className="flex items-center gap-2">
                    <FileCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span className="text-xs text-slate-400">{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      <BidModal
        request={activeBidRequest}
        lenderName={LENDER_NAME}
        onClose={() => setActiveBidRequest(null)}
        onSubmit={handleBidSubmit}
      />
    </div>
  );
}
