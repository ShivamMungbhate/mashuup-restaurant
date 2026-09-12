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

  // Extract all items flattened
  const allItems = useMemo(() => {
    return categories.flatMap((cat) =>
      cat.items.map((item) => ({ ...item, categoryName: cat.name }))
    );
  }, [categories]);

  // Filter items dynamically
  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      // Category Filter
      if (selectedCategory !== 'all' && item.categoryId !== selectedCategory) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesCat = item.categoryName?.toLowerCase().includes(query);
        return matchesName || matchesDesc || matchesCat;
      }

      return true;
    });
  }, [allItems, selectedCategory, searchQuery]);

  return (
    <div className="space-y-10">
      {/* Controls Header: Search & Pure Veg Pill */}
      <div className="glass-card p-6 rounded-3xl border border-amber-500/20 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-amber-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search dishes or drinks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950/80 border border-amber-500/30 rounded-full pl-11 pr-4 py-3 text-xs text-amber-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-amber-300"
              >
                Clear
              </button>
            )}
          </div>

          {/* Menu Category Badge Pill */}
          <div className="flex items-center gap-2 bg-emerald-950/80 px-4 py-2 rounded-full border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Leaf className="w-4 h-4 text-emerald-400" />
            <span>Pure Veg Menu</span>
          </div>
        </div>

        {/* Dynamic Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-t border-amber-500/10 pt-4">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'gold-gradient-bg text-zinc-950 shadow-md shadow-amber-500/20 scale-105'
                : 'bg-zinc-900/80 text-amber-200/80 hover:bg-amber-500/10 border border-amber-500/20'
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
                  ? 'gold-gradient-bg text-zinc-950 shadow-md shadow-amber-500/20 scale-105'
                  : 'bg-zinc-900/80 text-amber-200/80 hover:bg-amber-500/10 border border-amber-500/20'
              }`}
            >
              {cat.name} ({cat.items.length})
            </button>
          ))}
        </div>
      </div>

      {/* Menu Cards Display */}
      {filteredItems.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl text-center border-amber-500/20 max-w-md mx-auto">
          <Utensils className="w-12 h-12 text-amber-400/50 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No menu items found</h3>
          <p className="text-xs text-zinc-400 mb-6">
            Try adjusting your search keywords or category selection.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="px-6 py-2.5 rounded-full text-xs font-bold text-zinc-950 gold-gradient-bg"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`glass-card rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 ${
                item.isAvailable
                  ? 'hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/10'
                  : 'opacity-70 grayscale-30 border-red-500/20'
              }`}
            >
              <div>
                {/* Food Image Banner */}
                <div className="relative h-52 w-full bg-zinc-900 overflow-hidden">
                  <img
                    src={
                      item.image ||
                      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'
                    }
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a2016] via-transparent to-transparent opacity-80" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {item.isFeatured && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-950/90 text-amber-300 border border-amber-500/40 backdrop-blur-md uppercase flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" /> Popular
                      </span>
                    )}
                  </div>

                  {/* Availability Badge */}
                  {!item.isAvailable && (
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center">
                      <span className="px-4 py-1.5 rounded-full bg-rose-950 text-rose-200 border border-rose-500/50 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <XCircle className="w-4 h-4" /> Currently Unavailable
                      </span>
                    </div>
                  )}

                  {/* Price Tag */}
                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-zinc-950/90 border border-amber-500/30 backdrop-blur-md">
                    <span className="text-base font-bold text-amber-300 font-mono">
                      ₹{item.price.toFixed(0)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="text-[10px] font-bold tracking-widest text-amber-400/70 uppercase mb-1">
                    {item.categoryName || 'Mashuup Special'}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.name}</h3>
                  <p className="text-xs text-zinc-300/90 leading-relaxed font-light line-clamp-3">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Footer Status */}
              <div className="px-5 pb-5 pt-0 flex items-center justify-between border-t border-amber-500/10 mt-auto">
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Freshly Prepared
                </span>

                <span className="text-[11px] font-bold text-amber-400 font-mono">
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
