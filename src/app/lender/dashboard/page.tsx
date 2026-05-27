'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Search,
  TrendingDown,
  BarChart3,
  Users,
  IndianRupee,
  SlidersHorizontal,
  Wifi,
  WifiOff,
} from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';
import TrustScoreBadge from '@/components/ui/TrustScoreBadge';
import AuctionTimer from '@/components/ui/AuctionTimer';
import BidModal from '@/components/ui/BidModal';
import StatCard from '@/components/ui/StatCard';
import { mockLoanRequests } from '@/lib/mockData';
import { formatCurrency, formatRate } from '@/lib/trustScore';
import { LoanRequest } from '@/types';
import { createClient } from '@/lib/supabase-browser';

const LENDER_NAME = 'HDFC Bank';

type FilterTier = 'All' | 'Ultra-Low Risk' | 'Low Risk' | 'Moderate Risk' | 'High Risk';
type SortKey = 'trust' | 'amount' | 'rate' | 'bids';

export default function LenderDashboard() {
  const [requests, setRequests] = useState<LoanRequest[]>(mockLoanRequests);
  const [activeBidRequest, setActiveBidRequest] = useState<LoanRequest | null>(null);
  const [search, setSearch] = useState('');
  const [filterTier, setFilterTier] = useState<FilterTier>('All');
  const [sortKey, setSortKey] = useState<SortKey>('trust');
  const [sortAsc, setSortAsc] = useState(false);
  const [isRealtime, setIsRealtime] = useState(false);
  const [newBidFlash, setNewBidFlash] = useState<string | null>(null);
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>['channel']> | null>(null);

  // Supabase Realtime — subscribe to bids table
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel('bids-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'bids' },
        (payload) => {
          const newBid = payload.new as {
            loan_request_id: string;
            interest_rate: number;
          };
          // Update the matching loan request with the new lowest rate
          setRequests((prev) =>
            prev.map((r) => {
              if (r.id === newBid.loan_request_id && newBid.interest_rate < r.current_lowest_rate) {
                setNewBidFlash(r.id);
                setTimeout(() => setNewBidFlash(null), 3000);
                return {
                  ...r,
                  current_lowest_rate: newBid.interest_rate,
                  bid_count: r.bid_count + 1,
                };
              }
              return r;
            })
          );
        }
      )
      .subscribe((status) => {
        setIsRealtime(status === 'SUBSCRIBED');
      });

    channelRef.current = channel;
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filtered = requests
    .filter((r) => {
      const matchSearch =
        r.student_name.toLowerCase().includes(search.toLowerCase()) ||
        r.institution.toLowerCase().includes(search.toLowerCase()) ||
        r.degree.toLowerCase().includes(search.toLowerCase());
      const matchTier = filterTier === 'All' || r.trust_score.tier === filterTier;
      return matchSearch && matchTier;
    })
    .sort((a, b) => {
      let diff = 0;
      if (sortKey === 'trust') diff = a.trust_score.score - b.trust_score.score;
      else if (sortKey === 'amount') diff = a.loan_amount - b.loan_amount;
      else if (sortKey === 'rate') diff = a.current_lowest_rate - b.current_lowest_rate;
      else if (sortKey === 'bids') diff = a.bid_count - b.bid_count;
      return sortAsc ? diff : -diff;
    });

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc((p) => !p);
    else { setSortKey(key); setSortAsc(false); }
  }

  async function handleBidSubmit(requestId: string, newRate: number, processingFee: number, conditions: string) {
    // Optimistic UI update — instant
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId ? { ...r, current_lowest_rate: newRate, bid_count: r.bid_count + 1 } : r
      )
    );
    setActiveBidRequest(null);

    // Background Supabase sync — UI never rolls back on failure
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
      if (error) console.warn('[EduBid] Supabase bid sync failed:', error.message);
    } catch (err) {
      console.warn('[EduBid] Network error during bid sync:', err);
    }
  }

  const totalActiveBids = requests.reduce((sum, r) => sum + r.bid_count, 0);
  const avgTrustScore = Math.round(requests.reduce((sum, r) => sum + r.trust_score.score, 0) / requests.length);
  const totalExposure = requests.reduce((sum, r) => sum + r.loan_amount, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-black text-white">Lender Terminal</h1>
              {/* Realtime indicator */}
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold transition-all ${
                isRealtime
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : 'bg-slate-800 border-slate-700 text-slate-500'
              }`}>
                {isRealtime ? (
                  <><Wifi className="h-3 w-3" /><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />Live</>
                ) : (
                  <><WifiOff className="h-3 w-3" />Connecting...</>
                )}
              </span>
            </div>
            <p className="text-slate-400 text-sm">
              Logged in as <span className="text-white font-semibold">{LENDER_NAME}</span> · {filtered.length} active profiles
            </p>
          </div>
        </div>
      </FadeIn>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Active Student Profiles" value={String(requests.length)} icon={Users} accentColor="blue" delay={0.05} trend={{ value: '12%', positive: true }} />
        <StatCard label="Total Bids Placed" value={String(totalActiveBids)} icon={TrendingDown} accentColor="emerald" delay={0.1} />
        <StatCard label="Avg. Trust Score" value={`${avgTrustScore}/100`} icon={BarChart3} accentColor="violet" delay={0.15} />
        <StatCard label="Total Opportunity" value={formatCurrency(totalExposure)} icon={IndianRupee} accentColor="amber" delay={0.2} subValue="Across all open auctions" />
      </div>

      {/* Filters */}
      <FadeIn delay={0.1}>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student, institution, or degree..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900/50 pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-colors"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['All', 'Ultra-Low Risk', 'Low Risk', 'Moderate Risk'] as FilterTier[]).map((t) => (
              <button
                key={t}
                onClick={() => setFilterTier(t)}
                className={`rounded-xl border px-3 py-2.5 text-xs font-semibold whitespace-nowrap transition-all ${
                  filterTier === t
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Sort bar */}
      <FadeIn delay={0.12}>
        <div className="flex items-center gap-2 mb-6">
          <SlidersHorizontal className="h-4 w-4 text-slate-500" />
          <span className="text-xs text-slate-500 mr-2">Sort by:</span>
          {([['trust', 'Trust Score'], ['amount', 'Loan Amount'], ['rate', 'Current Rate'], ['bids', 'Bid Count']] as [SortKey, string][]).map(([key, label]) => (
            <button key={key} onClick={() => toggleSort(key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${sortKey === key ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-white hover:bg-slate-900'}`}>
              {label} {sortKey === key && (sortAsc ? '↑' : '↓')}
            </button>
          ))}
        </div>
      </FadeIn>

      {/* Student Cards */}
      <div className="space-y-4">
        {filtered.map((request, i) => {
          const isFlashing = newBidFlash === request.id;
          return (
            <FadeIn key={request.id} delay={0.05 + i * 0.04}>
              <div className={`group rounded-2xl border transition-all duration-500 p-6 ${
                isFlashing
                  ? 'border-emerald-500/60 bg-emerald-500/5 shadow-lg shadow-emerald-500/10'
                  : 'border-slate-800/80 bg-slate-900/40 hover:border-slate-700/80'
              }`}>
                {isFlashing && (
                  <div className="flex items-center gap-2 mb-3 text-xs font-bold text-emerald-400 animate-pulse">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    New bid just arrived via real-time update
                  </div>
                )}
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  {/* Student info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-lg font-black text-white">
                        {request.student_name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-white">{request.student_name}</h3>
                          <TrustScoreBadge trustScore={request.trust_score} size="sm" />
                        </div>
                        <p className="text-sm text-slate-400 mt-0.5">{request.degree}</p>
                        <p className="text-xs text-slate-500">{request.institution} · {request.institution_tier}</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-400 mt-4 leading-relaxed line-clamp-2">{request.purpose}</p>
                    {request.co_applicant && (
                      <p className="text-xs text-slate-600 mt-2">
                        Co-applicant: {request.co_applicant.name} ({request.co_applicant.relation}) · {formatCurrency(request.co_applicant.annual_income)}/yr
                      </p>
                    )}
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-4 shrink-0">
                    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                      <p className="text-xs text-slate-500 mb-1">Loan Amount</p>
                      <p className="text-lg font-black text-white">{formatCurrency(request.loan_amount)}</p>
                      <p className="text-xs text-slate-600">{request.tenure_months}mo tenure</p>
                    </div>
                    <div className={`rounded-xl border p-3 transition-all ${isFlashing ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-emerald-500/20 bg-emerald-500/5'}`}>
                      <p className="text-xs text-slate-500 mb-1">Lowest Bid</p>
                      <p className="text-lg font-black text-emerald-400">{formatRate(request.current_lowest_rate)}</p>
                      <p className="text-xs text-slate-600">{request.bid_count} bids</p>
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                      <p className="text-xs text-slate-500 mb-1">Closes</p>
                      <AuctionTimer endsAt={request.auction_ends_at} />
                      <p className="text-xs text-slate-600 mt-1">Auction</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => setActiveBidRequest(request)}
                        className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-500 transition-colors flex items-center justify-center gap-2"
                      >
                        <TrendingDown className="h-4 w-4" />
                        Offer Lower Rate
                      </button>
                      <Link href={`/student/profile/${request.id}`} className="w-full rounded-xl border border-slate-700 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:border-slate-600 transition-colors text-center block">
                        View Full Profile
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          );
        })}

        {filtered.length === 0 && (
          <FadeIn>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-16 text-center">
              <Search className="h-10 w-10 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">No profiles match your filters.</p>
            </div>
          </FadeIn>
        )}
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
