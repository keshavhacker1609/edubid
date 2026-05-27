'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  TrendingDown, LogOut, User, ChevronDown,
  GraduationCap, Building2, Shield, Menu, X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const pathname = usePathname();
  const { user, role, loading, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => pathname.startsWith(path);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const roleIcon = role === 'student' ? GraduationCap : role === 'lender' ? Building2 : Shield;
  const RoleIcon = roleIcon;
  const roleLabel = role ? role.charAt(0).toUpperCase() + role.slice(1) : '';

  const navLinks = [
    { href: '/', label: 'Home', show: true, exact: true },
    { href: '/student/dashboard', label: 'Student', show: !user || role === 'student', exact: false },
    { href: '/lender/dashboard', label: 'Lender', show: !user || role === 'lender', exact: false },
    { href: '/admin/dashboard', label: 'Admin', show: !user || role === 'admin', exact: false },
  ].filter((l) => l.show);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/80 bg-[#05070a]/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/15 border border-blue-400/30 group-hover:bg-blue-500/25 group-hover:border-blue-400/50 transition-all duration-300"
              style={{ boxShadow: '0 0 16px rgba(96,165,250,0.25), inset 0 0 12px rgba(96,165,250,0.08)' }}
            >
              <TrendingDown className="h-4 w-4 text-blue-400 drop-shadow-[0_0_6px_rgba(96,165,250,0.9)]" />
            </div>
            <span className="text-xl font-black tracking-tight">
              <span className="text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]">Edu</span>
              <span
                className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent"
                style={{ filter: 'drop-shadow(0 0 8px rgba(96,165,250,0.8)) drop-shadow(0 0 20px rgba(96,165,250,0.4))' }}
              >Bid</span>
            </span>
          </Link>

          {/* ── Desktop nav links ── */}
          <div className="hidden sm:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = link.exact ? pathname === link.href : isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    active ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* ── Right side ── */}
          <div className="flex items-center gap-2">
            {loading ? (
              <div className="h-8 w-20 rounded-lg bg-slate-800 animate-pulse" />
            ) : user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((p) => !p)}
                  className="flex items-center gap-2.5 rounded-xl border border-slate-700 bg-slate-900/50 px-3 py-2 hover:border-slate-600 transition-colors"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 border border-blue-500/30">
                    <RoleIcon className="h-3 w-3 text-blue-400" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-semibold text-white leading-none">
                      {user.user_metadata?.full_name?.split(' ')[0] ?? user.email?.split('@')[0]}
                    </p>
                    <p className="text-[10px] text-slate-500 capitalize">{roleLabel}</p>
                  </div>
                  <ChevronDown className={`h-3.5 w-3.5 text-slate-500 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-800 bg-[#0d1117] shadow-xl shadow-black/50 overflow-hidden z-50"
                    >
                      <div className="border-b border-slate-800 px-4 py-3">
                        <p className="text-sm font-semibold text-white truncate">
                          {user.user_metadata?.full_name ?? 'User'}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>
                      <div className="p-1">
                        {role === 'student' && (
                          <>
                            <Link href="/student/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors">
                              <GraduationCap className="h-4 w-4" /> My Dashboard
                            </Link>
                            <Link href="/student/onboarding" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors">
                              <User className="h-4 w-4" /> Edit Profile
                            </Link>
                          </>
                        )}
                        {role === 'lender' && (
                          <>
                            <Link href="/lender/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors">
                              <Building2 className="h-4 w-4" /> Lender Terminal
                            </Link>
                            <Link href="/lender/portfolio" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors">
                              <TrendingDown className="h-4 w-4" /> My Portfolio
                            </Link>
                          </>
                        )}
                      </div>
                      <div className="border-t border-slate-800 p-1">
                        <button
                          onClick={() => { setMenuOpen(false); signOut(); }}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut className="h-4 w-4" /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/auth/login" className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-500 transition-colors">
                  Get Started
                </Link>
              </div>
            )}

            {/* ── Mobile hamburger ── */}
            <button
              onClick={() => setMobileOpen((p) => !p)}
              className="sm:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/50 text-slate-400 hover:text-white transition-colors"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden border-t border-slate-800/80 bg-[#05070a]/95 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => {
                const active = link.exact ? pathname === link.href : isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                      active ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {!user && (
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <Link href="/auth/login" className="flex items-center justify-center rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-300 hover:text-white transition-colors">
                    Sign In
                  </Link>
                  <Link href="/auth/signup" className="flex items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-500 transition-colors">
                    Get Started
                  </Link>
                </div>
              )}

              {user && (
                <div className="pt-3 border-t border-slate-800">
                  <div className="flex items-center gap-3 px-4 py-3 mb-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 border border-blue-500/30">
                      <RoleIcon className="h-4 w-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {user.user_metadata?.full_name ?? user.email?.split('@')[0]}
                      </p>
                      <p className="text-xs text-slate-500 capitalize">{roleLabel}</p>
                    </div>
                  </div>
                  <button
                    onClick={signOut}
                    className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
