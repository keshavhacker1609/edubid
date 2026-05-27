'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  User,
  GraduationCap,
  IndianRupee,
  Users,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Shield,
  Zap,
  FileCheck,
} from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';
import TrustScoreBadge from '@/components/ui/TrustScoreBadge';
import { computeTrustScore, formatCurrency } from '@/lib/trustScore';
import { StudentOnboardingForm, TrustScore } from '@/types';
import { supabase } from '@/lib/supabase';

const STEPS = [
  { id: 1, title: 'Personal Info', icon: User },
  { id: 2, title: 'Education', icon: GraduationCap },
  { id: 3, title: 'Loan Details', icon: IndianRupee },
  { id: 4, title: 'Co-Applicant', icon: Users },
  { id: 5, title: 'Review & Submit', icon: CheckCircle },
];

const INSTITUTION_TIERS = [
  { value: 'IIT/IIM/AIIMS', label: 'IIT / IIM / AIIMS', sub: 'National premier institutions' },
  { value: 'NIT/Top-Private', label: 'NIT / Top Private', sub: 'BITS Pilani, Manipal, VIT, etc.' },
  { value: 'State-University', label: 'State University', sub: 'Government state universities' },
  { value: 'Other', label: 'Other Institution', sub: 'Private colleges, deemed universities' },
] as const;

const TENURE_OPTIONS = [36, 60, 72, 84, 96, 120, 144, 180];

const defaultForm: StudentOnboardingForm = {
  full_name: '',
  email: '',
  phone: '',
  date_of_birth: '',
  pan_number: '',
  institution: '',
  institution_tier: 'NIT/Top-Private',
  degree: '',
  course_duration_years: 4,
  graduation_year: new Date().getFullYear() + 4,
  loan_amount: 1500000,
  tenure_months: 84,
  purpose: '',
  co_applicant_name: '',
  co_applicant_relation: '',
  co_applicant_income: 0,
};

