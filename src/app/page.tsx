'use client';

import Link from 'next/link';
import {
  TrendingDown,
  Shield,
  Zap,
  BarChart3,
  ArrowRight,
  CheckCircle,
  Building2,
  GraduationCap,
  ChevronRight,
  Star,
} from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';

const stats = [
  { value: '₹847 Cr', label: 'Disbursed to date', sub: 'Across 1,284 students' },
  { value: '8.4%', label: 'Avg. interest rate', sub: 'vs 12.5% market average' },
  { value: '24', label: 'Lender partners', sub: 'PSU banks, private, NBFCs' },
  { value: '22%', label: 'Avg. rate savings', sub: 'vs traditional loan offers' },
];

const features = [
  {
    icon: Shield,
    title: 'AI Trust Score — Not CIBIL',
    description:
      "Your CIBIL score is zero because you've never borrowed. That's not a risk signal — that's a fresh start. Our model scores your predicted future earnings based on institution tier, course employability data, and verified income of your co-applicant. No credit history required.",
    accent: 'emerald' as const,
    tag: 'Predictive Intelligence',
  },
  {
    icon: TrendingDown,
    title: 'Reverse Auction — Banks Bid Down',
    description:
      "You list your profile once. Banks compete. Each lender must beat the current lowest offer to stay in contention. The auction runs for 7 days. You accept the best offer at the end. No paperwork fog, no negotiation anxiety.",
    accent: 'blue' as const,
    tag: 'Marketplace Mechanics',
  },
  {
    icon: Zap,
    title: 'Verified in 48 Hours',
    description:
      "DigiLocker pulls your mark sheets, admission letter, and bonafide certificate. Account Aggregator pulls co-applicant bank statements with their consent. No courier of documents. No physical branch visit. Full verification in under 48 hours.",
    accent: 'violet' as const,
    tag: 'Instant Verification',
  },
];

const howItWorks = [
  {
    step: '01',
    title: 'Build Your Profile',
    description:
      'Enter your institution, course, and loan amount. Link DigiLocker and Account Aggregator for instant document verification.',
  },
  {
    step: '02',
    title: 'Get AI Trust Scored',
    description:
      'Our model analyzes your predictive earning potential — not your non-existent credit history. Score generated in minutes.',
  },
  {
    step: '03',
    title: 'Auction Opens',
    description:
      'Your profile is listed on the lender marketplace. Banks review your AI score and compete by placing bids with progressively lower rates.',
  },
  {
    step: '04',
    title: 'You Choose and Win',
    description:
      'After 7 days, compare all offers side-by-side — rate, tenure, processing fee, special conditions. Accept the best one. Disbursement in 5 working days.',
  },
];

const testimonials = [
  {
    name: 'Aarav Nair',
    role: 'B.Tech CSE, NIT Calicut',
    content:
      "I was quoted 13.5% by SBI at the branch. Three banks bid on my EduBid profile and I got 9.1% from HDFC. Saved ₹2,800 every single month.",
    savings: '₹2,800/mo saved',
  },
  {
    name: 'Meera Pillai',
    role: 'MBA Finance, IIM Kozhikode',
    content:
      "No CIBIL history at 22 years old. Traditional banks kept rejecting. EduBid's Trust Score of 91 convinced 7 lenders to compete for my profile.",
    savings: '7 competing offers',
  },
  {
    name: 'Kabir Anand',
    role: 'MBBS, Kasturba Medical College',
    content:
      "The auction ended in 5 days with 11 bids. Got 7.4% — almost 5 points below what the hospital branch quoted me. This product is category-defining.",
    savings: '11 bids received',
  },
];

