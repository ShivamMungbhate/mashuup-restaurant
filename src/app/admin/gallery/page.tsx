'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import Toast from '@/components/admin/Toast';
import ConfirmModal from '@/components/admin/ConfirmModal';
import { GalleryImage } from '@/types';
import { Image as ImageIcon, Plus, Upload, Trash2, Edit2, X } from 'lucide-react';

export default function AdminGalleryPage() {
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryImage | null>(null);
  const [formData, setFormData] = useState({ imageUrl: '', caption: '' });
  const [uploading, setUploading] = useState(false);

  // Confirmation & Toast
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/gallery');
      const data = await res.json();
      if (data.gallery) setGallery(data.gallery);
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to load gallery photos' });
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({ imageUrl: '', caption: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (item: GalleryImage) => {
    setEditingItem(item);
    setFormData({ imageUrl: item.imageUrl, caption: item.caption || '' });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const body = new FormData();
    body.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setFormData((prev) => ({ ...prev, imageUrl: data.imageUrl }));
      setToast({ type: 'success', message: 'Gallery image uploaded!' });
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Upload failed' });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl.trim()) {
      setToast({ type: 'error', message: 'Image URL or file is required' });
      return;
    }

    try {
      const url = '/api/admin/gallery';
      const method = editingItem ? 'PUT' : 'POST';
      const payload = editingItem ? { ...formData, id: editingItem.id } : formData;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save gallery photo');

      setToast({
        type: 'success',
        message: editingItem ? 'Caption updated!' : 'New photo added to gallery!',
      });
      setIsModalOpen(false);
      fetchGallery();
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Save failed' });
    }
  };

  const confirmDelete = async () => {
    if (!deletingId) return;

    try {
      const res = await fetch(`/api/admin/gallery?id=${deletingId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete photo');

      setToast({ type: 'success', message: 'Gallery photo removed' });
      fetchGallery();
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Deletion failed' });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex-1 pb-12">
      <AdminHeader
        title="Gallery Management"
        subtitle="Upload, edit captions, and delete photos in the public photo gallery"
      />

      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}

      <ConfirmModal
        isOpen={Boolean(deletingId)}
        title="Remove Photo from Gallery?"
        message="Are you sure you want to remove this photo? It will immediately disappear from the public website gallery."
        onConfirm={confirmDelete}
        onCancel={() => setDeletingId(null)}
      />

      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-amber-200/80">
            <ImageIcon className="w-4 h-4 text-amber-400" />
            <span>Total Gallery Photos: <strong>{gallery.length}</strong></span>
          </div>

          <button
            onClick={openAddModal}
            className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-zinc-950 gold-gradient-bg shadow-lg shadow-amber-500/20 flex items-center gap-2 hover:scale-105 transition"
          >
            <Plus className="w-4 h-4" /> Upload Gallery Photo
          </button>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="p-12 text-center text-xs text-amber-200">Loading gallery photos...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {gallery.map((img) => (
              <div
                key={img.id}
                className="glass-card rounded-3xl overflow-hidden border border-amber-500/20 flex flex-col justify-between group hover:border-amber-500/40 transition"
              >
                <div className="relative h-56 w-full bg-zinc-950 overflow-hidden">
                  <img
                    src={img.imageUrl}
                    alt={img.caption || 'Gallery photo'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-4 flex items-center justify-between gap-2 border-t border-amber-500/10 bg-zinc-950/60">
                  <p className="text-xs text-zinc-300 font-light line-clamp-1">
                    {img.caption || 'No caption'}
                  </p>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openEditModal(img)}
                      className="p-1.5 rounded-xl text-amber-300 hover:bg-amber-500/20 transition"
                      title="Edit Caption"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingId(img.id)}
                      className="p-1.5 rounded-xl text-rose-400 hover:bg-rose-950 transition"
                      title="Remove Photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-6 rounded-3xl border border-amber-500/30 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-extrabold text-white mb-6 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-amber-400" />
              {editingItem ? 'Edit Photo Caption' : 'Upload Gallery Photo'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Photo Preview & Input */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-200/80 mb-2">
                  Photo File or URL *
                </label>
                {formData.imageUrl && (
                  <div className="relative h-44 mb-3 rounded-2xl overflow-hidden border border-amber-500/30">
                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://... or upload"
                    className="flex-1 bg-zinc-950/90 border border-amber-500/30 rounded-xl px-4 py-2.5 text-xs text-amber-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                  />
                  <label className="px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold cursor-pointer hover:bg-amber-500/20 transition shrink-0 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    {uploading ? 'Uploading...' : 'Upload'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Caption */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-200/80 mb-1">
                  Caption / Description
                </label>
                <textarea
                  rows={3}
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="e.g. Main dining hall illuminated by warm evening lights"
                  className="w-full bg-zinc-950/90 border border-amber-500/30 rounded-xl px-4 py-2.5 text-xs text-amber-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
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
                  className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-950 gold-gradient-bg shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition"
                >
                  {editingItem ? 'Save Caption' : 'Add to Gallery'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
