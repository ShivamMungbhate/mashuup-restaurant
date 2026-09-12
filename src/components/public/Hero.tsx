'use client';

import React from 'react';
import Link from 'next/link';
import { Utensils, MapPin, Clock, Leaf, Sparkles, ChevronDown } from 'lucide-react';
import { Restaurant, OpeningHour } from '@/types';
import WhatsAppIcon from './WhatsAppIcon';

interface HeroProps {
  restaurant: Restaurant | null;
  hours?: OpeningHour[];
}

export default function Hero({ restaurant, hours }: HeroProps) {
  const name = restaurant?.name || 'Mashuup';
  const tagline = restaurant?.tagline || 'Delicious Food & Great Moments.';
  const description =
    restaurant?.description ||
    'A contemporary 100% Pure Veg restaurant serving fresh grilled sandwiches, thick shakes, fruit juices, crispy snacks, and delicious street-food favorites.';
  const heroImg =
    restaurant?.heroImage ||
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80';
  const logoUrl = restaurant?.logo || '/logo.png';
  const phone = restaurant?.phone || '9009310300';
  const whatsappNumber = `91${phone.replace(/[^0-9]/g, '')}`;

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden">
      {/* Background Image with Dark Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImg}
          alt={name}
          className="w-full h-full object-cover scale-105 filter brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f140e] via-[#0f140e]/80 to-black/70" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Logo Banner Container */}
        <div className="mb-6 flex justify-center">
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-amber-400/80 p-1 bg-black shadow-2xl shadow-amber-500/30 hover:scale-105 transition-transform duration-500">
            <img src={logoUrl} alt={name} className="w-full h-full object-cover rounded-full" />
          </div>
        </div>

        {/* Top Pure Veg Badge (Displayed Once Prominently) */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-xs sm:text-sm font-extrabold uppercase tracking-widest backdrop-blur-md mb-6 shadow-lg shadow-emerald-950/50">
          <Leaf className="w-4 h-4 text-emerald-400" />
          100% Pure Vegetarian
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white mb-4 uppercase drop-shadow-2xl font-serif">
          <span className="gold-gradient-text block">{name}</span>
        </h1>

        {/* Tagline */}
        <p className="text-xl sm:text-2xl font-light italic text-amber-200/90 mb-6 font-serif tracking-wide">
          "{tagline}"
        </p>

        {/* Description */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-300 mb-10 leading-relaxed font-normal">
          {description}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-14">
          <Link
            href="/menu"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest text-zinc-950 gold-gradient-bg shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 active:scale-95 transition flex items-center justify-center gap-2 group"
          >
            <Utensils className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            View Menu
          </Link>

          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 hover:bg-emerald-900/90 hover:border-emerald-500/60 backdrop-blur-md hover:scale-105 active:scale-95 transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/30"
          >
            <WhatsAppIcon className="w-4 h-4 text-emerald-400" />
            WhatsApp Us
          </a>

          <Link
            href="/contact"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest text-amber-200 bg-white/5 border border-amber-500/30 hover:bg-amber-500/10 hover:border-amber-500/50 backdrop-blur-md hover:scale-105 active:scale-95 transition flex items-center justify-center gap-2"
          >
            <MapPin className="w-4 h-4 text-amber-400" />
            Location & Contact
          </Link>
        </div>

        {/* Key Feature Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div className="glass-card p-4 rounded-2xl flex items-center gap-3 text-left">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-amber-100 uppercase tracking-wider">
                Fresh & Pure
              </h3>
              <p className="text-xs text-zinc-400">Quality ingredients daily</p>
            </div>
          </div>

          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card p-4 rounded-2xl flex items-center gap-3 text-left hover:border-emerald-500/40 transition group"
          >
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
              <WhatsAppIcon className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-wider group-hover:underline">
                Instant WhatsApp
              </h3>
              <p className="text-xs text-zinc-400">Tap to chat with us</p>
            </div>
          </a>

          <div className="glass-card p-4 rounded-2xl flex items-center gap-3 text-left">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-amber-100 uppercase tracking-wider">
                Open All Days
              </h3>
              <p className="text-xs text-zinc-400">11:00 AM - 11:00 PM</p>
            </div>
          </div>
        </div>

        {/* Down Indicator */}
        <div className="mt-12 flex justify-center">
          <a
            href="#featured"
            className="p-2.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 hover:bg-amber-500/20 transition animate-bounce"
            aria-label="Scroll Down"
          >
            <ChevronDown className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