const accentColorMap = {
  emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  violet: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
};

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center dot-pattern">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-blue-600/8 blur-[120px]" />
          <div className="absolute top-1/2 -right-40 h-[400px] w-[400px] rounded-full bg-emerald-600/6 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-4xl">
            <FadeIn delay={0}>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-4 py-1.5 mb-8">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-sm font-medium text-blue-400">
                  India's First Education Loan Reverse Auction
                </span>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.05] mb-6">
                Banks compete.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                  You win.
                </span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed mb-10">
                Stop begging banks for loans. List your profile on EduBid, get AI-scored on your{' '}
                <em>future earning potential</em> — not your non-existent credit history — and watch
                institutional lenders compete to fund your education at the lowest possible interest rate.
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4 mb-16">
                <Link
                  href="/student/onboarding"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-bold text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20"
                >
                  <GraduationCap className="h-5 w-5" />
                  Launch Student Portal
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/lender/dashboard"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/50 px-8 py-4 text-base font-bold text-white hover:border-slate-600 hover:bg-slate-800/50 transition-all"
                >
                  <Building2 className="h-5 w-5 text-slate-400" />
                  Enter Lender Terminal
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="flex flex-wrap items-center gap-6">
                {['RBI Compliant', 'DigiLocker Verified', 'Account Aggregator Enabled', 'ISO 27001'].map(
                  (badge) => (
                    <div key={badge} className="flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                      <span className="text-sm text-slate-500">{badge}</span>
                    </div>
                  )
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-slate-800/80 bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <FadeIn key={stat.label} delay={i * 0.08}>
                <div className="text-center">
                  <p className="text-3xl font-black text-white mb-1">{stat.value}</p>
                  <p className="text-sm font-semibold text-slate-300">{stat.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{stat.sub}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <FadeIn>
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-blue-400 uppercase tracking-widest mb-3">Why EduBid</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">The broken model, finally fixed.</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Every feature is designed to flip the power dynamic — from bank-led gatekeeping to student-led marketplace competition.
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const colors = accentColorMap[feature.accent];
            const Icon = feature.icon;
            return (
              <FadeIn key={feature.title} delay={i * 0.1}>
                <div className="group rounded-2xl border border-slate-800/80 bg-slate-900/40 p-8 hover:border-slate-700/80 transition-all hover:-translate-y-1 duration-300 h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${colors}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-wider rounded-full px-2.5 py-1 border ${colors}`}>
                      {feature.tag}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-900/20 border-y border-slate-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-emerald-400 uppercase tracking-widest mb-3">The Process</p>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">From profile to offer in 7 days.</h2>
              <p className="text-slate-400 max-w-xl mx-auto">
                No branch visits. No relationship managers. No vague timelines. A transparent auction with a clear countdown.
              </p>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item, i) => (
              <FadeIn key={item.step} delay={i * 0.1}>
                <div className="relative rounded-2xl border border-slate-800/80 bg-[#05070a] p-6 h-full">
                  <span className="text-4xl font-black text-slate-800 mb-4 block">{item.step}</span>
                  <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <FadeIn>
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-violet-400 uppercase tracking-widest mb-3">Student Outcomes</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Real students. Real savings.</h2>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <FadeIn key={t.name} delay={i * 0.1}>
              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 h-full flex flex-col">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-6 flex-1">"{t.content}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400">
                    {t.savings}
                  </span>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        <FadeIn>
          <div className="relative rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-950/40 via-slate-900/40 to-emerald-950/20 p-12 text-center overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
            </div>
            <p className="text-sm font-semibold text-blue-400 uppercase tracking-widest mb-4">Get Started Free</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Your education. Your terms.</h2>
            <p className="text-slate-400 max-w-lg mx-auto mb-10">
              Listing your profile is completely free. You only accept an offer when you're ready. No commitment required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/student/onboarding"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-bold text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20"
              >
                <GraduationCap className="h-5 w-5" />
                Start Your Application
              </Link>
              <Link
                href="/lender/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-8 py-4 text-base font-bold text-white hover:border-slate-600 hover:bg-slate-800/50 transition-all"
              >
                <BarChart3 className="h-5 w-5 text-slate-400" />
                Lender Dashboard
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-blue-400" />
              <span className="font-bold text-white">
                Edu<span className="text-blue-400">Bid</span>
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-sm text-slate-500">India's Education Loan Marketplace</span>
            </div>
            <div className="flex items-center gap-6">
              {['Privacy Policy', 'Terms of Service', 'RBI Disclosure', 'Contact'].map((link) => (
                <a key={link} href="#" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                  {link}
                </a>
              ))}
            </div>
          </div>
          <p className="mt-6 text-xs text-slate-600 text-center">
            EduBid is a registered loan aggregator under RBI guidelines. All lending is done by regulated financial
            institutions. Interest rates are indicative and subject to lender approval. DPDP Act 2023 compliant.
          </p>
        </div>
      </footer>
    </div>
  );
}
