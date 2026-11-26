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

  const inputClass =
    'w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500';
  const labelClass =
    'block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5';

  return (
    <div className="flex-1 pb-12 bg-gray-50">
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
        <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-200 shadow-sm px-5 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ImageIcon className="w-4 h-4 text-green-600" />
            <span>
              Total Gallery Photos: <strong className="text-gray-900">{gallery.length}</strong>
            </span>
          </div>

          <button
            onClick={openAddModal}
            className="px-5 py-2.5 rounded-full text-sm font-bold bg-green-600 hover:bg-green-700 text-white shadow flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" /> Upload Gallery Photo
          </button>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="p-12 text-center text-sm text-green-700 bg-white rounded-3xl border border-green-100">
            Loading gallery photos...
          </div>
        ) : gallery.length === 0 ? (
          <div className="p-16 text-center bg-white rounded-3xl border border-gray-200 shadow-sm space-y-2">
            <ImageIcon className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="text-sm font-bold text-gray-700">No gallery photos yet</p>
            <p className="text-xs text-gray-400">
              Click &ldquo;Upload Gallery Photo&rdquo; above to add photos to your website.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {gallery.map((img) => (
              <div
                key={img.id}
                className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm flex flex-col justify-between group hover:border-green-300 hover:shadow-md transition"
              >
                <div className="relative h-56 w-full bg-gray-100 overflow-hidden">
                  <img
                    src={img.imageUrl}
                    alt={img.caption || 'Gallery photo'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-4 flex items-center justify-between gap-3 border-t border-gray-100">
                  <p className="text-xs text-gray-600 line-clamp-2 flex-1">
                    {img.caption || 'No caption'}
                  </p>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openEditModal(img)}
                      className="p-2 rounded-xl text-blue-500 hover:bg-blue-50 border border-transparent hover:border-blue-200 transition"
                      title="Edit Caption"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingId(img.id)}
                      className="p-2 rounded-xl text-red-400 hover:bg-red-50 border border-transparent hover:border-red-200 transition"
                      title="Remove Photo"
                    >
                      <Trash2 className="w-4 h-4" />
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
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-7 rounded-3xl border border-gray-200 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-extrabold text-gray-900 mb-5 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-green-600" />
              {editingItem ? 'Edit Photo Caption' : 'Upload Gallery Photo'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Photo Preview & Input */}
              <div>
                <label className={labelClass}>Photo File or URL *</label>
                {formData.imageUrl && (
                  <div className="relative h-44 mb-3 rounded-2xl overflow-hidden border border-gray-200">
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
                    className={inputClass}
                  />
                  <label className="px-4 py-2.5 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm font-semibold cursor-pointer hover:bg-green-100 transition shrink-0 flex items-center gap-1.5 whitespace-nowrap">
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
                <label className={labelClass}>Caption / Description</label>
                <textarea
                  rows={3}
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="e.g. Cozy seating area at Mashuup Cafe"
                  className={inputClass}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-sm font-bold bg-green-600 hover:bg-green-700 text-white shadow transition"
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
