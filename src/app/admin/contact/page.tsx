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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/restaurant');
      const data = await res.json();
      if (data.restaurant) setFormData(data.restaurant);
    } catch (err) {
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
      if (!res.ok) throw new Error(data.error || 'Failed to update contact information');

      setToast({
        type: 'success',
        message: 'Contact details updated! Public footer & contact page reflect changes.',
      });
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Save failed' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 pb-12">
      <AdminHeader
        title="Contact & Location Management"
        subtitle="Manage phone number, email, address, Instagram profile, and Google Maps embed link"
      />

      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}

      <div className="p-6 max-w-4xl mx-auto">
        {loading ? (
          <div className="p-12 text-center text-xs text-amber-200">Loading contact info...</div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-card p-8 rounded-3xl border-amber-500/20 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-amber-500/15 pb-4">
              <PhoneCall className="w-5 h-5 text-amber-400" />
              Public Contact Channels
            </h2>

            {/* Address */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-200/80 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" /> Full Address *
              </label>
              <textarea
                rows={2}
                required
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="742 Olive Grove Boulevard, Culinary District, NY 10001"
                className="w-full bg-zinc-950/90 border border-amber-500/30 rounded-xl px-4 py-2.5 text-xs text-amber-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Phone & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-200/80 mb-1 flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-amber-400" /> Phone Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 234-5678"
                  className="w-full bg-zinc-950/90 border border-amber-500/30 rounded-xl px-4 py-2.5 text-xs text-amber-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-200/80 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400" /> Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="info@theolivetable.com"
                  className="w-full bg-zinc-950/90 border border-amber-500/30 rounded-xl px-4 py-2.5 text-xs text-amber-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Instagram URL */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-200/80 mb-1 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-amber-400" /> Instagram Profile Link
              </label>
              <input
                type="url"
                value={formData.instagramUrl || ''}
                onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                placeholder="https://instagram.com/theolivetable"
                className="w-full bg-zinc-950/90 border border-amber-500/30 rounded-xl px-4 py-2.5 text-xs text-amber-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Google Maps Embed URL */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-200/80 mb-1 flex items-center gap-1.5">
                <Map className="w-3.5 h-3.5 text-amber-400" /> Google Maps Embed URL (Iframe Src)
              </label>
              <textarea
                rows={3}
                value={formData.mapUrl || ''}
                onChange={(e) => setFormData({ ...formData, mapUrl: e.target.value })}
                placeholder="https://www.google.com/maps/embed?pb=..."
                className="w-full bg-zinc-950/90 border border-amber-500/30 rounded-xl px-4 py-2.5 text-xs text-amber-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-mono text-[11px]"
              />
            </div>

            {/* Save Button */}
            <div className="pt-6 border-t border-amber-500/15 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider text-zinc-950 gold-gradient-bg shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition flex items-center gap-2"
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
