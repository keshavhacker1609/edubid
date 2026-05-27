'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  TrendingDown, CheckCircle, Clock, Building2, X,
  Shield, ChevronDown, ChevronUp, FileCheck, Bell,
  PartyPopper, ArrowRight, Copy,
} from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';
import TrustScoreBadge from '@/components/ui/TrustScoreBadge';
import AuctionTimer from '@/components/ui/AuctionTimer';
import { BidCardSkeleton } from '@/components/ui/Skeleton';
import { mockLoanRequests, mockBids } from '@/lib/mockData';
import { formatCurrency, formatRate, calculateEMI } from '@/lib/trustScore';
import { Bid } from '@/types';

const studentRequest = mockLoanRequests[0];
const studentBids: Bid[] = [
  ...mockBids.filter((b) => b.loan_request_id === 'lr-001'),
  {
    id: 'bid-004',
    loan_request_id: 'lr-001',
    lender_id: 'l-004',
    lender_name: 'Avanse Financial',
    interest_rate: 9.8,
    tenure_months: 84,
    processing_fee_percent: 1.0,
    special_conditions: 'Dedicated education loan advisor. Subsidy applicable under CSIS scheme.',
    status: 'outbid',
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'bid-005',
    loan_request_id: 'lr-001',
    lender_id: 'l-005',
    lender_name: 'State Bank of India',
    interest_rate: 9.50,
    tenure_months: 84,
    processing_fee_percent: 0,
    special_conditions: 'Vidyalakshmi scheme. Moratorium during course + 1 year.',
    status: 'outbid',
    created_at: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
  },
];

const sortedBids = [...studentBids].sort((a, b) => a.interest_rate - b.interest_rate);

