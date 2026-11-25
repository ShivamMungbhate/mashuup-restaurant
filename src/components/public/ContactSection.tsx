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
    <section className="py-20 bg-green-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-green-100 border border-green-200 text-green-700 text-xs font-bold uppercase tracking-widest mb-3">
            Contact &amp; Location
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-green-900 tracking-tight">
            Visit <span className="green-gradient-text">Mashuup</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-gray-600 font-light">
            We welcome you for delicious Pure Veg food, drinks, and great moments. Tap below to navigate directly or chat on WhatsApp!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Contact Details Card */}
          <div className="bg-white p-8 rounded-3xl border border-green-100 shadow-lg flex flex-col justify-between space-y-6">
            <h3 className="text-xl font-bold text-green-900 flex items-center gap-2 border-b border-green-100 pb-4">
              <MapPin className="w-5 h-5 text-green-600" />
              Contact &amp; Address
            </h3>

            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-green-100 text-green-700 shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-green-700 uppercase tracking-wider">Restaurant Address</h4>
                <p className="text-sm text-gray-700 leading-relaxed mt-1 font-medium">{address}</p>
                <a
                  href={mapDirectionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-800 text-xs font-bold text-white hover:bg-green-700 transition mt-3 shadow-md"
                >
                  <Navigation className="w-4 h-4" /> Get Directions on Google Maps
                </a>
              </div>
            </div>

            {/* Phone & WhatsApp */}
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-green-100 text-green-700 shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-green-700 uppercase tracking-wider">Phone &amp; WhatsApp</h4>
                <a href={`tel:${phone}`} className="text-base text-green-900 hover:text-green-700 mt-1 block font-mono font-bold">
                  +91 {phone}
                </a>
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 border border-green-200 text-xs font-bold text-green-800 hover:bg-green-800 hover:text-white transition mt-2 shadow-md"
                >
                  <WhatsAppIcon className="w-4 h-4" /> Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-green-100 text-green-700 shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-green-700 uppercase tracking-wider">Email Address</h4>
                <a href={`mailto:${email}`} className="text-sm text-gray-600 hover:text-green-800 mt-1 block">
                  {email}
                </a>
              </div>
            </div>

            {/* Instagram */}
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-pink-50 border border-pink-100 text-pink-500 shrink-0">
                <InstagramIcon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-green-700 uppercase tracking-wider">Instagram Profile</h4>
                <a
                  href={instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-pink-600 hover:text-pink-700 font-semibold underline underline-offset-4 mt-1"
                >
                  @mashuupcafe_ on Instagram
                </a>
              </div>
            </div>
          </div>

          {/* Opening Hours Card */}
          <div className="bg-white p-8 rounded-3xl border border-green-100 shadow-lg flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-green-900 flex items-center gap-2 border-b border-green-100 pb-4 mb-6">
                <Clock className="w-5 h-5 text-green-600" />
                Opening Hours (Open Daily)
              </h3>

              <div className="space-y-3">
                {hours && hours.length > 0 ? (
                  hours.map((h) => (
                    <div
                      key={h.id}
                      className="flex items-center justify-between text-xs py-2 border-b border-green-50"
                    >
                      <span className="font-semibold text-green-900">{h.day}</span>
                      {h.isClosed ? (
                        <span className="px-2.5 py-0.5 rounded bg-red-100 text-red-600 font-bold uppercase text-[10px]">
                          Closed
                        </span>
                      ) : (
                        <span className="text-green-700 font-mono font-bold text-sm">
                          {h.openTime} - {h.closeTime}
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500">Open daily 11:00 AM - 11:00 PM</p>
                )}
              </div>
            </div>

            <div className="mt-8 p-4 rounded-2xl bg-green-800 text-center">
              <p className="text-xs text-white font-bold uppercase tracking-wider">
                🌿 Fresh &amp; Delicious Pure Veg Food
              </p>
            </div>
          </div>
        </div>

        {/* Embedded Google Maps */}
        <div className="bg-white rounded-3xl overflow-hidden border border-green-100 shadow-lg h-96 relative group">
          <iframe
            title="Mashuup Restaurant Location Map"
            src={embedMapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
          />

          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 p-4 rounded-2xl bg-white border border-green-200 shadow-2xl flex items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-extrabold text-green-900">Mashuup Location</h4>
              <p className="text-xs text-gray-500 font-light">Near Pola Ground, Poonam Chamber, Chhindwara</p>
            </div>
            <a
              href={mapDirectionsUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-full text-xs font-bold text-white green-gradient-bg shadow-lg hover:scale-105 transition flex items-center gap-1.5 shrink-0"
            >
              <Navigation className="w-3.5 h-3.5" /> Navigate
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
