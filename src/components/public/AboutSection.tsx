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
    'Welcome to Mashuup! We are a brand new 100% Pure Veg restaurant and food cart bringing together traditional recipes and modern street-food favorites. Our team selects fresh, quality ingredients to deliver an unforgettable self-service dining experience.';
  const imgUrl =
    restaurant?.restaurantImage ||
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80';
  const logoUrl = restaurant?.logo || '/logo.png';

  return (
    <section className="py-24 bg-[#0f140e] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Column */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-amber-500/20 group">
              <img
                src={imgUrl}
                alt={name}
                className="w-full h-[480px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            </div>

            {/* Brand Pure Veg Floating Badge */}
            <div className="absolute -bottom-6 -right-4 sm:bottom-6 sm:right-6 glass-card p-5 rounded-2xl border border-emerald-500/30 shadow-2xl max-w-xs">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                  <Leaf className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-extrabold text-white font-serif">100% Pure Veg</h4>
                  <p className="text-xs text-emerald-300/90 font-medium">Self Service & Fresh Taste</p>
                </div>
              </div>
            </div>
          </div>

          {/* Text Content Column */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" /> Welcome To Our Kitchen
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Delicious Food & <br />
              <span className="gold-gradient-text font-serif">Great Moments</span>
            </h2>

            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed font-light">
              {aboutText}
            </p>

            {/* Core Values */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 glass-card p-4 rounded-xl border-amber-500/10">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">100% Pure Vegetarian</h4>
                  <p className="text-xs text-zinc-400">Strictly vegetarian & hygienic</p>
                </div>
              </div>

              <div className="flex items-start gap-3 glass-card p-4 rounded-xl border-amber-500/10">
                <HeartHandshake className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Quick Self Service</h4>
                  <p className="text-xs text-zinc-400">Convenient & fast ordering</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition group"
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
