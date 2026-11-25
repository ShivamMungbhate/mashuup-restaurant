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

  useEffect(() => { fetchHours(); }, []);

  const fetchHours = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/hours');
      const data = await res.json();
      if (data.hours) setHours(data.hours);
    } catch {
      setToast({ type: 'error', message: 'Failed to load opening hours' });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleClosed = (id: string) => {
    setHours((prev) => prev.map((h) => (h.id === id ? { ...h, isClosed: !h.isClosed } : h)));
  };

  const handleChangeTime = (id: string, field: 'openTime' | 'closeTime', val: string) => {
    setHours((prev) => prev.map((h) => (h.id === id ? { ...h, [field]: val } : h)));
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
      if (!res.ok) throw new Error(data.error || 'Save failed');
      setToast({ type: 'success', message: 'Opening hours updated successfully!' });
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Save failed' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 pb-12 bg-gray-50">
      <AdminHeader
        title="Opening Hours"
        subtitle="Configure operating schedules for Monday through Sunday"
      />
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className="p-6 max-w-4xl mx-auto">
        {loading ? (
          <div className="p-12 text-center text-sm text-green-700 bg-white rounded-3xl border border-green-100">Loading hours...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-base font-bold text-green-900 flex items-center gap-2 border-b border-gray-100 pb-4 mb-5">
                <Clock className="w-5 h-5 text-green-600" />
                Weekly Operating Hours
              </h2>

              <div className="space-y-3">
                {hours.map((h) => (
                  <div
                    key={h.id}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border gap-3 transition ${
                      h.isClosed
                        ? 'bg-red-50 border-red-200'
                        : 'bg-green-50 border-green-200'
                    }`}
                  >
                    <div className="w-28 shrink-0">
                      <span className="text-sm font-bold text-gray-800">{h.day}</span>
                    </div>

                    <div className="flex items-center gap-2 flex-1">
                      {!h.isClosed ? (
                        <>
                          <input
                            type="text"
                            value={h.openTime}
                            onChange={(e) => handleChangeTime(h.id, 'openTime', e.target.value)}
                            placeholder="11:00 AM"
                            className="w-28 bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-800 text-center font-mono focus:outline-none focus:border-green-500"
                          />
                          <span className="text-sm text-gray-500 font-medium">to</span>
                          <input
                            type="text"
                            value={h.closeTime}
                            onChange={(e) => handleChangeTime(h.id, 'closeTime', e.target.value)}
                            placeholder="11:00 PM"
                            className="w-28 bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-800 text-center font-mono focus:outline-none focus:border-green-500"
                          />
                        </>
                      ) : (
                        <span className="text-sm font-semibold text-red-600 px-3 py-2 rounded-xl bg-red-100 border border-red-200">
                          Closed All Day
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleClosed(h.id)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-1.5 shrink-0 border ${
                        h.isClosed
                          ? 'bg-green-600 text-white border-green-700 hover:bg-green-700'
                          : 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200'
                      }`}
                    >
                      {h.isClosed ? (
                        <><CheckCircle2 className="w-4 h-4" /> Mark Open</>
                      ) : (
                        <><XCircle className="w-4 h-4" /> Mark Closed</>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3 rounded-full text-sm font-bold bg-green-600 hover:bg-green-700 text-white shadow-md flex items-center gap-2 transition disabled:opacity-50"
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
