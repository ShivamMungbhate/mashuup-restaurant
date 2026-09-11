'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import Toast from '@/components/admin/Toast';
import ConfirmModal from '@/components/admin/ConfirmModal';
import { MenuCategory, MenuItem } from '@/types';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Upload,
  CheckCircle,
  XCircle,
  Sparkles,
  UtensilsCrossed,
  X,
  Check,
} from 'lucide-react';

export default function AdminMenuPage() {
  const [items, setItems] = useState<(MenuItem & { category?: MenuCategory })[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    description: '',
    price: '',
    image: '',
    isVeg: true,
    isAvailable: true,
    isFeatured: false,
  });

  const [uploadingImage, setUploadingImage] = useState(false);

  // Confirmation Modal State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Toast Notification State
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [itemsRes, catRes] = await Promise.all([
        fetch('/api/admin/menu'),
        fetch('/api/admin/categories'),
      ]);

      const itemsData = await itemsRes.json();
      const catData = await catRes.json();

      if (itemsData.items) setItems(itemsData.items);
      if (catData.categories) setCategories(catData.categories);
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to load menu items' });
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      categoryId: categories[0]?.id || '',
      description: '',
      price: '',
      image: '',
      isVeg: true,
      isAvailable: true,
      isFeatured: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      categoryId: item.categoryId,
      description: item.description,
      price: item.price.toString(),
      image: item.image || '',
      isVeg: item.isVeg,
      isAvailable: item.isAvailable,
      isFeatured: item.isFeatured,
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const body = new FormData();
    body.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setFormData((prev) => ({ ...prev, image: data.imageUrl }));
      setToast({ type: 'success', message: 'Food image uploaded successfully!' });
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Failed to upload image' });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.categoryId || !formData.price) {
      setToast({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }

    try {
      const url = '/api/admin/menu';
      const method = editingItem ? 'PUT' : 'POST';
      const payload = editingItem ? { ...formData, id: editingItem.id } : formData;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save menu item');

      setToast({
        type: 'success',
        message: editingItem ? 'Menu item updated!' : 'New menu item created!',
      });
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Operation failed' });
    }
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      const res = await fetch('/api/admin/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, isAvailable: !item.isAvailable }),
      });
      if (!res.ok) throw new Error('Failed to update status');

      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, isAvailable: !i.isAvailable } : i))
      );
      setToast({
        type: 'success',
        message: `${item.name} marked as ${!item.isAvailable ? 'Available' : 'Unavailable'}`,
      });
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to toggle availability' });
    }
  };

  const handleToggleFeatured = async (item: MenuItem) => {
    try {
      const res = await fetch('/api/admin/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, isFeatured: !item.isFeatured }),
      });
      if (!res.ok) throw new Error('Failed to update status');

      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, isFeatured: !i.isFeatured } : i))
      );
      setToast({
        type: 'success',
        message: `${item.name} ${!item.isFeatured ? 'added to' : 'removed from'} featured list`,
      });
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to toggle featured status' });
    }
  };

  const confirmDelete = async () => {
    if (!deletingId) return;

    try {
      const res = await fetch(`/api/admin/menu?id=${deletingId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete');

      setItems((prev) => prev.filter((i) => i.id !== deletingId));
      setToast({ type: 'success', message: 'Menu item deleted successfully' });
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Deletion failed' });
    } finally {
      setDeletingId(null);
    }
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    if (categoryFilter !== 'all' && item.categoryId !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category?.name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex-1 pb-12">
      <AdminHeader
        title="Menu Management"
        subtitle="Add, edit, delete, and control availability of restaurant dishes"
      />

      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}

      <ConfirmModal
        isOpen={Boolean(deletingId)}
        title="Delete Menu Item?"
        message="Are you sure you want to delete this menu item? This action will permanently remove it from the public website."
        onConfirm={confirmDelete}
        onCancel={() => setDeletingId(null)}
      />

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Top Controls Bar */}
        <div className="glass-card p-4 rounded-3xl border-amber-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search dish name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-950/80 border border-amber-500/30 rounded-full pl-10 pr-4 py-2 text-xs text-amber-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full sm:w-auto bg-zinc-950/80 border border-amber-500/30 rounded-full px-4 py-2 text-xs text-amber-100 focus:outline-none focus:border-amber-400"
            >
              <option value="all">All Categories ({items.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={openAddModal}
            className="w-full md:w-auto px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-zinc-950 gold-gradient-bg shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 hover:scale-105 transition"
          >
            <Plus className="w-4 h-4" /> Add Menu Item
          </button>
        </div>

        {/* Menu Data Table */}
        <div className="glass-card rounded-3xl border-amber-500/20 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-xs text-amber-200">Loading menu data...</div>
          ) : filteredItems.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <UtensilsCrossed className="w-10 h-10 text-amber-400/40 mx-auto" />
              <p className="text-sm font-bold text-white">No menu items found</p>
              <p className="text-xs text-zinc-400">Click "Add Menu Item" above to create one.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-amber-500/15 text-amber-200/70 uppercase text-[10px] tracking-wider bg-zinc-950/50">
                    <th className="py-4 px-4">Item & Image</th>
                    <th className="py-4 px-4">Category</th>
                    <th className="py-4 px-4">Price</th>
                    <th className="py-4 px-4">Dietary</th>
                    <th className="py-4 px-4 text-center">Available</th>
                    <th className="py-4 px-4 text-center">Featured</th>
                    <th className="py-4 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-zinc-300">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-white/5 transition">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img
                          src={
                            item.image ||
                            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=100&q=80'
                          }
                          alt={item.name}
                          className="w-10 h-10 rounded-xl object-cover border border-amber-500/20"
                        />
                        <div>
                          <p className="font-bold text-white text-sm">{item.name}</p>
                          <p className="text-[11px] text-zinc-400 line-clamp-1 max-w-xs">
                            {item.description}
                          </p>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-amber-200/80 font-medium">
                        {item.category?.name || 'Unassigned'}
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-amber-300">
                        ${item.price.toFixed(2)}
                      </td>

                      <td className="py-3 px-4">
                        {item.isVeg ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                            Veg
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-950 text-rose-300 border border-rose-500/30">
                            Non-Veg
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggleAvailability(item)}
                          className={`px-3 py-1 rounded-full text-[11px] font-bold transition inline-flex items-center gap-1 ${
                            item.isAvailable
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          }`}
                        >
                          {item.isAvailable ? (
                            <>
                              <Check className="w-3 h-3" /> Available
                            </>
                          ) : (
                            <>
                              <X className="w-3 h-3" /> Unavailable
                            </>
                          )}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggleFeatured(item)}
                          className={`p-1.5 rounded-xl transition ${
                            item.isFeatured
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'text-zinc-600 hover:text-amber-400'
                          }`}
                          title="Toggle Popular/Featured"
                        >
                          <Sparkles className="w-4 h-4" />
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-2 rounded-xl text-amber-300 hover:bg-amber-500/20 transition"
                          title="Edit Item"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingId(item.id)}
                          className="p-2 rounded-xl text-rose-400 hover:bg-rose-950 transition"
                          title="Delete Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-card max-w-xl w-full p-6 rounded-3xl border border-amber-500/30 shadow-2xl relative my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-extrabold text-white mb-6 flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-amber-400" />
              {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-200/80 mb-1">
                  Dish Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Truffle Mushroom Bruschetta"
                  className="w-full bg-zinc-950/90 border border-amber-500/30 rounded-xl px-4 py-2.5 text-xs text-amber-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-200/80 mb-1">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full bg-zinc-950/90 border border-amber-500/30 rounded-xl px-3 py-2.5 text-xs text-amber-100 focus:outline-none focus:border-amber-400"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-200/80 mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="18.50"
                    className="w-full bg-zinc-950/90 border border-amber-500/30 rounded-xl px-4 py-2.5 text-xs text-amber-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-200/80 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ingredients and culinary notes..."
                  className="w-full bg-zinc-950/90 border border-amber-500/30 rounded-xl px-4 py-2.5 text-xs text-amber-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Food Image Upload & URL */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-200/80 mb-1">
                  Food Image
                </label>
                <div className="flex items-center gap-3">
                  {formData.image && (
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-12 h-12 rounded-xl object-cover border border-amber-500/30 shrink-0"
                    />
                  )}
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="Image URL or upload file..."
                    className="flex-1 bg-zinc-950/90 border border-amber-500/30 rounded-xl px-4 py-2.5 text-xs text-amber-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                  />
                  <label className="px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold cursor-pointer hover:bg-amber-500/20 transition shrink-0 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    {uploadingImage ? 'Uploading...' : 'Upload'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <label className="flex items-center gap-2 p-3 rounded-xl bg-zinc-950/80 border border-amber-500/20 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isVeg}
                    onChange={(e) => setFormData({ ...formData, isVeg: e.target.checked })}
                    className="rounded accent-amber-500"
                  />
                  <span className="text-xs font-semibold text-white">Vegetarian</span>
                </label>

                <label className="flex items-center gap-2 p-3 rounded-xl bg-zinc-950/80 border border-amber-500/20 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    className="rounded accent-amber-500"
                  />
                  <span className="text-xs font-semibold text-white">Available</span>
                </label>

                <label className="flex items-center gap-2 p-3 rounded-xl bg-zinc-950/80 border border-amber-500/20 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded accent-amber-500"
                  />
                  <span className="text-xs font-semibold text-white">Featured</span>
                </label>
              </div>

              {/* Submit Buttons */}
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
                  {editingItem ? 'Save Changes' : 'Create Dish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