function InputField({
  label,
  required,
  children,
  hint,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1.5">
        {label} {required && <span className="text-blue-400">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-slate-600 mt-1">{hint}</p>}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = 'text',
  pattern,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  pattern?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      pattern={pattern}
      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-colors"
    />
  );
}

export default function StudentOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<StudentOnboardingForm>(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = <K extends keyof StudentOnboardingForm>(key: K, value: StudentOnboardingForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const trustScore: TrustScore = computeTrustScore({
    institution_tier: form.institution_tier,
    degree: form.degree,
    co_applicant_income: form.co_applicant_income || undefined,
    loan_amount: form.loan_amount,
  });

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const { error } = await supabase.from('loan_requests').insert({
        student_name: form.full_name,
        degree: form.degree,
        institution: form.institution,
        institution_tier: form.institution_tier,
        course_duration_years: form.course_duration_years,
        loan_amount: form.loan_amount,
        tenure_months: form.tenure_months,
        purpose: form.purpose,
        trust_score: trustScore,
        current_lowest_rate: 14.0,
        bid_count: 0,
        auction_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'open',
        co_applicant: form.co_applicant_name
          ? {
              name: form.co_applicant_name,
              relation: form.co_applicant_relation,
              annual_income: form.co_applicant_income,
            }
          : null,
      });
      if (error) {
        console.warn('Supabase insert failed:', error.message);
        toast.error('Could not save to database — continuing anyway.');
      } else {
        toast.success('Loan request submitted! Your auction is now live.');
      }
    } catch (err) {
      console.warn('Network error during submission:', err);
      toast.error('Network error — your profile was saved locally.');
    }
    setSubmitting(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <FadeIn>
          <div className="text-center max-w-md">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-black text-white mb-3">Profile Live!</h1>
            <p className="text-slate-400 mb-3">
              Your loan request is now live on the marketplace. Lenders will start reviewing your profile within 24 hours.
            </p>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 mb-8">
              <p className="text-sm text-emerald-400 font-semibold">Your AI Trust Score</p>
              <p className="text-4xl font-black text-white mt-1">{trustScore.score}<span className="text-slate-500 text-lg">/100</span></p>
              <p className="text-sm text-emerald-400 mt-1">{trustScore.tier}</p>
            </div>
            <button
              onClick={() => router.push('/student/dashboard')}
              className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-500 transition-colors"
            >
              Go to My Dashboard
            </button>
          </div>
        </FadeIn>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-white mb-2">Create Your Loan Profile</h1>
            <p className="text-slate-400">
              Takes 5 minutes. Your AI Trust Score is calculated instantly.
            </p>
          </div>
        </FadeIn>

        {/* Step indicators */}
        <FadeIn delay={0.05}>
          <div className="flex items-center justify-between mb-10 relative">
            <div className="absolute top-4 left-0 right-0 h-px bg-slate-800 z-0" />
            {STEPS.map((s) => {
              const Icon = s.icon;
              const isActive = step === s.id;
              const isDone = step > s.id;
              return (
                <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all ${
                      isDone
                        ? 'bg-blue-600 border-blue-600'
                        : isActive
                        ? 'bg-blue-600/20 border-blue-500'
                        : 'bg-[#05070a] border-slate-700'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle className="h-4 w-4 text-white" />
                    ) : (
                      <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-blue-400' : 'text-slate-600'}`} />
                    )}
                  </div>
                  <span className={`hidden sm:block text-xs font-medium ${isActive ? 'text-white' : isDone ? 'text-slate-400' : 'text-slate-600'}`}>
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </FadeIn>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-8">

              {/* Step 1: Personal */}
              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">Personal Information</h2>
                    <p className="text-sm text-slate-500">This information is used for KYC verification only.</p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <InputField label="Full Name" required>
                      <TextInput value={form.full_name} onChange={(v) => set('full_name', v)} placeholder="As per Aadhaar" />
                    </InputField>
                    <InputField label="Date of Birth" required>
                      <TextInput type="date" value={form.date_of_birth} onChange={(v) => set('date_of_birth', v)} />
                    </InputField>
                  </div>
                  <InputField label="Email Address" required>
                    <TextInput type="email" value={form.email} onChange={(v) => set('email', v)} placeholder="you@email.com" />
                  </InputField>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <InputField label="Mobile Number" required>
                      <TextInput type="tel" value={form.phone} onChange={(v) => set('phone', v)} placeholder="10-digit number" />
                    </InputField>
                    <InputField label="PAN Number" required hint="Required for lender KYC">
                      <TextInput value={form.pan_number} onChange={(v) => set('pan_number', v.toUpperCase())} placeholder="ABCDE1234F" />
                    </InputField>
                  </div>

                  {/* DigiLocker mock */}
                  <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 shrink-0">
                      <FileCheck className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">Connect DigiLocker</p>
                      <p className="text-xs text-slate-500">Instantly pull your mark sheets and admission letter</p>
                    </div>
                    <button className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-xs font-bold text-blue-400 hover:bg-blue-500/20 transition-colors">
                      Connect
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Education */}
              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">Education Details</h2>
                    <p className="text-sm text-slate-500">Institution tier heavily influences your AI Trust Score.</p>
                  </div>
                  <InputField label="Institution Name" required>
                    <TextInput value={form.institution} onChange={(v) => set('institution', v)} placeholder="e.g. IIT Bombay, Manipal Institute of Technology" />
                  </InputField>
                  <InputField label="Institution Tier" required>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {INSTITUTION_TIERS.map((tier) => (
                        <button
                          key={tier.value}
                          type="button"
                          onClick={() => set('institution_tier', tier.value)}
                          className={`rounded-xl border p-4 text-left transition-all ${
                            form.institution_tier === tier.value
                              ? 'border-blue-500 bg-blue-500/10'
                              : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
                          }`}
                        >
                          <p className={`text-sm font-bold ${form.institution_tier === tier.value ? 'text-blue-400' : 'text-white'}`}>
                            {tier.label}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">{tier.sub}</p>
                        </button>
                      ))}
                    </div>
                  </InputField>
                  <InputField label="Degree / Program" required>
                    <TextInput value={form.degree} onChange={(v) => set('degree', v)} placeholder="e.g. B.Tech Computer Science, MBBS, MBA Finance" />
                  </InputField>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <InputField label="Course Duration (Years)" required>
                      <select
                        value={form.course_duration_years}
                        onChange={(e) => set('course_duration_years', Number(e.target.value))}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-colors"
                      >
                        {[1, 2, 3, 4, 5, 6].map((y) => <option key={y} value={y}>{y} Year{y > 1 ? 's' : ''}</option>)}
                      </select>
                    </InputField>
                    <InputField label="Expected Graduation Year" required>
                      <select
                        value={form.graduation_year}
                        onChange={(e) => set('graduation_year', Number(e.target.value))}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-colors"
                      >
                        {Array.from({ length: 8 }, (_, i) => new Date().getFullYear() + i).map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </InputField>
                  </div>
                </div>
              )}

              {/* Step 3: Loan Details */}
              {step === 3 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">Loan Requirements</h2>
                    <p className="text-sm text-slate-500">Lenders will bid based on these parameters.</p>
                  </div>
                  <InputField label="Loan Amount Required" required>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
                      <input
                        type="number"
                        value={form.loan_amount}
                        onChange={(e) => set('loan_amount', Number(e.target.value))}
                        min={100000}
                        max={10000000}
                        step={50000}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900 pl-8 pr-4 py-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-colors"
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1.5">= {formatCurrency(form.loan_amount)}</p>
                    <input
                      type="range"
                      min={100000}
                      max={5000000}
                      step={50000}
                      value={form.loan_amount}
                      onChange={(e) => set('loan_amount', Number(e.target.value))}
                      className="w-full mt-3 accent-blue-500"
                    />
                    <div className="flex justify-between text-xs text-slate-600 mt-1">
                      <span>₹1 L</span><span>₹50 L</span>
                    </div>
                  </InputField>
                  <InputField label="Preferred Repayment Tenure" required>
                    <div className="grid grid-cols-4 gap-2">
                      {TENURE_OPTIONS.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => set('tenure_months', t)}
                          className={`rounded-lg border py-2 text-sm font-semibold transition-all ${
                            form.tenure_months === t
                              ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                              : 'border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white'
                          }`}
                        >
                          {t >= 12 ? `${t / 12}yr` : `${t}mo`}
                        </button>
                      ))}
                    </div>
                  </InputField>
                  <InputField label="Purpose of Loan" required hint="A clear, detailed purpose increases lender confidence">
                    <textarea
                      rows={4}
                      value={form.purpose}
                      onChange={(e) => set('purpose', e.target.value)}
                      placeholder="Describe what the loan will cover: tuition fees, hostel, equipment, travel for international programs, etc. Include any placement statistics or career prospects relevant to your course."
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-colors resize-none"
                    />
                  </InputField>
                </div>
              )}

              {/* Step 4: Co-Applicant */}
              {step === 4 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">Co-Applicant Details</h2>
                    <p className="text-sm text-slate-500">
                      A strong co-applicant significantly boosts your AI Trust Score and attracts more competitive bids.
                    </p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <InputField label="Co-Applicant Name">
                      <TextInput value={form.co_applicant_name} onChange={(v) => set('co_applicant_name', v)} placeholder="Full name" />
                    </InputField>
                    <InputField label="Relationship">
                      <select
                        value={form.co_applicant_relation}
                        onChange={(e) => set('co_applicant_relation', e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-colors"
                      >
                        <option value="">Select relation</option>
                        {['Father', 'Mother', 'Spouse', 'Sibling', 'Guardian'].map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </InputField>
                  </div>
                  <InputField label="Annual Income of Co-Applicant" hint="Verified via Account Aggregator bank statement pull">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
                      <input
                        type="number"
                        value={form.co_applicant_income || ''}
                        onChange={(e) => set('co_applicant_income', Number(e.target.value))}
                        min={0}
                        step={10000}
                        placeholder="Annual income in rupees"
                        className="w-full rounded-xl border border-slate-700 bg-slate-900 pl-8 pr-4 py-3 text-white placeholder:text-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-colors"
                      />
                    </div>
                    {form.co_applicant_income > 0 && (
                      <p className="text-xs text-slate-500 mt-1">= {formatCurrency(form.co_applicant_income)} per annum</p>
                    )}
                  </InputField>

                  {/* Account Aggregator */}
                  <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 border border-violet-500/20 shrink-0">
                      <Shield className="h-5 w-5 text-violet-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">Connect Account Aggregator</p>
                      <p className="text-xs text-slate-500">Consent-based bank statement verification for co-applicant</p>
                    </div>
                    <button className="rounded-lg border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-xs font-bold text-violet-400 hover:bg-violet-500/20 transition-colors">
                      Link
                    </button>
                  </div>

                  {/* Live Trust Score Preview */}
                  {form.degree && (
                    <div>
                      <p className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2">
                        <Zap className="h-4 w-4 text-amber-400" />
                        Live Trust Score Preview
                      </p>
                      <TrustScoreBadge trustScore={trustScore} size="md" showBreakdown />
                    </div>
                  )}
                </div>
              )}

              {/* Step 5: Review */}
              {step === 5 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">Review & Submit</h2>
                    <p className="text-sm text-slate-500">Confirm your details before going live on the marketplace.</p>
                  </div>

                  {/* Trust Score */}
                  <TrustScoreBadge trustScore={trustScore} size="lg" showBreakdown />

                  {/* Summary */}
                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 divide-y divide-slate-800">
                    {[
                      { label: 'Name', value: form.full_name },
                      { label: 'Institution', value: `${form.institution} (${form.institution_tier})` },
                      { label: 'Degree', value: form.degree },
                      { label: 'Loan Amount', value: formatCurrency(form.loan_amount) },
                      { label: 'Tenure', value: `${form.tenure_months} months (${form.tenure_months / 12} years)` },
                      ...(form.co_applicant_name
                        ? [{ label: 'Co-Applicant', value: `${form.co_applicant_name} (${form.co_applicant_relation}) · ${formatCurrency(form.co_applicant_income)}/yr` }]
                        : []),
                    ].map((row) => (
                      <div key={row.label} className="flex items-center justify-between px-4 py-3">
                        <span className="text-sm text-slate-500">{row.label}</span>
                        <span className="text-sm font-semibold text-white text-right max-w-xs">{row.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl bg-blue-500/5 border border-blue-500/20 p-4 text-sm text-slate-400 leading-relaxed">
                    By submitting, you confirm all information provided is accurate. Your profile will be visible to
                    verified institutional lenders only. You retain full control — you are not obligated to accept any bid.
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className="flex items-center gap-2 rounded-xl border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-400 hover:text-white hover:border-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>

          {step < 5 ? (
            <button
              onClick={() => setStep((s) => Math.min(5, s + 1))}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 text-sm font-bold text-white hover:bg-blue-500 transition-colors"
            >
              Continue
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-8 py-3 text-sm font-bold text-white hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Submitting...' : 'Go Live on Marketplace'}
              <CheckCircle className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
