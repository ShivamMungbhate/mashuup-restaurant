'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { MenuItem } from '@/types';

interface FeaturedDishesProps {
  items: MenuItem[];
}

export default function FeaturedDishes({ items }: FeaturedDishesProps) {
  if (!items || items.length === 0) return null;

  return (
    <section id="featured" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 border border-green-200 text-green-700 text-xs font-semibold uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5 text-green-600" />
              Popular Delights
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-green-900 tracking-tight">
              Featured &amp; Popular <span className="green-gradient-text">Items</span>
            </h2>
          </div>
          <Link
            href="/menu"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-bold text-green-700 hover:text-green-900 group"
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
              className="bg-white rounded-3xl overflow-hidden group border border-green-100 hover:border-green-300 hover:shadow-2xl hover:shadow-green-800/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Food Image */}
                <div className="relative h-60 w-full overflow-hidden bg-green-50">
                  <img
                    src={
                      item.image ||
                      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'
                    }
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-green-900/30 via-transparent to-transparent opacity-80" />

                  {/* Badge */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-white/90 text-green-800 border border-green-200 backdrop-blur-md uppercase tracking-wider flex items-center gap-1 shadow">
                      <Sparkles className="w-2.5 h-2.5" /> Popular
                    </span>
                  </div>

                  {/* Price Tag */}
                  <div className="absolute bottom-4 right-4 px-3.5 py-1.5 rounded-2xl bg-white/95 border border-green-200 backdrop-blur-md shadow-lg">
                    <span className="text-lg font-black text-green-800 font-mono">
                      ₹{item.price.toFixed(0)}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-6">
                  {item.category?.name && (
                    <span className="text-[11px] font-bold tracking-widest text-green-600 uppercase block mb-1">
                      {item.category.name}
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-green-900 mb-2 group-hover:text-green-700 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 mb-4 font-light">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-6 pb-6 pt-0 flex items-center justify-between border-t border-green-100 mt-auto">
                <span className="text-[11px] font-medium text-green-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Freshly Prepared
                </span>

                <Link
                  href="/menu"
                  className="text-xs font-bold text-white bg-green-800 px-4 py-1.5 rounded-full hover:bg-green-700 transition shadow"
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
