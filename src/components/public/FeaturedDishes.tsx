'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, CheckCircle2, Leaf } from 'lucide-react';
import { MenuItem } from '@/types';

interface FeaturedDishesProps {
  items: MenuItem[];
}

export default function FeaturedDishes({ items }: FeaturedDishesProps) {
  if (!items || items.length === 0) return null;

  return (
    <section id="featured" className="py-20 bg-gradient-to-b from-[#0f140e] via-[#141c13] to-[#0f140e] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-widest mb-3">
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              100% Pure Veg • Popular Delights
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Featured & Popular <span className="gold-gradient-text">Items</span>
            </h2>
          </div>
          <Link
            href="/menu"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-bold text-amber-400 hover:text-amber-300 group"
          >
            View Complete Menu
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Featured Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.slice(0, 6).map((item) => (
            <div
              key={item.id}
              className="glass-card rounded-3xl overflow-hidden group hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Food Image */}
                <div className="relative h-60 w-full overflow-hidden bg-zinc-900">
                  <img
                    src={
                      item.image ||
                      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'
                    }
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a2016] via-transparent to-transparent opacity-80" />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 backdrop-blur-md uppercase tracking-wider flex items-center gap-1">
                      <Leaf className="w-2.5 h-2.5 text-emerald-400" /> 100% Pure Veg
                    </span>

                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-950/80 text-amber-300 border border-amber-500/40 backdrop-blur-md uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" /> Popular
                    </span>
                  </div>

                  {/* Price Tag */}
                  <div className="absolute bottom-4 right-4 px-3.5 py-1.5 rounded-2xl bg-zinc-950/90 border border-amber-500/30 backdrop-blur-md shadow-lg">
                    <span className="text-lg font-black text-amber-300 font-mono">
                      ₹{item.price.toFixed(0)}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-6">
                  {item.category?.name && (
                    <span className="text-[11px] font-bold tracking-widest text-amber-400/80 uppercase block mb-1">
                      {item.category.name}
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-zinc-300 leading-relaxed line-clamp-3 mb-4 font-light">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-6 pb-6 pt-0 flex items-center justify-between border-t border-amber-500/10 mt-auto">
                <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Freshly Prepared
                </span>

                <Link
                  href="/menu"
                  className="text-xs font-bold text-amber-300 hover:text-amber-200 underline underline-offset-4"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
