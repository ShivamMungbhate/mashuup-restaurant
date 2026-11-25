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

  const inputClass = 'w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500';
  const labelClass = 'block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 flex items-center gap-1.5';

  return (
    <div className="flex-1 pb-12 bg-gray-50">
      <AdminHeader
        title="Restaurant Profile"
        subtitle="Manage restaurant branding, tagline, story, hero image, and main photography"
      />
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {loading ? (
          <div className="p-12 text-center text-sm text-green-700 bg-white rounded-3xl border border-green-100">Loading profile data...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Info Card */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-7 space-y-5">
              <h2 className="text-base font-bold text-green-900 flex items-center gap-2 border-b border-gray-100 pb-4">
                <Store className="w-5 h-5 text-green-600" />
                General Branding &amp; Content
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Restaurant Name *</label>
                  <input type="text" required value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Mashuup Cafe" className={inputClass + ' font-semibold'} />
                </div>
                <div>
                  <label className={labelClass}>Tagline *</label>
                  <input type="text" required value={formData.tagline || ''} onChange={(e) => setFormData({ ...formData, tagline: e.target.value })} placeholder="Good Food. Good Vibes." className={inputClass + ' italic'} />
                </div>
              </div>

              <div>
                <label className={labelClass}>Short Description (Homepage Hero) *</label>
                <textarea rows={2} required value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>About Us Story *</label>
                <textarea rows={5} required value={formData.about || ''} onChange={(e) => setFormData({ ...formData, about: e.target.value })} className={inputClass} />
              </div>
            </div>

            {/* Images Card */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-7 space-y-6">
              <h2 className="text-base font-bold text-green-900 flex items-center gap-2 border-b border-gray-100 pb-4">
                <Upload className="w-5 h-5 text-green-600" />
                Restaurant Images
              </h2>

              <div>
                <label className={labelClass}>Homepage Hero Image</label>
                {formData.heroImage && (
                  <div className="relative h-44 rounded-2xl overflow-hidden border border-gray-200 mb-3">
                    <img src={formData.heroImage} alt="Hero" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <input type="text" value={formData.heroImage || ''} onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })} placeholder="https://..." className={inputClass} />
                  <label className="px-4 py-2.5 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm font-semibold cursor-pointer hover:bg-green-100 transition shrink-0 flex items-center gap-1.5 whitespace-nowrap">
                    <Upload className="w-3.5 h-3.5" />
                    {uploadingHero ? 'Uploading...' : 'Upload'}
                    <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'heroImage')} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className={labelClass}>Main Restaurant Photo (About Section)</label>
                {formData.restaurantImage && (
                  <div className="relative h-44 rounded-2xl overflow-hidden border border-gray-200 mb-3">
                    <img src={formData.restaurantImage} alt="Restaurant" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <input type="text" value={formData.restaurantImage || ''} onChange={(e) => setFormData({ ...formData, restaurantImage: e.target.value })} placeholder="https://..." className={inputClass} />
                  <label className="px-4 py-2.5 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm font-semibold cursor-pointer hover:bg-green-100 transition shrink-0 flex items-center gap-1.5 whitespace-nowrap">
                    <Upload className="w-3.5 h-3.5" />
                    {uploadingMain ? 'Uploading...' : 'Upload'}
                    <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'restaurantImage')} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button type="submit" disabled={saving} className="px-8 py-3 rounded-full text-sm font-bold bg-green-600 hover:bg-green-700 text-white shadow-md flex items-center gap-2 transition disabled:opacity-50">
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
