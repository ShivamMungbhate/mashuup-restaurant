'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldLock, KeyRound, Mail, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      router.push(from);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full glass-card p-8 rounded-3xl border border-amber-500/30 shadow-2xl space-y-6">
      {/* Header Icon */}
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl gold-gradient-bg flex items-center justify-center text-zinc-950 mx-auto shadow-xl shadow-amber-500/25 mb-4">
          <ShieldLock className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-black text-white uppercase tracking-tight">
          Owner <span className="gold-gradient-text">Portal</span>
        </h1>
        <p className="text-xs text-amber-200/70 font-light mt-1">
          Log in to manage Mashuup restaurant menu, details, gallery, and hours
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-200/80 mb-1">
            Admin Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your admin email"
              className="w-full bg-zinc-950/90 border border-amber-500/30 rounded-xl pl-10 pr-4 py-3 text-xs text-amber-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-200/80 mb-1">
            Password
          </label>
          <div className="relative">
            <KeyRound className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-zinc-950/90 border border-amber-500/30 rounded-xl pl-10 pr-10 py-3 text-xs text-amber-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition font-mono"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-amber-300"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-950 gold-gradient-bg shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-50"
        >
          {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#0f140e] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Back to website button */}
      <Link
        href="/"
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs font-semibold text-amber-300/80 hover:text-amber-200 px-4 py-2 rounded-full glass-card border-amber-500/20"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Public Website
      </Link>

      <Suspense fallback={<div className="text-xs text-amber-300">Loading Login Portal...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
