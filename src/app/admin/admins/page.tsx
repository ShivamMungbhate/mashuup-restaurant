'use client';

import React, { useState, useEffect, useRef } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import Toast from '@/components/admin/Toast';
import ConfirmModal from '@/components/admin/ConfirmModal';
import {
  Users,
  UserPlus,
  Mail,
  KeyRound,
  Trash2,
  X,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Send,
  ArrowLeft,
  User,
} from 'lucide-react';

interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

type ModalStep = 'details' | 'otp' | 'password';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [currentAdminId, setCurrentAdminId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<ModalStep>('details');
  const [modalError, setModalError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [otpSentEmail, setOtpSentEmail] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Confirmation & Toast
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Cooldown timer for resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.users) setUsers(data.users);
      if (data.currentAdminId) setCurrentAdminId(data.currentAdminId);
    } catch {
      setToast({ type: 'error', message: 'Failed to load admin users list' });
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setFormData({ name: '', email: '', password: '' });
    setOtpCode(['', '', '', '', '', '']);
    setModalError(null);
    setModalStep('details');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalError(null);
    setModalStep('details');
  };

  // Step 1 — Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    if (!formData.name.trim() || !formData.email.trim()) {
      setModalError('Please enter both name and email.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/users/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, email: formData.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP');
      setOtpSentEmail(formData.email.toLowerCase().trim());
      setOtpCode(['', '', '', '', '', '']);
      setResendCooldown(60);
      setModalStep('otp');
      setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
    } catch (err: any) {
      setModalError(err.message || 'Failed to send OTP');
    } finally {
      setSubmitting(false);
    }
  };

  // OTP input box handler
  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...otpCode];
    next[index] = digit;
    setOtpCode(next);
    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtpCode(pasted.split(''));
      otpInputRefs.current[5]?.focus();
    }
  };

  // Step 2 — Verify OTP → go to password step
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    const code = otpCode.join('');
    if (code.length < 6) {
      setModalError('Please enter all 6 digits of the OTP.');
      return;
    }
    setModalStep('password');
  };

  // Step 3 — Set password & create admin
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    if (!formData.password.trim() || formData.password.length < 6) {
      setModalError('Password must be at least 6 characters.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/users/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: otpSentEmail,
          password: formData.password,
          code: otpCode.join(''),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification failed');
      setToast({ type: 'success', message: `Admin ${otpSentEmail} created & verified!` });
      closeModal();
      fetchUsers();
    } catch (err: any) {
      setModalError(err.message || 'Creation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDeleteAdmin = async () => {
    if (!deletingId) return;
    try {
      const res = await fetch(`/api/admin/users?id=${deletingId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to remove admin user');
      setToast({ type: 'success', message: 'Admin user account removed' });
      fetchUsers();
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Deletion failed' });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex-1 pb-12">
      <AdminHeader
        title="Admin Users Management"
        subtitle="Manage authorized accounts — OTP verification required for new admins"
      />

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <ConfirmModal
        isOpen={Boolean(deletingId)}
        title="Remove Admin Account?"
        message="This user will lose all access to the Mashuup admin dashboard."
        onConfirm={confirmDeleteAdmin}
        onCancel={() => setDeletingId(null)}
      />

      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {/* Header Row */}
        <div className="bg-white rounded-3xl border border-green-100 shadow-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-green-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              Active Admin Accounts ({users.length})
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              All admin accounts require OTP email verification
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="w-full sm:w-auto px-6 py-3 rounded-full text-sm font-bold bg-green-600 hover:bg-green-700 text-white shadow-md flex items-center justify-center gap-2 transition"
          >
            <UserPlus className="w-4 h-4" /> Add New Admin
          </button>
        </div>

        {/* Admin List */}
        {loading ? (
          <div className="p-12 text-center text-sm text-green-700">Loading admin users...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {users.map((u) => {
              const isCurrent = u.id === currentAdminId;
              return (
                <div
                  key={u.id}
                  className={`bg-white rounded-3xl border p-5 flex items-center justify-between shadow-sm transition-all ${
                    isCurrent
                      ? 'border-green-400 shadow-green-100'
                      : 'border-green-100 hover:border-green-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-green-600 text-white flex items-center justify-center font-bold text-sm shadow">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-gray-800">{u.name}</h3>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-green-100 text-green-700 border border-green-300 uppercase">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-green-700 font-mono mt-0.5">{u.email}</p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        Added: {new Date(u.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {!isCurrent && (
                    <button
                      onClick={() => setDeletingId(u.id)}
                      className="p-2.5 rounded-xl text-red-400 hover:bg-red-50 border border-transparent hover:border-red-200 transition"
                      title="Remove Admin"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── MODAL ───────────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-7 rounded-3xl border border-green-200 shadow-2xl relative">
            <button
              onClick={closeModal}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-6">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition ${modalStep === 'details' ? 'bg-green-600 text-white border-green-600' : 'bg-green-100 text-green-700 border-green-300'}`}>
                1
              </div>
              <div className={`flex-1 h-1 rounded ${modalStep !== 'details' ? 'bg-green-500' : 'bg-gray-200'}`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition ${modalStep === 'otp' ? 'bg-green-600 text-white border-green-600' : modalStep === 'password' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
                2
              </div>
              <div className={`flex-1 h-1 rounded ${modalStep === 'password' ? 'bg-green-500' : 'bg-gray-200'}`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition ${modalStep === 'password' ? 'bg-green-600 text-white border-green-600' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
                3
              </div>
            </div>

            {/* Error banner */}
            {modalError && (
              <div className="p-3.5 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            {/* ── STEP 1: Name + Email ── */}
            {modalStep === 'details' && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 rounded-2xl bg-green-600 text-white">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-gray-900">Add New Admin</h2>
                    <p className="text-xs text-gray-500">Step 1 — Enter admin details</p>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-green-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Shivam"
                      className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-green-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="admin@gmail.com"
                      className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl text-sm font-bold bg-green-600 hover:bg-green-700 text-white shadow flex items-center gap-2 transition disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    {submitting ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                </div>
              </form>
            )}

            {/* ── STEP 2: OTP Entry ── */}
            {modalStep === 'otp' && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <button type="button" onClick={() => setModalStep('details')} className="text-gray-400 hover:text-gray-700">
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-green-600 text-white">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-extrabold text-gray-900">Verify OTP</h2>
                      <p className="text-xs text-gray-500">Step 2 — Enter the 6-digit code</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
                  <p className="text-xs text-green-700">OTP sent to</p>
                  <p className="text-sm font-bold text-green-900 mt-0.5">{otpSentEmail}</p>
                  <p className="text-[11px] text-gray-500 mt-1">Check your inbox (and spam folder)</p>
                </div>

                {/* 6-box OTP input */}
                <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                  {otpCode.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpInputRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-11 h-14 text-center text-xl font-bold border-2 rounded-xl focus:outline-none focus:border-green-500 text-gray-900 border-gray-200 transition"
                    />
                  ))}
                </div>

                <div className="text-center">
                  {resendCooldown > 0 ? (
                    <p className="text-xs text-gray-400">Resend OTP in {resendCooldown}s</p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendOtp as any}
                      className="text-xs text-green-600 hover:text-green-800 font-semibold underline"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={otpCode.join('').length < 6}
                    className="px-6 py-2.5 rounded-xl text-sm font-bold bg-green-600 hover:bg-green-700 text-white shadow flex items-center gap-2 transition disabled:opacity-50"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Verify Code
                  </button>
                </div>
              </form>
            )}

            {/* ── STEP 3: Set Password ── */}
            {modalStep === 'password' && (
              <form onSubmit={handleCreateAdmin} className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <button type="button" onClick={() => setModalStep('otp')} className="text-gray-400 hover:text-gray-700">
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-green-600 text-white">
                      <KeyRound className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-extrabold text-gray-900">Set Password</h2>
                      <p className="text-xs text-gray-500">Step 3 — Create a secure password</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-2xl p-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
                  <p className="text-xs text-green-800">OTP verified ✓ — Setting up account for <strong>{otpSentEmail}</strong></p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-green-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Min. 6 characters"
                      className="w-full border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl text-sm font-bold bg-green-600 hover:bg-green-700 text-white shadow flex items-center gap-2 transition disabled:opacity-50"
                  >
                    <UserPlus className="w-4 h-4" />
                    {submitting ? 'Creating Admin...' : 'Create Admin Account'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
