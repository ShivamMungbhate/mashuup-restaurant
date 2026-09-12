'use client';

import React from 'react';
import { Restaurant, OpeningHour } from '@/types';
import { MapPin, Phone, Mail, Clock, Navigation } from 'lucide-react';
import InstagramIcon from '@/components/public/InstagramIcon';
import WhatsAppIcon from '@/components/public/WhatsAppIcon';

interface ContactSectionProps {
  restaurant: Restaurant | null;
  hours: OpeningHour[];
}

export default function ContactSection({ restaurant, hours }: ContactSectionProps) {
  const address =
    restaurant?.address || 'Near Pola Ground, Poonam Chamber, Chhindwara, Madhya Pradesh';
  const phone = restaurant?.phone || '9009310300';
  const email = restaurant?.email || 'mashupfoodcart@gmail.com';
  const whatsappNumber = `91${phone.replace(/[^0-9]/g, '')}`;
  const instagram =
    restaurant?.instagramUrl ||
    'https://www.instagram.com/mashuupcafe_?stkn=MTE1cGI5bzFxOHFlOA==';
  const mapDirectionsUrl =
    restaurant?.mapUrl ||
    'https://www.google.com/maps/place/Kalptaru+Healthcare+Birth+AND+Breath/@22.0488697,78.9283554,3229m/data=!3m1!1e3!4m10!1m2!2m1!1sKalptaru+chhindwara!3m6!1s0x3bd5693dbca53207:0xbef3933eb3ca1f65!8m2!3d22.0488697!4d78.9371101!15sChNLYWxwdGFydSBjaGhpbmR3YXJhWhUiE2thbHB0YXJ1IGNoaGluZHdhcmGSAQhob3NwaXRhbJoBI0NoWkRTVWhOTUc5blMwVkpRMEZuVFVSM2FDMVRVbVJCRUFF4AEA-gEECAAQPA!16s%2Fg%2F11y2tdkn5t?authuser=0&entry=ttu&g_ep=EgoyMDI2MDkwOC4wIKXMDSoASAFQAw%3D%3D';

  const embedMapUrl = 'https://maps.google.com/maps?q=22.0488697,78.9371101&hl=en&z=16&output=embed';

  return (
    <section className="py-20 bg-[#0f140e] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-3">
            Contact & Location
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Visit <span className="gold-gradient-text">Mashuup</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-300 font-light">
            We welcome you for delicious Pure Veg food, drinks, and great moments. Tap below to navigate directly or chat on WhatsApp!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Contact Details Card */}
          <div className="glass-card p-8 rounded-3xl border-amber-500/20 flex flex-col justify-between space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2 border-b border-amber-500/15 pb-4">
              <MapPin className="w-5 h-5 text-amber-400" />
              Contact & Address
            </h3>

            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-200 uppercase tracking-wider">Restaurant Address</h4>
                <p className="text-sm text-zinc-300 leading-relaxed mt-1 font-medium">{address}</p>
                <a
                  href={mapDirectionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-300 hover:bg-amber-500 hover:text-zinc-950 transition mt-3 shadow-md"
                >
                  <Navigation className="w-4 h-4" /> Get Directions on Google Maps
                </a>
              </div>
            </div>

            {/* Phone & WhatsApp */}
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-200 uppercase tracking-wider">Phone & WhatsApp</h4>
                <a href={`tel:${phone}`} className="text-base text-white hover:text-amber-300 mt-1 block font-mono font-bold">
                  +91 {phone}
                </a>
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-400 hover:bg-emerald-500 hover:text-zinc-950 transition mt-2 shadow-md"
                >
                  <WhatsAppIcon className="w-4 h-4 text-emerald-400" /> Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-200 uppercase tracking-wider">Email Address</h4>
                <a href={`mailto:${email}`} className="text-sm text-zinc-300 hover:text-amber-300 mt-1 block">
                  {email}
                </a>
              </div>
            </div>

            {/* Instagram */}
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-pink-500/10 border border-pink-500/30 text-pink-400 shrink-0">
                <InstagramIcon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-200 uppercase tracking-wider">Instagram Profile</h4>
                <a
                  href={instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-pink-300 hover:text-pink-200 font-semibold underline underline-offset-4 mt-1"
                >
                  @mashuupcafe_ on Instagram
                </a>
              </div>
            </div>
          </div>

          {/* Opening Hours Card */}
          <div className="glass-card p-8 rounded-3xl border-amber-500/20 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2 border-b border-amber-500/15 pb-4 mb-6">
                <Clock className="w-5 h-5 text-amber-400" />
                Opening Hours (Open Daily)
              </h3>

              <div className="space-y-3">
                {hours && hours.length > 0 ? (
                  hours.map((h) => (
                    <div
                      key={h.id}
                      className="flex items-center justify-between text-xs py-2 border-b border-white/5"
                    >
                      <span className="font-semibold text-amber-100">{h.day}</span>
                      {h.isClosed ? (
                        <span className="px-2.5 py-0.5 rounded bg-rose-950 text-rose-400 font-bold uppercase text-[10px]">
                          Closed
                        </span>
                      ) : (
                        <span className="text-emerald-300 font-mono font-bold text-sm">
                          {h.openTime} - {h.closeTime}
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-400">Open daily 11:00 AM - 11:00 PM</p>
                )}
              </div>
            </div>

            <div className="mt-8 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <p className="text-xs text-emerald-300 font-bold uppercase tracking-wider">
                Fresh & Delicious Pure Veg Food
              </p>
            </div>
          </div>
        </div>

        {/* Embedded Google Maps Container */}
        <div className="glass-card rounded-3xl overflow-hidden border border-amber-500/20 h-96 relative group">
          <iframe
            title="Mashuup Restaurant Location Map"
            src={embedMapUrl}
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
            allowFullScreen={false}
            loading="lazy"
          />

          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 p-4 rounded-2xl glass-card border border-amber-500/30 shadow-2xl flex items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-extrabold text-white">Mashuup Location</h4>
              <p className="text-xs text-amber-200/80 font-light">Near Pola Ground, Poonam Chamber, Chhindwara</p>
            </div>
            <a
              href={mapDirectionsUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-full text-xs font-bold text-zinc-950 gold-gradient-bg shadow-lg hover:scale-105 transition flex items-center gap-1.5 shrink-0"
            >
              <Navigation className="w-3.5 h-3.5" /> Navigate
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
