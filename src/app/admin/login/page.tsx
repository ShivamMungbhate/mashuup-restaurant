'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldLock, KeyRound, Mail, Eye, EyeOff, AlertCircle, ArrowLeft, Leaf } from 'lucide-react';
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
      if (!res.ok) throw new Error(data.error || 'Login failed');
      router.push(from);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl shadow-black/30 p-8 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-green-800 flex items-center justify-center text-white mx-auto shadow-xl mb-4">
          <ShieldLock className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-black text-green-900 uppercase tracking-tight">
          Owner Portal
        </h1>
        <p className="text-xs text-gray-500 font-light mt-1">
          Log in to manage Mashuup restaurant menu, details, gallery, and hours
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-green-800 mb-1">
            Admin Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-green-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your admin email"
              className="w-full bg-green-50 border border-green-200 rounded-xl pl-10 pr-4 py-3 text-xs text-green-900 placeholder-green-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-100 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-green-800 mb-1">
            Password
          </label>
          <div className="relative">
            <KeyRound className="w-4 h-4 text-green-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-green-50 border border-green-200 rounded-xl pl-10 pr-10 py-3 text-xs text-green-900 placeholder-green-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-100 transition font-mono"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 hover:text-green-700"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-green-800 hover:bg-green-700 shadow-lg shadow-green-800/20 hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-50"
        >
          {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center p-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0d4a1f 0%, #145a28 60%, #1a7a35 100%)' }}
    >
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none opacity-10"
        style={{ background: 'radial-gradient(circle, #4ade80, transparent)', transform: 'translate(30%,-30%)' }} />
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full pointer-events-none opacity-10"
        style={{ background: 'radial-gradient(circle, #22a04a, transparent)', transform: 'translate(-30%,30%)' }} />

      {/* Back link */}
      <Link
        href="/"
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs font-semibold text-white/80 hover:text-white px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Website
      </Link>

      {/* Brand badge */}
      <div className="mb-6 flex items-center gap-2 text-white/80 text-xs font-bold uppercase tracking-widest">
        <Leaf className="w-4 h-4 text-green-300" /> Mashuup Admin Portal
      </div>

      <Suspense fallback={<div className="text-xs text-white/70">Loading Portal...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
