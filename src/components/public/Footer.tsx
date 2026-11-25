'use client';

import React from 'react';
import Link from 'next/link';
import { Utensils, MapPin, Phone, Mail, ShieldLock } from 'lucide-react';
import InstagramIcon from '@/components/public/InstagramIcon';
import WhatsAppIcon from '@/components/public/WhatsAppIcon';
import { Restaurant, OpeningHour } from '@/types';

interface FooterProps {
  restaurant: Restaurant | null;
  hours?: OpeningHour[];
}

export default function Footer({ restaurant, hours }: FooterProps) {
  const name = restaurant?.name || 'Mashuup';
  const tagline = restaurant?.tagline || 'Delicious Food & Great Moments.';
  const address =
    restaurant?.address || 'Near Pola Ground, Poonam Chamber, Chhindwara, Madhya Pradesh';
  const phone = restaurant?.phone || '9009310300';
  const email = restaurant?.email || 'mashupfoodcart@gmail.com';
  const instagram =
    restaurant?.instagramUrl ||
    'https://www.instagram.com/mashuupcafe_?stkn=MTE1cGI5bzFxOHFlOA==';

  return (
    <footer className="bg-green-900 text-green-100 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-green-900 font-bold">
                <Utensils className="w-4 h-4" />
              </div>
              <span className="text-lg font-black text-white tracking-wider font-serif">{name}</span>
            </Link>
            <p className="text-xs text-green-200 italic">&ldquo;{tagline}&rdquo;</p>
            <p className="text-xs text-green-300/80 leading-relaxed font-light">
              Crafting fine meals and artisanal culinary experiences with fresh local ingredients.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-green-300">Quick Navigation</h4>
            <ul className="space-y-2 text-xs text-green-200">
              <li><Link href="/" className="hover:text-white transition">Home</Link></li>
              <li><Link href="/menu" className="hover:text-white transition">Our Menu</Link></li>
              <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link href="/gallery" className="hover:text-white transition">Photo Gallery</Link></li>
              <li><Link href="/location" className="hover:text-white transition">Location &amp; Directions</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact &amp; Inquiry</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-green-300">Contact Us</h4>
            <div className="space-y-2.5 text-xs text-green-200">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                <span>{address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-green-400 shrink-0" />
                <a href={`tel:${phone}`} className="hover:text-white font-mono">+91 {phone}</a>
              </p>
              <p className="flex items-center gap-2">
                <WhatsAppIcon className="w-4 h-4 text-green-400 shrink-0" />
                <a
                  href={`https://wa.me/91${phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white text-green-300 font-medium"
                >
                  WhatsApp Us
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-green-400 shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-white">{email}</a>
              </p>
              <p className="flex items-center gap-2">
                <InstagramIcon className="w-4 h-4 text-pink-400 shrink-0" />
                <a href={instagram} target="_blank" rel="noreferrer" className="hover:text-pink-300 text-pink-300 font-medium">
                  @mashuupcafe_
                </a>
              </p>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-green-300">Hours of Operation</h4>
            <div className="space-y-1.5 text-xs">
              {hours && hours.length > 0 ? (
                hours.slice(0, 3).map((h) => (
                  <div key={h.id} className="flex justify-between text-green-200">
                    <span>{h.day}:</span>
                    <span className="font-mono text-green-100">
                      {h.isClosed ? 'Closed' : `${h.openTime} - ${h.closeTime}`}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-green-300">Open daily 11:00 AM - 11:00 PM</p>
              )}
            </div>

            <div className="pt-3 border-t border-white/10">
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold text-green-200 bg-white/10 border border-white/20 hover:text-white hover:bg-white/20 transition"
              >
                <ShieldLock className="w-3.5 h-3.5" />
                Owner Admin Portal
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-green-400 gap-4">
          <p>© {new Date().getFullYear()} {name}. All rights reserved. 🌿 100% Pure Veg</p>
          <p className="text-green-500">Built with Next.js, Tailwind CSS &amp; Prisma</p>
        </div>
      </div>
    </footer>
  );
}
