'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import Toast from '@/components/admin/Toast';
import ConfirmModal from '@/components/admin/ConfirmModal';
import { MenuCategory } from '@/types';
import { Plus, Edit2, Trash2, Layers, X } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<(MenuCategory & { _count?: { items: number } })[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      if (data.categories) setCategories(data.categories);
    } catch {
      setToast({ type: 'error', message: 'Failed to load categories' });
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (cat: MenuCategory) => {
    setEditingCategory(cat);
    setFormData({ name: cat.name, description: cat.description || '' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setToast({ type: 'error', message: 'Category name is required' });
      return;
    }
    try {
      const method = editingCategory ? 'PUT' : 'POST';
      const payload = editingCategory ? { ...formData, id: editingCategory.id } : formData;
      const res = await fetch('/api/admin/categories', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save category');
      setToast({ type: 'success', message: editingCategory ? 'Category updated!' : 'Category created!' });
      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Operation failed' });
    }
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      const res = await fetch(`/api/admin/categories?id=${deletingId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete');
      setToast({ type: 'success', message: 'Category deleted successfully' });
      fetchCategories();
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Deletion failed' });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex-1 pb-12 bg-gray-50">
      <AdminHeader
        title="Category Management"
        subtitle="Organize restaurant menu categories, names, and descriptions"
      />
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      <ConfirmModal
        isOpen={Boolean(deletingId)}
        title="Delete Category?"
        message="Are you sure? Categories with active menu items cannot be deleted until items are removed."
        onConfirm={confirmDelete}
        onCancel={() => setDeletingId(null)}
      />

      <div className="p-6 max-w-5xl mx-auto space-y-5">
        {/* Top bar */}
        <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-200 shadow-sm px-5 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Layers className="w-4 h-4 text-green-600" />
            <span>Total Categories: <strong className="text-gray-900">{categories.length}</strong></span>
          </div>
          <button
            onClick={openAddModal}
            className="px-5 py-2.5 rounded-full text-sm font-bold bg-green-600 hover:bg-green-700 text-white shadow flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" /> Create Category
          </button>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="p-12 text-center text-sm text-green-700 bg-white rounded-3xl border border-green-100">Loading categories...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((cat, idx) => (
              <div
                key={cat.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-start justify-between hover:border-green-300 hover:shadow-md transition group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center border border-green-200 shrink-0">
                      {idx + 1}
                    </span>
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-green-700 transition-colors truncate">
                      {cat.name}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-1 ml-8">
                    {cat.description || 'No description provided.'}
                  </p>
                  <span className="inline-block mt-3 ml-8 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                    {cat._count?.items ?? 0} Item(s)
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-3">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-2 rounded-xl text-blue-500 hover:bg-blue-50 border border-transparent hover:border-blue-200 transition"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletingId(cat.id)}
                    className="p-2 rounded-xl text-red-400 hover:bg-red-50 border border-transparent hover:border-red-200 transition"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
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
              <Layers className="w-5 h-5 text-green-600" />
              {editingCategory ? 'Edit Category' : 'Create New Category'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Pizza, Momos, Cold Coffee"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short description for this category..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
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
                  {editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
