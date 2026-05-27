'use client';

import { useState } from 'react';
import {
  TrendingDown,
  IndianRupee,
  BarChart3,
  CheckCircle,
  Clock,
  AlertTriangle,
  PieChart,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
} from 'recharts';
import FadeIn from '@/components/animations/FadeIn';
import StatCard from '@/components/ui/StatCard';
import TrustScoreBadge from '@/components/ui/TrustScoreBadge';
import { mockLoanRequests, mockBids } from '@/lib/mockData';
import { formatCurrency, formatRate, calculateEMI } from '@/lib/trustScore';

const bidHistory = [
  { month: 'Nov', bids: 4, disbursed: 2 },
  { month: 'Dec', bids: 7, disbursed: 5 },
  { month: 'Jan', bids: 11, disbursed: 8 },
  { month: 'Feb', bids: 9, disbursed: 7 },
  { month: 'Mar', bids: 15, disbursed: 11 },
  { month: 'Apr', bids: 18, disbursed: 14 },
  { month: 'May', bids: 22, disbursed: 18 },
];

const riskDistribution = [
  { name: 'Ultra-Low Risk', value: 45, color: '#34d399' },
  { name: 'Low Risk', value: 35, color: '#60a5fa' },
  { name: 'Moderate Risk', value: 15, color: '#fbbf24' },
  { name: 'High Risk', value: 5, color: '#f87171' },
];

const activeBids = mockBids.slice(0, 3).map((bid) => {
  const request = mockLoanRequests.find((r) => r.id === bid.loan_request_id)!;
  return { bid, request };
});

const disbursedLoans = [
  { name: 'Riya Kapoor', degree: 'B.Tech, IIT Delhi', amount: 1200000, rate: 8.1, emi: calculateEMI(1200000, 8.1, 84), status: 'Active', nextEmi: '2026-06-01' },
  { name: 'Aditya Verma', degree: 'MBA, IIM Calcutta', amount: 2800000, rate: 7.9, emi: calculateEMI(2800000, 7.9, 60), status: 'Active', nextEmi: '2026-06-01' },
  { name: 'Sneha Rao', degree: 'MBBS, JIPMER', amount: 2100000, rate: 7.4, emi: calculateEMI(2100000, 7.4, 120), status: 'Moratorium', nextEmi: '2027-01-01' },
];

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; dataKey: string }[]; label?: string }) {
  if (!active || !payload) return null;
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-3 shadow-xl">
      <p className="text-xs font-bold text-white mb-2">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="text-xs text-slate-400">
          {p.dataKey === 'bids' ? 'Bids Placed' : 'Disbursed'}: <span className="text-white font-semibold">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

export default function LenderPortfolio() {
  const [activeTab, setActiveTab] = useState<'active' | 'disbursed'>('active');

  const totalDisbursed = disbursedLoans.reduce((s, l) => s + l.amount, 0);
  const totalMonthlyEMI = disbursedLoans.reduce((s, l) => s + l.emi, 0);
  const avgRate = disbursedLoans.reduce((s, l) => s + l.rate, 0) / disbursedLoans.length;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <FadeIn>
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white mb-1">My Portfolio</h1>
          <p className="text-slate-400 text-sm">HDFC Bank · Education Loan Division</p>
        </div>
      </FadeIn>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Disbursed" value={formatCurrency(totalDisbursed)} icon={IndianRupee} accentColor="emerald" delay={0.05} trend={{ value: '18%', positive: true }} />
        <StatCard label="Active Bids" value={String(activeBids.length)} icon={TrendingDown} accentColor="blue" delay={0.1} />
        <StatCard label="Avg. Interest Rate" value={`${avgRate.toFixed(2)}%`} icon={BarChart3} accentColor="violet" delay={0.15} subValue="Across portfolio" />
        <StatCard label="Monthly EMI Inflow" value={formatCurrency(totalMonthlyEMI)} icon={IndianRupee} accentColor="amber" delay={0.2} subValue="Expected this month" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Bid History Chart */}
        <FadeIn delay={0.1} className="lg:col-span-2">
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-bold text-white">Bid Activity</h2>
                <p className="text-xs text-slate-500">Last 7 months</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={bidHistory}>
                <defs>
                  <linearGradient id="bidGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="disbGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="bids" stroke="#3b82f6" strokeWidth={2} fill="url(#bidGrad)" dot={false} />
                <Area type="monotone" dataKey="disbursed" stroke="#34d399" strokeWidth={2} fill="url(#disbGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-400" />
                <span className="text-xs text-slate-500">Bids Placed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-xs text-slate-500">Disbursed</span>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Risk Distribution */}
        <FadeIn delay={0.15}>
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6">
            <h2 className="text-base font-bold text-white mb-1">Risk Distribution</h2>
            <p className="text-xs text-slate-500 mb-6">Portfolio composition</p>
            <div className="flex justify-center mb-4">
              <RePieChart width={160} height={160}>
                <Pie data={riskDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" strokeWidth={2} stroke="#05070a">
                  {riskDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </RePieChart>
            </div>
            <div className="space-y-2">
              {riskDistribution.map((r) => (
                <div key={r.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                    <span className="text-xs text-slate-400">{r.name}</span>
                  </div>
                  <span className="text-xs font-bold text-white">{r.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Loans Table */}
      <FadeIn delay={0.2}>
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 overflow-hidden">
          <div className="flex items-center gap-1 border-b border-slate-800 p-4">
            {(['active', 'disbursed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize transition-colors ${
                  activeTab === tab ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-white'
                }`}
              >
                {tab === 'active' ? 'Active Bids' : 'Disbursed Loans'}
              </button>
            ))}
          </div>

          {activeTab === 'active' && (
            <div className="divide-y divide-slate-800">
              {activeBids.map(({ bid, request }) => (
                <div key={bid.id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-sm font-black text-white">
                        {request.student_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">{request.student_name}</p>
                        <p className="text-xs text-slate-500">{request.degree} · {request.institution}</p>
                      </div>
                    </div>
                  </div>
                  <TrustScoreBadge trustScore={request.trust_score} size="sm" />
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Your Bid</p>
                    <p className="text-lg font-black text-blue-400">{formatRate(bid.interest_rate)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Loan</p>
                    <p className="text-sm font-bold text-white">{formatCurrency(request.loan_amount)}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                    bid.status === 'active'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {bid.status === 'active' ? <CheckCircle className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                    {bid.status === 'active' ? 'Leading' : 'Outbid'}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'disbursed' && (
            <div className="divide-y divide-slate-800">
              {disbursedLoans.map((loan) => (
                <div key={loan.name} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-sm font-black text-white">
                        {loan.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">{loan.name}</p>
                        <p className="text-xs text-slate-500">{loan.degree}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Principal</p>
                    <p className="text-sm font-bold text-white">{formatCurrency(loan.amount)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Rate</p>
                    <p className="text-sm font-bold text-emerald-400">{formatRate(loan.rate)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Monthly EMI</p>
                    <p className="text-sm font-bold text-white">{formatCurrency(loan.emi)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Next EMI</p>
                    <p className="text-xs text-slate-400">{new Date(loan.nextEmi).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                    loan.status === 'Active'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {loan.status === 'Active' ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                    {loan.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </FadeIn>
    </div>
  );
}
