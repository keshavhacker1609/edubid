'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TrendingDown, Zap, LogOut, User, ChevronDown, GraduationCap, Building2, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const pathname = usePathname();
  const { user, role, loading, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => pathname.startsWith(path);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const roleIcon = role === 'student' ? GraduationCap : role === 'lender' ? Building2 : Shield;
  const RoleIcon = roleIcon;
  const roleLabel = role ? role.charAt(0).toUpperCase() + role.slice(1) : '';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/80 bg-[#05070a]/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
              <TrendingDown className="h-4 w-4 text-blue-400" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              Edu<span className="text-blue-400">Bid</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
              <Zap className="h-2.5 w-2.5" />
              Live
            </span>
          </Link>

          {/* Nav links */}
          <div className="hidden sm:flex items-center gap-1">
            <Link href="/" className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${pathname === '/' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}>
              Home
            </Link>
            {(!user || role === 'student') && (
              <Link href="/student/dashboard" className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${isActive('/student') ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}>
                Student
              </Link>
            )}
            {(!user || role === 'lender') && (
              <Link href="/lender/dashboard" className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${isActive('/lender') ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}>
                Lender
              </Link>
            )}
            {(!user || role === 'admin') && (
              <Link href="/admin/dashboard" className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${isActive('/admin') ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}>
                Admin
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
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
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login" className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-500 transition-colors">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
