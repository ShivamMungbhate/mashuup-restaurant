'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import Toast from '@/components/admin/Toast';
import { OpeningHour } from '@/types';
import { Clock, Save, CheckCircle2, XCircle } from 'lucide-react';

export default function AdminHoursPage() {
  const [hours, setHours] = useState<OpeningHour[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchHours();
  }, []);

  const fetchHours = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/hours');
      const data = await res.json();
      if (data.hours) setHours(data.hours);
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to load opening hours' });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleClosed = (id: string) => {
    setHours((prev) =>
      prev.map((h) => (h.id === id ? { ...h, isClosed: !h.isClosed } : h))
    );
  };

  const handleChangeTime = (id: string, field: 'openTime' | 'closeTime', val: string) => {
    setHours((prev) =>
      prev.map((h) => (h.id === id ? { ...h, [field]: val } : h))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/admin/hours', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hours }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save opening hours');

      setToast({ type: 'success', message: 'Opening hours updated successfully!' });
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Save failed' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 pb-12">
      <AdminHeader
        title="Opening Hours Management"
        subtitle="Configure operating schedules for Monday through Sunday"
      />

      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}

      <div className="p-6 max-w-4xl mx-auto">
        {loading ? (
          <div className="p-12 text-center text-xs text-amber-200">Loading opening hours...</div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-card p-8 rounded-3xl border-amber-500/20 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-amber-500/15 pb-4">
              <Clock className="w-5 h-5 text-amber-400" />
              Weekly Operating Hours
            </h2>

            <div className="space-y-3">
              {hours.map((h) => (
                <div
                  key={h.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-zinc-950/80 border border-amber-500/15 gap-4"
                >
                  <div className="flex items-center gap-3 w-36 shrink-0">
                    <span className="text-sm font-bold text-white">{h.day}</span>
                  </div>

                  <div className="flex items-center gap-3 flex-1">
                    {!h.isClosed ? (
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <input
                          type="text"
                          value={h.openTime}
                          onChange={(e) => handleChangeTime(h.id, 'openTime', e.target.value)}
                          placeholder="11:30 AM"
                          className="w-28 bg-zinc-900 border border-amber-500/30 rounded-xl px-3 py-2 text-xs text-amber-100 text-center font-mono focus:outline-none focus:border-amber-400"
                        />
                        <span className="text-xs text-zinc-500 font-bold">to</span>
                        <input
                          type="text"
                          value={h.closeTime}
                          onChange={(e) => handleChangeTime(h.id, 'closeTime', e.target.value)}
                          placeholder="10:00 PM"
                          className="w-28 bg-zinc-900 border border-amber-500/30 rounded-xl px-3 py-2 text-xs text-amber-100 text-center font-mono focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-rose-400 uppercase tracking-wider px-3 py-2 rounded-xl bg-rose-950/50 border border-rose-500/20">
                        Closed All Day
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleClosed(h.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0 ${
                      h.isClosed
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                        : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                    }`}
                  >
                    {h.isClosed ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Mark Open
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" /> Mark Closed
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-amber-500/15 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider text-zinc-950 gold-gradient-bg shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving Schedule...' : 'Save Weekly Schedule'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
