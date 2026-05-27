'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingDown, Mail, Lock, Eye, EyeOff, AlertCircle,
  Loader2, User, GraduationCap, Building2, CheckCircle, Phone,
} from 'lucide-react';
import { createClient } from '@/lib/supabase-browser';
import { UserRole } from '@/context/AuthContext';

type Step = 'role' | 'details' | 'success';

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('role');
  const [role, setRole] = useState<Exclude<UserRole, null | 'admin'>>('student');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone, role },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setStep('success');
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 dot-pattern">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-blue-600/8 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20">
              <TrendingDown className="h-5 w-5 text-blue-400" />
            </div>
            <span className="text-2xl font-black text-white">Edu<span className="text-blue-400">Bid</span></span>
          </div>
          <h1 className="text-2xl font-black text-white mb-2">Create your account</h1>
          <p className="text-slate-400 text-sm">Join India's education loan marketplace</p>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-8 backdrop-blur-sm">
          <AnimatePresence mode="wait">

            {/* Step 1: Role Selection */}
            {step === 'role' && (
              <motion.div key="role" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <p className="text-sm font-medium text-slate-400 mb-4 text-center">I am joining as a</p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {([
                    { value: 'student', label: 'Student', sub: 'I need an education loan', icon: GraduationCap, accent: 'blue' },
                    { value: 'lender', label: 'Lender', sub: 'I want to fund students', icon: Building2, accent: 'emerald' },
                  ] as const).map((r) => {
                    const Icon = r.icon;
                    const isSelected = role === r.value;
                    return (
                      <button
                        key={r.value}
                        onClick={() => setRole(r.value)}
                        className={`rounded-2xl border-2 p-6 text-center transition-all ${
                          isSelected
                            ? r.accent === 'blue'
                              ? 'border-blue-500 bg-blue-500/10'
                              : 'border-emerald-500 bg-emerald-500/10'
                            : 'border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        <Icon className={`h-8 w-8 mx-auto mb-3 ${
                          isSelected
                            ? r.accent === 'blue' ? 'text-blue-400' : 'text-emerald-400'
                            : 'text-slate-500'
                        }`} />
                        <p className={`font-bold text-base ${isSelected ? 'text-white' : 'text-slate-400'}`}>{r.label}</p>
                        <p className="text-xs text-slate-500 mt-1">{r.sub}</p>
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setStep('details')}
                  className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-500 transition-colors"
                >
                  Continue as {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
                <p className="text-center text-sm text-slate-500 mt-4">
                  Already have an account?{' '}
                  <Link href="/auth/login" className="text-blue-400 font-semibold hover:text-blue-300">Sign in</Link>
                </p>
              </motion.div>
            )}

            {/* Step 2: Account Details */}
            {step === 'details' && (
              <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <button onClick={() => setStep('role')} className="text-xs text-slate-500 hover:text-white mb-5 flex items-center gap-1 transition-colors">
                  ← Back
                </button>
                <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold mb-5 ${
                  role === 'student' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                }`}>
                  {role === 'student' ? <GraduationCap className="h-3 w-3" /> : <Building2 className="h-3 w-3" />}
                  Signing up as {role}
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      {role === 'lender' ? 'Bank / Institution Name' : 'Full Name'}
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required
                        placeholder={role === 'lender' ? 'e.g. HDFC Bank — Education Division' : 'As per Aadhaar'}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900 pl-10 pr-4 py-3 text-white placeholder:text-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Email address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                        placeholder="you@email.com"
                        className="w-full rounded-xl border border-slate-700 bg-slate-900 pl-10 pr-4 py-3 text-white placeholder:text-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Mobile number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                        placeholder="10-digit mobile"
                        className="w-full rounded-xl border border-slate-700 bg-slate-900 pl-10 pr-4 py-3 text-white placeholder:text-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required
                        placeholder="Min. 8 characters"
                        className="w-full rounded-xl border border-slate-700 bg-slate-900 pl-10 pr-12 py-3 text-white placeholder:text-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-colors"
                      />
                      <button type="button" onClick={() => setShowPassword((p) => !p)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <div className="flex gap-1 mt-2">
                      {[4, 6, 8].map((len) => (
                        <div key={len} className={`h-1 flex-1 rounded-full transition-colors ${password.length >= len ? 'bg-blue-500' : 'bg-slate-800'}`} />
                      ))}
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      {password.length === 0 ? '' : password.length < 6 ? 'Weak' : password.length < 8 ? 'Getting stronger' : 'Strong ✓'}
                    </p>
                  </div>

                  {error && (
                    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3">
                      <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                      <p className="text-sm text-red-400">{error}</p>
                    </motion.div>
                  )}

                  <button type="submit" disabled={loading}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {loading ? 'Creating account...' : 'Create Account'}
                  </button>
                </form>
              </motion.div>
            )}

            {/* Step 3: Success */}
            {step === 'success' && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 mx-auto mb-5">
                  <CheckCircle className="h-8 w-8 text-emerald-400" />
                </div>
                <h2 className="text-xl font-black text-white mb-2">Check your email</h2>
                <p className="text-sm text-slate-400 mb-6">
                  We sent a confirmation link to <span className="text-white font-semibold">{email}</span>.
                  Click the link to activate your account.
                </p>
                <button
                  onClick={() => router.push('/auth/login')}
                  className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-500 transition-colors"
                >
                  Go to Sign In
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
