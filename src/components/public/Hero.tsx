'use client';

import React from 'react';
import Link from 'next/link';
import { Utensils, MapPin, Clock, Leaf, ChevronDown } from 'lucide-react';
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
    <section
      className="relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0d4a1f 0%, #145a28 50%, #1a7a35 100%)' }}
    >
      {/* Subtle background image overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImg}
          alt={name}
          className="w-full h-full object-cover scale-105 filter brightness-20 opacity-20"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(13,74,31,0.92) 0%, rgba(20,90,40,0.88) 50%, rgba(26,122,53,0.85) 100%)' }} />
      </div>

      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(74,222,128,0.12), transparent)', transform: 'translate(30%,-30%)' }} />
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(34,160,74,0.12), transparent)', transform: 'translate(-30%,30%)' }} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 p-1 shadow-2xl hover:scale-105 transition-transform duration-500" style={{ borderColor: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}>
            <img src={logoUrl} alt={name} className="w-full h-full object-cover rounded-full bg-white" />
          </div>
        </div>

        {/* Pure Veg Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border text-white/90 text-xs sm:text-sm font-extrabold uppercase tracking-widest backdrop-blur-md mb-6 shadow-lg" style={{ background: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.3)' }}>
          <Leaf className="w-4 h-4 text-green-300" />
          100% Pure Vegetarian
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white mb-4 uppercase drop-shadow-2xl font-serif">
          {name}
        </h1>

        {/* Tagline */}
        <p className="text-xl sm:text-2xl font-light italic mb-6 font-serif tracking-wide" style={{ color: 'rgba(187,247,208,0.9)' }}>
          &ldquo;{tagline}&rdquo;
        </p>

        {/* Description */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg mb-10 leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
          {description}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-14">
          <Link
            href="/menu"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest bg-white text-green-900 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition flex items-center justify-center gap-2 group"
          >
            <Utensils className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            View Menu
          </Link>

          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest text-white border hover:scale-105 active:scale-95 transition flex items-center justify-center gap-2 shadow-lg"
            style={{ borderColor: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}
          >
            <WhatsAppIcon className="w-4 h-4 text-green-300" />
            WhatsApp Us
          </a>

          <Link
            href="/contact"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest text-green-200 border hover:scale-105 active:scale-95 transition flex items-center justify-center gap-2"
            style={{ borderColor: 'rgba(74,222,128,0.4)', background: 'rgba(255,255,255,0.05)' }}
          >
            <MapPin className="w-4 h-4 text-green-300" />
            Location & Contact
          </Link>
        </div>

        {/* Key Feature Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl flex items-center gap-3 text-left" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <div className="p-2.5 rounded-xl text-green-300" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Fresh & Pure</h3>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Quality ingredients daily</p>
            </div>
          </div>

          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl flex items-center gap-3 text-left hover:scale-105 transition group"
            style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            <div className="p-2.5 rounded-xl text-green-300 group-hover:scale-110 transition-transform" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <WhatsAppIcon className="w-5 h-5 text-green-300" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider group-hover:underline">Instant WhatsApp</h3>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Tap to chat with us</p>
            </div>
          </a>

          <div className="p-4 rounded-2xl flex items-center gap-3 text-left" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <div className="p-2.5 rounded-xl text-green-300" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Open All Days</h3>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>11:00 AM - 11:00 PM</p>
            </div>
          </div>
        </div>

        {/* Down Indicator */}
        <div className="mt-12 flex justify-center">
          <a
            href="#featured"
            className="p-2.5 rounded-full border text-white/70 hover:text-white transition animate-bounce"
            style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)' }}
            aria-label="Scroll Down"
          >
            <ChevronDown className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
