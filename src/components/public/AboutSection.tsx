'use client';

import React from 'react';
import Link from 'next/link';
import { Leaf, HeartHandshake, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { Restaurant } from '@/types';

interface AboutSectionProps {
  restaurant: Restaurant | null;
}

export default function AboutSection({ restaurant }: AboutSectionProps) {
  const name = restaurant?.name || 'Mashuup';
  const aboutText =
    restaurant?.about ||
    'Welcome to Mashuup! We are a brand new restaurant and food cart bringing together traditional recipes and modern street-food favorites. Our team selects fresh, high-quality ingredients to deliver an unforgettable dining experience.';
  const imgUrl =
    restaurant?.restaurantImage ||
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80';

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Subtle decorative bg */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, #f0faf3 0%, #ffffff 40%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Column */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-green-100 group">
              <img
                src={imgUrl}
                alt={name}
                className="w-full h-[480px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/40 via-transparent to-transparent" />
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-6 -right-4 sm:bottom-6 sm:right-6 bg-white p-5 rounded-2xl border border-green-200 shadow-2xl max-w-xs">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-green-800 text-white">
                  <Leaf className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-extrabold text-green-900 font-serif">Fresh & Hygienic</h4>
                  <p className="text-xs text-green-600 font-medium">Prepared Fresh Daily</p>
                </div>
              </div>
            </div>
          </div>

          {/* Text Content Column */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-green-100 border border-green-200 text-green-700 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" /> Welcome To Our Kitchen
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-green-900 tracking-tight leading-tight">
              Delicious Food &amp; <br />
              <span className="green-gradient-text font-serif">Great Moments</span>
            </h2>

            <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-light">
              {aboutText}
            </p>

            {/* Core Values */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 bg-green-50 p-4 rounded-xl border border-green-100">
                <ShieldCheck className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-green-900">Pure Vegetarian Kitchen</h4>
                  <p className="text-xs text-gray-500">Strictly vegetarian & hygienic</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-green-50 p-4 rounded-xl border border-green-100">
                <HeartHandshake className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-green-900">Warm Hospitality</h4>
                  <p className="text-xs text-gray-500">Friendly & attentive service</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-white green-gradient-bg shadow-lg shadow-green-800/20 hover:shadow-green-800/40 hover:scale-105 transition group"
              >
                Read Full Story
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
