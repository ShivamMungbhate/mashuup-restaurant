'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import Toast from '@/components/admin/Toast';
import { Restaurant } from '@/types';
import { PhoneCall, MapPin, Mail, Map, Save, Share2 } from 'lucide-react';

export default function AdminContactPage() {
  const [formData, setFormData] = useState<Partial<Restaurant>>({
    address: '',
    phone: '',
    email: '',
    instagramUrl: '',
    mapUrl: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/restaurant');
      const data = await res.json();
      if (data.restaurant) setFormData(data.restaurant);
    } catch {
      setToast({ type: 'error', message: 'Failed to load contact details' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/restaurant', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update');
      setToast({ type: 'success', message: 'Contact details updated successfully!' });
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Save failed' });
    } finally {
      setSaving(false);
    }
  };

  const inputClass = 'w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500';
  const labelClass = 'block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 flex items-center gap-1.5';

  return (
    <div className="flex-1 pb-12 bg-gray-50">
      <AdminHeader
        title="Contact & Location"
        subtitle="Manage phone number, email, address, Instagram profile, and Google Maps link"
      />
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className="p-6 max-w-4xl mx-auto">
        {loading ? (
          <div className="p-12 text-center text-sm text-green-700 bg-white rounded-3xl border border-green-100">Loading...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-7 space-y-5">
              <h2 className="text-base font-bold text-green-900 flex items-center gap-2 border-b border-gray-100 pb-4">
                <PhoneCall className="w-5 h-5 text-green-600" />
                Public Contact Channels
              </h2>

              <div>
                <label className={labelClass}>
                  <MapPin className="w-3.5 h-3.5 text-green-500" /> Full Address *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Near Pola Ground, Poonam Chamber, Chhindwara, MP"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>
                    <PhoneCall className="w-3.5 h-3.5 text-green-500" /> Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="9009310300"
                    className={inputClass + ' font-mono'}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    <Mail className="w-3.5 h-3.5 text-green-500" /> Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="mashupfoodcart@gmail.com"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  <Share2 className="w-3.5 h-3.5 text-green-500" /> Instagram Profile Link
                </label>
                <input
                  type="url"
                  value={formData.instagramUrl || ''}
                  onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                  placeholder="https://instagram.com/mashuupcafe_"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  <Map className="w-3.5 h-3.5 text-green-500" /> Google Maps URL
                </label>
                <textarea
                  rows={3}
                  value={formData.mapUrl || ''}
                  onChange={(e) => setFormData({ ...formData, mapUrl: e.target.value })}
                  placeholder="https://www.google.com/maps/..."
                  className={inputClass + ' font-mono text-xs'}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3 rounded-full text-sm font-bold bg-green-600 hover:bg-green-700 text-white shadow-md flex items-center gap-2 transition disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Contact Details'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
