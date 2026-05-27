'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, TrendingDown, Calculator, CheckCircle } from 'lucide-react';
import { LoanRequest } from '@/types';
import { formatCurrency, calculateEMI } from '@/lib/trustScore';

interface BidModalProps {
  request: LoanRequest | null;
  lenderName: string;
  onClose: () => void;
  onSubmit: (requestId: string, newRate: number, processingFee: number, conditions: string) => void;
}

export default function BidModal({ request, lenderName, onClose, onSubmit }: BidModalProps) {
  const [rate, setRate] = useState('');
  const [processingFee, setProcessingFee] = useState('0.5');
  const [conditions, setConditions] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (request) {
      setRate('');
      setError('');
    }
  }, [request]);

  if (!request) return null;

  const rateNum = parseFloat(rate);
  const feeNum = parseFloat(processingFee) || 0;
  const isValid = !isNaN(rateNum) && rateNum < request.current_lowest_rate && rateNum > 3;
  const emi = isValid ? calculateEMI(request.loan_amount, rateNum, request.tenure_months) : null;
  const currentEMI = calculateEMI(request.loan_amount, request.current_lowest_rate, request.tenure_months);
  const savings = emi ? currentEMI - emi : 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isNaN(rateNum) || rateNum <= 0) {
      setError('Please enter a valid interest rate.');
      return;
    }
    if (rateNum >= request!.current_lowest_rate) {
      setError(`Rate must be lower than the current best offer of ${request!.current_lowest_rate}% p.a.`);
      return;
    }
    if (rateNum < 3) {
      setError('Rate cannot be below 3% p.a. (RBI floor).');
      return;
    }
    onSubmit(request!.id, rateNum, feeNum, conditions);
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-[#0d1117] shadow-2xl shadow-black/50"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-800 p-6">
            <div>
              <h2 className="text-lg font-bold text-white">Place Competitive Bid</h2>
              <p className="text-sm text-slate-400 mt-0.5">
                Bidding as <span className="text-blue-400 font-medium">{lenderName}</span> for {request.student_name}
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Current best */}
          <div className="mx-6 mt-4 rounded-xl bg-blue-500/5 border border-blue-500/20 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 mb-1">Current Lowest Rate</p>
                <p className="text-2xl font-black text-blue-400">{request.current_lowest_rate}% p.a.</p>
                <p className="text-xs text-slate-500 mt-1">EMI: {formatCurrency(currentEMI)}/mo</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 mb-1">Loan Amount</p>
                <p className="text-lg font-bold text-white">{formatCurrency(request.loan_amount)}</p>
                <p className="text-xs text-slate-500 mt-1">{request.tenure_months} months tenure</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Rate input */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Your Interest Rate (% p.a.)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.05"
                  min="3"
                  max={request.current_lowest_rate - 0.01}
                  value={rate}
                  onChange={(e) => { setRate(e.target.value); setError(''); }}
                  placeholder={`Must be below ${request.current_lowest_rate}%`}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-colors pr-12"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">% p.a.</span>
              </div>
            </div>

            {/* Processing fee */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Processing Fee (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="2"
                value={processingFee}
                onChange={(e) => setProcessingFee(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-colors"
              />
            </div>

            {/* Special conditions */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Special Conditions <span className="text-slate-600 font-normal">(optional)</span>
              </label>
              <textarea
                rows={2}
                value={conditions}
                onChange={(e) => setConditions(e.target.value)}
                placeholder="e.g. No prepayment penalty after 12 EMIs, moratorium during course..."
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-colors resize-none"
              />
            </div>

            {/* Live EMI preview */}
            {isValid && emi && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Calculator className="h-4 w-4 text-emerald-400" />
                  <p className="text-sm font-semibold text-emerald-400">Live EMI Preview</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs text-slate-500">Your Rate</p>
                    <p className="text-lg font-black text-white">{rateNum}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Monthly EMI</p>
                    <p className="text-lg font-black text-emerald-400">{formatCurrency(emi)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Student Saves</p>
                    <p className="text-lg font-black text-emerald-400">{formatCurrency(savings)}/mo</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3"
              >
                <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
                <p className="text-sm text-red-400">{error}</p>
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-slate-700 bg-transparent py-3 text-sm font-semibold text-slate-400 hover:text-white hover:border-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isValid}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <TrendingDown className="h-4 w-4" />
                Submit Bid
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
