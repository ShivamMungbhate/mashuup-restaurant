'use client';

import React, { useState, useMemo } from 'react';
import { MenuCategory, MenuItem } from '@/types';
import { Search, Sparkles, CheckCircle2, XCircle, Utensils, Leaf } from 'lucide-react';

interface MenuGridProps {
  categories: (MenuCategory & { items: MenuItem[] })[];
  initialCategory?: string;
}

export default function MenuGrid({ categories, initialCategory }: MenuGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const allItems = useMemo(() => {
    return categories.flatMap((cat) =>
      cat.items.map((item) => ({ ...item, categoryName: cat.name }))
    );
  }, [categories]);

  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      if (selectedCategory !== 'all' && item.categoryId !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        return (
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.categoryName?.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [allItems, selectedCategory, searchQuery]);

  return (
    <div className="space-y-10">
      {/* Controls */}
      <div className="bg-white rounded-3xl border border-green-100 shadow-sm p-6 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-green-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search dishes or drinks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-green-50 border border-green-200 rounded-full pl-11 pr-4 py-3 text-xs text-green-900 placeholder-green-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-200 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-green-500 hover:text-green-800"
              >
                Clear
              </button>
            )}
          </div>

          {/* Pure Veg Pill */}
          <div className="flex items-center gap-2 bg-green-800 px-4 py-2 rounded-full text-white text-xs font-bold uppercase tracking-wider">
            <Leaf className="w-4 h-4 text-green-300" />
            <span>100% Pure Veg Menu</span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-t border-green-100 pt-4">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-green-800 text-white shadow-md shadow-green-800/20 scale-105'
                : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
            }`}
          >
            All Items ({allItems.length})
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-green-800 text-white shadow-md shadow-green-800/20 scale-105'
                  : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
              }`}
            >
              {cat.name} ({cat.items.length})
            </button>
          ))}
        </div>
      </div>

      {/* Menu Cards */}
      {filteredItems.length === 0 ? (
        <div className="bg-green-50 p-12 rounded-3xl text-center border border-green-100 max-w-md mx-auto">
          <Utensils className="w-12 h-12 text-green-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-green-900 mb-2">No menu items found</h3>
          <p className="text-xs text-gray-500 mb-6">Try adjusting your search or category.</p>
          <button
            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
            className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-green-800 hover:bg-green-700 transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-3xl overflow-hidden flex flex-col justify-between border transition-all duration-300 ${
                item.isAvailable
                  ? 'border-green-100 hover:border-green-300 hover:shadow-xl hover:shadow-green-800/10 hover:-translate-y-1'
                  : 'opacity-70 border-red-100'
              }`}
            >
              <div>
                {/* Image */}
                <div className="relative h-52 w-full bg-green-50 overflow-hidden">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-green-900/30 via-transparent to-transparent opacity-80" />

                  {/* Featured Badge */}
                  {item.isFeatured && (
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-white/90 text-green-800 border border-green-200 backdrop-blur-md uppercase flex items-center gap-1 shadow">
                        <Sparkles className="w-2.5 h-2.5" /> Popular
                      </span>
                    </div>
                  )}

                  {/* Unavailable Overlay */}
                  {!item.isAvailable && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                      <span className="px-4 py-1.5 rounded-full bg-red-100 text-red-600 border border-red-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <XCircle className="w-4 h-4" /> Currently Unavailable
                      </span>
                    </div>
                  )}

                  {/* Price Tag */}
                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-white/95 border border-green-200 backdrop-blur-md shadow">
                    <span className="text-base font-bold text-green-800 font-mono">
                      ₹{item.price.toFixed(0)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="text-[10px] font-bold tracking-widest text-green-500 uppercase mb-1">
                    {item.categoryName || 'Mashuup Special'}
                  </div>
                  <h3 className="text-lg font-bold text-green-900 mb-2">{item.name}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-light line-clamp-3">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 pb-5 pt-0 flex items-center justify-between border-t border-green-100 mt-auto">
                <span className="text-[10px] text-green-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-green-500" /> Freshly Prepared
                </span>
                <span className="text-[11px] font-bold text-green-700 font-mono">
                  ₹{item.price.toFixed(0)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
