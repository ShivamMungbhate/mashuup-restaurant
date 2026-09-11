'use client';

import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';

interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [currentAdminId, setCurrentAdminId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Confirmation & Toast
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.users) setUsers(data.users);
      if (data.currentAdminId) setCurrentAdminId(data.currentAdminId);
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to load admin users list' });
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setFormData({ name: '', email: '', password: '' });
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      setModalError('Please complete all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create admin user');

      setToast({
        type: 'success',
        message: `Admin user ${formData.email} created successfully!`,
      });
      setIsModalOpen(false);
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
        subtitle="Manage authorized owner accounts and create new admins for Mashuup"
      />

      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}

      <ConfirmModal
        isOpen={Boolean(deletingId)}
        title="Remove Admin Account?"
        message="Are you sure you want to revoke admin access for this user? They will no longer be able to sign in to the Owner Dashboard."
        onConfirm={confirmDeleteAdmin}
        onCancel={() => setDeletingId(null)}
      />

      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {/* Top Header Controls */}
        <div className="glass-card p-6 rounded-3xl border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              Active Admin Accounts ({users.length})
            </h2>
            <p className="text-xs text-zinc-400 font-light mt-0.5">
              Authorized users with access to manage menu, categories, details, gallery, and hours
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-zinc-950 gold-gradient-bg shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 hover:scale-105 transition"
          >
            <UserPlus className="w-4 h-4" /> Add New Admin
          </button>
        </div>

        {/* Admin List */}
        {loading ? (
          <div className="p-12 text-center text-xs text-amber-200">Loading admin users...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {users.map((u) => {
              const isCurrent = u.id === currentAdminId;
              return (
                <div
                  key={u.id}
                  className={`glass-card p-5 rounded-3xl border flex items-center justify-between transition-all ${
                    isCurrent
                      ? 'border-amber-500/50 bg-amber-500/5 shadow-xl shadow-amber-500/10'
                      : 'border-amber-500/20 hover:border-amber-500/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl gold-gradient-bg text-zinc-950 flex items-center justify-center font-bold text-sm shadow-md">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white">{u.name}</h3>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-amber-200/80 font-mono mt-0.5">{u.email}</p>
                      <p className="text-[10px] text-zinc-500 mt-1">
                        Added: {new Date(u.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {!isCurrent && (
                    <button
                      onClick={() => setDeletingId(u.id)}
                      className="p-2.5 rounded-xl text-rose-400 hover:bg-rose-950/60 border border-transparent hover:border-rose-500/30 transition"
                      title="Remove Admin Account"
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

      {/* Direct Create Admin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card max-w-lg w-full p-7 rounded-3xl border border-amber-500/30 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl gold-gradient-bg text-zinc-950 font-bold">
                <UserPlus className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-white">Add New Admin User</h2>
                <p className="text-xs text-zinc-400">Grant admin access to a new team member</p>
              </div>
            </div>

            {/* Error Banner */}
            {modalError && (
              <div className="p-3.5 mb-4 rounded-xl bg-rose-950/90 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-200/80 mb-1">
                  Admin Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Shivam"
                  className="w-full bg-zinc-950/90 border border-amber-500/30 rounded-xl px-4 py-2.5 text-xs text-amber-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-200/80 mb-1">
                  Admin Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="newadmin@gmail.com"
                    className="w-full bg-zinc-950/90 border border-amber-500/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-amber-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-200/80 mb-1">
                  Set Password *
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-zinc-950/90 border border-amber-500/30 rounded-xl pl-10 pr-10 py-2.5 text-xs text-amber-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-mono"
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

              <div className="flex justify-end gap-3 pt-4 border-t border-amber-500/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-300 bg-white/5 border border-white/10 hover:bg-white/10 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-950 gold-gradient-bg shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-50"
                >
                  {submitting ? 'Creating Admin...' : 'Create Admin Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
