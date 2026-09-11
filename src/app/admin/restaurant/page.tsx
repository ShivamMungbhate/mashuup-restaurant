'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import Toast from '@/components/admin/Toast';
import { Restaurant } from '@/types';
import { Store, Upload, Save } from 'lucide-react';

export default function AdminRestaurantPage() {
  const [formData, setFormData] = useState<Partial<Restaurant>>({
    name: '',
    tagline: '',
    description: '',
    about: '',
    heroImage: '',
    restaurantImage: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchRestaurant();
  }, []);

  const fetchRestaurant = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/restaurant');
      const data = await res.json();
      if (data.restaurant) setFormData(data.restaurant);
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to load restaurant profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File, field: 'heroImage' | 'restaurantImage') => {
    if (field === 'heroImage') setUploadingHero(true);
    if (field === 'restaurantImage') setUploadingMain(true);

    const body = new FormData();
    body.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setFormData((prev) => ({ ...prev, [field]: data.imageUrl }));
      setToast({ type: 'success', message: 'Image uploaded successfully!' });
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Upload failed' });
    } finally {
      setUploadingHero(false);
      setUploadingMain(false);
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
      if (!res.ok) throw new Error(data.error || 'Failed to update restaurant profile');

      setToast({ type: 'success', message: 'Restaurant profile updated successfully!' });
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Save failed' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 pb-12">
      <AdminHeader
        title="Restaurant Profile"
        subtitle="Manage restaurant branding, tagline, story, hero image, and main photography"
      />

      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}

      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {loading ? (
          <div className="p-12 text-center text-xs text-amber-200">Loading profile data...</div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-card p-8 rounded-3xl border-amber-500/20 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-amber-500/15 pb-4">
              <Store className="w-5 h-5 text-amber-400" />
              General Branding & Content
            </h2>

            {/* Name & Tagline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-200/80 mb-1">
                  Restaurant Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="THE OLIVE TABLE"
                  className="w-full bg-zinc-950/90 border border-amber-500/30 rounded-xl px-4 py-2.5 text-xs text-amber-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-200/80 mb-1">
                  Tagline *
                </label>
                <input
                  type="text"
                  required
                  value={formData.tagline || ''}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="Good Food. Great Moments."
                  className="w-full bg-zinc-950/90 border border-amber-500/30 rounded-xl px-4 py-2.5 text-xs text-amber-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400 italic"
                />
              </div>
            </div>

            {/* Short Description */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-200/80 mb-1">
                Short Description (Homepage Hero) *
              </label>
              <textarea
                rows={2}
                required
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-zinc-950/90 border border-amber-500/30 rounded-xl px-4 py-2.5 text-xs text-amber-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* About Story */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-200/80 mb-1">
                About Us Story (Full Restaurant Story) *
              </label>
              <textarea
                rows={5}
                required
                value={formData.about || ''}
                onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                className="w-full bg-zinc-950/90 border border-amber-500/30 rounded-xl px-4 py-2.5 text-xs text-amber-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Hero Image */}
            <div className="pt-4 border-t border-amber-500/10">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-200/80 mb-2">
                Homepage Hero Image
              </label>
              <div className="space-y-3">
                {formData.heroImage && (
                  <div className="relative h-44 rounded-2xl overflow-hidden border border-amber-500/30">
                    <img src={formData.heroImage} alt="Hero" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={formData.heroImage || ''}
                    onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                    placeholder="https://..."
                    className="flex-1 bg-zinc-950/90 border border-amber-500/30 rounded-xl px-4 py-2.5 text-xs text-amber-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                  />
                  <label className="px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold cursor-pointer hover:bg-amber-500/20 transition shrink-0 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    {uploadingHero ? 'Uploading...' : 'Upload Image'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'heroImage')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Main Restaurant Photo */}
            <div className="pt-4 border-t border-amber-500/10">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-200/80 mb-2">
                Main Restaurant Photo (About Section)
              </label>
              <div className="space-y-3">
                {formData.restaurantImage && (
                  <div className="relative h-44 rounded-2xl overflow-hidden border border-amber-500/30">
                    <img src={formData.restaurantImage} alt="Restaurant" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={formData.restaurantImage || ''}
                    onChange={(e) => setFormData({ ...formData, restaurantImage: e.target.value })}
                    placeholder="https://..."
                    className="flex-1 bg-zinc-950/90 border border-amber-500/30 rounded-xl px-4 py-2.5 text-xs text-amber-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                  />
                  <label className="px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold cursor-pointer hover:bg-amber-500/20 transition shrink-0 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    {uploadingMain ? 'Uploading...' : 'Upload Image'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'restaurantImage')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-6 border-t border-amber-500/15 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider text-zinc-950 gold-gradient-bg shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