export default function StudentDashboard() {
  const [acceptedBid, setAcceptedBid] = useState<Bid | null>(null);
  const [expandedBid, setExpandedBid] = useState<string | null>(null);
  const [showAcceptModal, setShowAcceptModal] = useState<Bid | null>(null);
  const [loading, setLoading] = useState(false);

  const bestBid = sortedBids[0];
  const marketRate = 13.5;
  const savingsPerMonth = bestBid
    ? calculateEMI(studentRequest.loan_amount, marketRate, studentRequest.tenure_months) -
      calculateEMI(studentRequest.loan_amount, bestBid.interest_rate, studentRequest.tenure_months)
    : 0;

  async function confirmAccept() {
    if (!showAcceptModal) return;
    setLoading(true);
    // Simulate async accept (wire to Supabase when ready)
    await new Promise((r) => setTimeout(r, 900));
    setAcceptedBid(showAcceptModal);
    setShowAcceptModal(null);
    setLoading(false);
    toast.success(`Offer accepted from ${showAcceptModal.lender_name}! 🎉`);
  }

  // ── SUCCESS SCREEN ──────────────────────────────────────────────────
  if (acceptedBid) {
    const emi = calculateEMI(studentRequest.loan_amount, acceptedBid.interest_rate, acceptedBid.tenure_months);
    const totalSavings = savingsPerMonth * studentRequest.tenure_months;
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <FadeIn>
          <div className="w-full max-w-lg text-center">
            {/* Glow ring */}
            <div className="relative inline-flex mb-8">
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-2xl scale-150" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/10 border-2 border-emerald-500/30">
                <PartyPopper className="h-10 w-10 text-emerald-400" />
              </div>
            </div>

            <h1 className="text-4xl font-black text-white mb-3">
              Congratulations! 🎊
            </h1>
            <p className="text-slate-400 text-lg mb-8">
              Your loan offer from{' '}
              <span className="text-white font-bold">{acceptedBid.lender_name}</span>{' '}
              has been accepted. They will contact you within 24–48 hours.
            </p>

            {/* Offer summary card */}
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 mb-6 text-left">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="rounded-xl bg-slate-900/60 p-4 text-center">
                  <p className="text-xs text-slate-500 mb-1">Interest Rate</p>
                  <p className="text-3xl font-black text-emerald-400">{formatRate(acceptedBid.interest_rate)}</p>
                  <p className="text-xs text-slate-500">per annum</p>
                </div>
                <div className="rounded-xl bg-slate-900/60 p-4 text-center">
                  <p className="text-xs text-slate-500 mb-1">Monthly EMI</p>
                  <p className="text-3xl font-black text-white">{formatCurrency(emi)}</p>
                  <p className="text-xs text-slate-500">for {acceptedBid.tenure_months} months</p>
                </div>
              </div>
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-center">
                <p className="text-xs text-emerald-400/70 mb-1">Total savings vs market rate (13.5%)</p>
                <p className="text-2xl font-black text-emerald-400">{formatCurrency(totalSavings)}</p>
                <p className="text-xs text-slate-400">over the full loan tenure</p>
              </div>
            </div>

            {/* Next steps */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 mb-6 text-left">
              <p className="text-sm font-bold text-slate-300 mb-3">What happens next?</p>
              <div className="space-y-3">
                {[
                  { step: '1', text: 'Lender verifies your documents (1–2 days)' },
                  { step: '2', text: 'Loan agreement sent to your email for e-signing' },
                  { step: '3', text: 'Funds disbursed directly to institution' },
                ].map((s) => (
                  <div key={s.step} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 border border-blue-500/30 text-xs font-bold text-blue-400 shrink-0">
                      {s.step}
                    </div>
                    <p className="text-sm text-slate-400">{s.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`Loan offer: ${formatRate(acceptedBid.interest_rate)} from ${acceptedBid.lender_name}`);
                  toast.success('Offer details copied!');
                }}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-700 py-3 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
              >
                <Copy className="h-4 w-4" /> Copy Offer Details
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-500 transition-colors"
              >
                Back to Home <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </FadeIn>
      </div>
    );
  }

  // ── MAIN DASHBOARD ──────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-sm text-slate-500 mb-1">Welcome back</p>
            <h1 className="text-2xl font-black text-white">{studentRequest.student_name}</h1>
            <p className="text-slate-400 text-sm mt-0.5">{studentRequest.degree} · {studentRequest.institution}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => toast.info(`You have ${sortedBids.length} active bids`)}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/50 text-slate-400 hover:text-white transition-colors"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-blue-500 border-2 border-[#05070a] flex items-center justify-center">
                <span className="text-[8px] font-black text-white">{sortedBids.length}</span>
              </span>
            </button>
            <span className="inline-flex items-center gap-1.5 rounded-full border bg-blue-500/10 border-blue-500/30 text-blue-400 px-3 py-1 text-xs font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
              Auction Live
            </span>
          </div>
        </div>
      </FadeIn>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Bids */}
        <div className="lg:col-span-2 space-y-4">
          {/* Auction header */}
          <FadeIn delay={0.05}>
            <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Your Loan Request</p>
                  <p className="text-2xl font-black text-white">{formatCurrency(studentRequest.loan_amount)}</p>
                  <p className="text-sm text-slate-500 mt-0.5">{studentRequest.tenure_months} months tenure</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 mb-1">Auction closes in</p>
                  <AuctionTimer endsAt={studentRequest.auction_ends_at} />
                  <p className="text-xs text-slate-600 mt-1">{sortedBids.length} bids received</p>
                </div>
              </div>

              {bestBid && (
                <div className="mt-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500">Best offer so far</p>
                      <p className="text-2xl font-black text-emerald-400">{formatRate(bestBid.interest_rate)}</p>
                      <p className="text-xs text-slate-400 mt-0.5">from {bestBid.lender_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">You save vs market</p>
                      <p className="text-lg font-bold text-emerald-400">{formatCurrency(savingsPerMonth)}/mo</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {formatCurrency(savingsPerMonth * studentRequest.tenure_months)} total
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </FadeIn>

          {/* Bids list */}
          <div className="space-y-3">
            {sortedBids.map((bid, i) => {
              const isExpanded = expandedBid === bid.id;
              const emi = calculateEMI(studentRequest.loan_amount, bid.interest_rate, bid.tenure_months);
              const isBest = i === 0;

              return (
                <FadeIn key={bid.id} delay={0.05 + i * 0.08}>
                  <div className={`rounded-xl border transition-all ${
                    isBest
                      ? 'border-blue-500/40 bg-blue-500/5'
                      : 'border-slate-800/80 bg-slate-900/40'
                  }`}>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-black ${
                            isBest
                              ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                              : 'bg-slate-800 border-slate-700 text-slate-400'
                          }`}>
                            #{i + 1}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-bold text-white">{bid.lender_name}</p>
                              {isBest && (
                                <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-xs font-bold text-blue-400">
                                  Best Rate
                                </span>
                              )}
                              {bid.status === 'outbid' && (
                                <span className="rounded-full bg-slate-800 border border-slate-700 px-2 py-0.5 text-xs text-slate-500">
                                  Outbid
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {new Date(bid.created_at).toLocaleDateString('en-IN', {
                                day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black text-white">{formatRate(bid.interest_rate)}</p>
                          <p className="text-xs text-slate-500">EMI: {formatCurrency(emi)}/mo</p>
                          <p className="text-xs text-slate-600">Fee: {bid.processing_fee_percent}%</p>
                        </div>
                      </div>

                      {/* Expand toggle */}
                      <button
                        onClick={() => setExpandedBid(isExpanded ? null : bid.id)}
                        className="mt-3 flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                        {isExpanded ? 'Hide details' : 'View details & conditions'}
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 pt-4 border-t border-slate-800">
                              <div className="grid grid-cols-3 gap-4 mb-3">
                                <div>
                                  <p className="text-xs text-slate-500">Tenure</p>
                                  <p className="text-sm font-semibold text-white">{bid.tenure_months} months</p>
                                </div>
                                <div>
                                  <p className="text-xs text-slate-500">Processing Fee</p>
                                  <p className="text-sm font-semibold text-white">{bid.processing_fee_percent}%</p>
                                </div>
                                <div>
                                  <p className="text-xs text-slate-500">Total Interest</p>
                                  <p className="text-sm font-semibold text-white">
                                    {formatCurrency(emi * bid.tenure_months - studentRequest.loan_amount)}
                                  </p>
                                </div>
                              </div>
                              {bid.special_conditions && (
                                <div className="rounded-lg bg-slate-800/50 p-3">
                                  <p className="text-xs text-slate-500 mb-1">Special Conditions</p>
                                  <p className="text-sm text-slate-300">{bid.special_conditions}</p>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Accept button — only on active bids */}
                      {bid.status !== 'outbid' && (
                        <button
                          onClick={() => setShowAcceptModal(bid)}
                          className="mt-4 w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-bold text-white hover:bg-emerald-500 transition-colors"
                        >
                          Accept This Offer
                        </button>
                      )}
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          <FadeIn delay={0.1}>
            <TrustScoreBadge trustScore={studentRequest.trust_score} size="lg" showBreakdown />
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-5">
              <p className="text-sm font-semibold text-slate-400 mb-4">Loan Summary</p>
              <div className="space-y-3">
                {[
                  { label: 'Amount Requested', value: formatCurrency(studentRequest.loan_amount) },
                  { label: 'Tenure', value: `${studentRequest.tenure_months} months` },
                  { label: 'Bids Received', value: `${sortedBids.length}` },
                  { label: 'Best Rate', value: bestBid ? formatRate(bestBid.interest_rate) : '—', highlight: true },
                  {
                    label: 'Best EMI',
                    value: bestBid
                      ? `${formatCurrency(calculateEMI(studentRequest.loan_amount, bestBid.interest_rate, studentRequest.tenure_months))}/mo`
                      : '—',
                  },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">{row.label}</span>
                    <span className={`text-sm font-bold ${row.highlight ? 'text-emerald-400' : 'text-white'}`}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-5">
              <p className="text-sm font-semibold text-slate-400 mb-4">Verification Status</p>
              <div className="space-y-3">
                {[
                  { label: 'DigiLocker', status: true, icon: FileCheck },
                  { label: 'Account Aggregator', status: true, icon: Shield },
                  { label: 'PAN Verification', status: true, icon: CheckCircle },
                  { label: 'Aadhaar Linking', status: false, icon: Clock },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center gap-3">
                      <Icon className={`h-4 w-4 ${item.status ? 'text-emerald-400' : 'text-amber-400'}`} />
                      <span className="text-sm text-slate-300 flex-1">{item.label}</span>
                      <span className={`text-xs font-semibold ${item.status ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {item.status ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </FadeIn>

          {/* Savings callout */}
          <FadeIn delay={0.25}>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-4 w-4 text-emerald-400" />
                <p className="text-sm font-bold text-emerald-400">You're saving big</p>
              </div>
              <p className="text-2xl font-black text-white">{formatCurrency(savingsPerMonth * studentRequest.tenure_months)}</p>
              <p className="text-xs text-slate-500 mt-1">vs. market rate of 13.5% over full tenure</p>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Accept confirmation modal */}
      <AnimatePresence>
        {showAcceptModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => !loading && setShowAcceptModal(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-[#0d1117] p-8 shadow-2xl"
            >
              {!loading && (
                <button onClick={() => setShowAcceptModal(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              )}
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6 mx-auto">
                <CheckCircle className="h-7 w-7 text-emerald-400" />
              </div>
              <h2 className="text-xl font-black text-white text-center mb-2">Confirm Acceptance</h2>
              <p className="text-sm text-slate-400 text-center mb-6">
                You're accepting the offer from{' '}
                <span className="text-white font-semibold">{showAcceptModal.lender_name}</span> at{' '}
                <span className="text-emerald-400 font-bold">{formatRate(showAcceptModal.interest_rate)}</span>.
                All other bids will be closed.
              </p>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 divide-y divide-slate-800 mb-6">
                {[
                  { label: 'Interest Rate', value: formatRate(showAcceptModal.interest_rate) },
                  {
                    label: 'Monthly EMI',
                    value: formatCurrency(calculateEMI(studentRequest.loan_amount, showAcceptModal.interest_rate, showAcceptModal.tenure_months)),
                  },
                  { label: 'Processing Fee', value: `${showAcceptModal.processing_fee_percent}%` },
                  { label: 'Lender', value: showAcceptModal.lender_name },
                ].map((r) => (
                  <div key={r.label} className="flex justify-between px-4 py-3">
                    <span className="text-sm text-slate-500">{r.label}</span>
                    <span className="text-sm font-bold text-white">{r.value}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAcceptModal(null)}
                  disabled={loading}
                  className="flex-1 rounded-xl border border-slate-700 py-3 text-sm font-semibold text-slate-400 hover:text-white transition-colors disabled:opacity-40"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAccept}
                  disabled={loading}
                  className="flex-1 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white hover:bg-emerald-500 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Accepting…
                    </>
                  ) : (
                    'Confirm & Accept'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
