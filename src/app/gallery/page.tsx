import React from 'react';
import Header from '@/components/public/Header';
import GalleryGrid from '@/components/public/GalleryGrid';
import Footer from '@/components/public/Footer';
import { prisma } from '@/lib/prisma';
import { Image as ImageIcon, Leaf } from 'lucide-react';

export const revalidate = 0;

export default async function GalleryPage() {
  const [restaurant, gallery, hours] = await Promise.all([
    prisma.restaurant.findFirst(),
    prisma.galleryImage.findMany({
      orderBy: { displayOrder: 'asc' },
    }),
    prisma.openingHour.findMany({
      orderBy: { displayOrder: 'asc' },
    }),
  ]);

  return (
    <main className="min-h-screen bg-white text-green-900 pt-28 pb-16">
      <Header restaurant={restaurant} />

      {/* Page Banner */}
      <div style={{ background: 'linear-gradient(135deg, #0d4a1f 0%, #145a28 100%)' }} className="pt-16 pb-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/30 text-white/90 text-xs font-bold uppercase tracking-widest mb-4" style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}>
            <ImageIcon className="w-3.5 h-3.5 text-green-300" /> Photo Gallery
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight mb-4 font-serif">
            Our <span className="text-green-300">Gallery</span>
          </h1>
          <p className="text-base sm:text-lg text-white/70 font-light">
            A visual tour of our restaurant, our fresh food, and the happy moments at Mashuup.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <GalleryGrid images={gallery} />
      </div>

      <Footer restaurant={restaurant} hours={hours} />
    </main>
  );
}
