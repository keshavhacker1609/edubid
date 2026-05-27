'use client';

import { useState } from 'react';
import {
  Users,
  Building2,
  IndianRupee,
  TrendingDown,
  BarChart3,
  Shield,
  AlertTriangle,
  CheckCircle,
  Eye,
  Flag,
  Search,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import FadeIn from '@/components/animations/FadeIn';
import StatCard from '@/components/ui/StatCard';
import TrustScoreBadge from '@/components/ui/TrustScoreBadge';
import AuctionTimer from '@/components/ui/AuctionTimer';
import { mockLoanRequests, mockLenders, mockAdminStats } from '@/lib/mockData';
import { formatCurrency, formatRate } from '@/lib/trustScore';

const volumeData = [
  { month: 'Nov', applications: 42, disbursed: 28, crore: 18 },
  { month: 'Dec', applications: 61, disbursed: 44, crore: 32 },
  { month: 'Jan', applications: 88, disbursed: 65, crore: 48 },
  { month: 'Feb', applications: 104, disbursed: 79, crore: 61 },
  { month: 'Mar', applications: 142, disbursed: 108, crore: 87 },
  { month: 'Apr', applications: 198, disbursed: 152, crore: 121 },
  { month: 'May', applications: 267, disbursed: 201, crore: 162 },
];

const rateData = [
  { month: 'Nov', avgRate: 11.8, lowestRate: 9.2 },
  { month: 'Dec', avgRate: 11.2, lowestRate: 8.8 },
  { month: 'Jan', avgRate: 10.6, lowestRate: 8.4 },
  { month: 'Feb', avgRate: 10.1, lowestRate: 8.0 },
  { month: 'Mar', avgRate: 9.6, lowestRate: 7.6 },
  { month: 'Apr', avgRate: 9.1, lowestRate: 7.3 },
  { month: 'May', avgRate: 8.4, lowestRate: 7.1 },
];

type AdminTab = 'overview' | 'students' | 'lenders' | 'auctions';

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; dataKey: string; color: string }[]; label?: string }) {
  if (!active || !payload) return null;
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-3 shadow-xl">
      <p className="text-xs font-bold text-white mb-2">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }} className="text-xs">
          {p.dataKey}: <span className="font-semibold">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const [tab, setTab] = useState<AdminTab>('overview');
  const [search, setSearch] = useState('');

  const filteredRequests = mockLoanRequests.filter(
    (r) =>
      r.student_name.toLowerCase().includes(search.toLowerCase()) ||
      r.institution.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-black text-white">Admin Console</h1>
              <span className="rounded-full bg-red-500/10 border border-red-500/20 px-3 py-1 text-xs font-bold text-red-400">
                Super Admin
              </span>
            </div>
            <p className="text-slate-400 text-sm">Platform-wide oversight · EduBid Operations</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-slate-500">All systems operational</span>
          </div>
        </div>
      </FadeIn>

      {/* Tab Nav */}
      <FadeIn delay={0.05}>
        <div className="flex items-center gap-1 border-b border-slate-800 mb-8">
          {(['overview', 'students', 'lenders', 'auctions'] as AdminTab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-t-lg px-5 py-2.5 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${
                tab === t
                  ? 'border-blue-500 text-white'
                  : 'border-transparent text-slate-500 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </FadeIn>

      {tab === 'overview' && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Students" value={mockAdminStats.total_students.toLocaleString()} icon={Users} accentColor="blue" delay={0.05} trend={{ value: '34%', positive: true }} />
            <StatCard label="Active Auctions" value={String(mockAdminStats.active_auctions)} icon={TrendingDown} accentColor="emerald" delay={0.1} />
            <StatCard label="Disbursed (Cr)" value={`₹${mockAdminStats.total_disbursed_crore} Cr`} icon={IndianRupee} accentColor="violet" delay={0.15} trend={{ value: '22%', positive: true }} />
            <StatCard label="Total Bids" value={mockAdminStats.total_bids.toLocaleString()} icon={BarChart3} accentColor="amber" delay={0.2} />
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Volume Chart */}
            <FadeIn delay={0.1} className="lg:col-span-2">
              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6">
                <h2 className="text-base font-bold text-white mb-1">Platform Volume</h2>
                <p className="text-xs text-slate-500 mb-6">Applications vs disbursals (monthly)</p>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={volumeData}>
                    <defs>
                      <linearGradient id="appGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="disbGrad2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Area type="monotone" dataKey="applications" stroke="#3b82f6" strokeWidth={2} fill="url(#appGrad)" dot={false} />
                    <Area type="monotone" dataKey="disbursed" stroke="#34d399" strokeWidth={2} fill="url(#disbGrad2)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </FadeIn>

            {/* Rate Trend */}
            <FadeIn delay={0.15}>
              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6">
                <h2 className="text-base font-bold text-white mb-1">Rate Compression</h2>
                <p className="text-xs text-slate-500 mb-6">Avg & lowest market rate trend</p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={rateData} barSize={8}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[6, 13]} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="avgRate" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="lowestRate" fill="#34d399" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-blue-400" />
                    <span className="text-xs text-slate-500">Avg Rate</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="text-xs text-slate-500">Lowest Rate</span>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Key Metrics */}
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: 'Avg. Bids per Auction', value: `${(mockAdminStats.total_bids / mockAdminStats.total_loan_requests).toFixed(1)}`, icon: TrendingDown, color: 'text-blue-400' },
              { label: 'Avg. Rate Savings', value: `${mockAdminStats.avg_savings_percent}%`, icon: BarChart3, color: 'text-emerald-400', sub: 'vs traditional bank quotes' },
              { label: 'Lender Partners', value: String(mockAdminStats.total_lenders), icon: Building2, color: 'text-violet-400', sub: 'PSU + Private + NBFC' },
            ].map((m, i) => {
              const Icon = m.icon;
              return (
                <FadeIn key={m.label} delay={0.2 + i * 0.05}>
                  <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-5 flex items-center gap-4">
                    <Icon className={`h-8 w-8 ${m.color} shrink-0`} />
                    <div>
                      <p className="text-2xl font-black text-white">{m.value}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{m.label}</p>
                      {m.sub && <p className="text-xs text-slate-600">{m.sub}</p>}
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </>
      )}

      {tab === 'students' && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search students..."
                className="w-full rounded-xl border border-slate-800 bg-slate-900/50 pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
            <span className="text-sm text-slate-500">{filteredRequests.length} profiles</span>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Student</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Trust Score</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Best Rate</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Bids</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredRequests.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-semibold text-white text-sm">{r.student_name}</p>
                          <p className="text-xs text-slate-500">{r.institution}</p>
                          <p className="text-xs text-slate-600">{r.degree}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <TrustScoreBadge trustScore={r.trust_score} size="sm" />
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-white">{formatCurrency(r.loan_amount)}</p>
                        <p className="text-xs text-slate-500">{r.tenure_months}mo</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-emerald-400">{formatRate(r.current_lowest_rate)}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-white">{r.bid_count}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                          r.status === 'open'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}>
                          {r.status === 'open' ? <CheckCircle className="h-3 w-3" /> : <Shield className="h-3 w-3" />}
                          {r.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button className="rounded-lg p-1.5 text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="rounded-lg p-1.5 text-slate-500 hover:text-amber-400 hover:bg-amber-500/10 transition-colors">
                            <Flag className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'lenders' && (
        <div className="space-y-4">
          {mockLenders.map((lender, i) => (
            <FadeIn key={lender.id} delay={i * 0.05}>
              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-lg font-black text-white">
                  {lender.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-white">{lender.name}</p>
                    <span className="rounded-full bg-slate-800 border border-slate-700 px-2.5 py-0.5 text-xs font-semibold text-slate-400">{lender.type}</span>
                    <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-400">{lender.rating}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Total Disbursed</p>
                    <p className="text-sm font-bold text-white">₹{lender.total_disbursed_crore.toLocaleString()} Cr</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Active Bids</p>
                    <p className="text-sm font-bold text-blue-400">{lender.active_bids}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="rounded-lg p-1.5 text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="rounded-lg p-1.5 text-slate-500 hover:text-amber-400 hover:bg-amber-500/10 transition-colors">
                      <AlertTriangle className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      )}

      {tab === 'auctions' && (
        <div className="space-y-4">
          {mockLoanRequests.map((r, i) => (
            <FadeIn key={r.id} delay={i * 0.04}>
              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-white">{r.student_name}</p>
                    <TrustScoreBadge trustScore={r.trust_score} size="sm" />
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5">{r.degree} · {r.institution}</p>
                </div>
                <div className="grid grid-cols-4 gap-4 text-right">
                  <div>
                    <p className="text-xs text-slate-500">Amount</p>
                    <p className="text-sm font-bold text-white">{formatCurrency(r.loan_amount)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Best Bid</p>
                    <p className="text-sm font-bold text-emerald-400">{formatRate(r.current_lowest_rate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Bids</p>
                    <p className="text-sm font-bold text-white">{r.bid_count}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Closes</p>
                    <AuctionTimer endsAt={r.auction_ends_at} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white hover:border-slate-600 transition-colors">
                    Pause
                  </button>
                  <button className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors">
                    Close
                  </button>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  );
}
