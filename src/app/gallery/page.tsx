import React from 'react';
import Header from '@/components/public/Header';
import GalleryGrid from '@/components/public/GalleryGrid';
import Footer from '@/components/public/Footer';
import { prisma } from '@/lib/prisma';
import { Image as ImageIcon } from 'lucide-react';

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
    <main className="min-h-screen bg-[#0f140e] text-[#f4e6c9] pt-28 pb-16">
      <Header restaurant={restaurant} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-widest mb-4">
            <ImageIcon className="w-3.5 h-3.5" /> Photo Gallery
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight mb-4">
            Restaurant <span className="gold-gradient-text font-serif">Atmosphere</span>
          </h1>
          <p className="text-base sm:text-lg text-zinc-300 font-light">
            Take a visual tour through our dining hall, open kitchen, signature dishes, and vibrant cocktail lounge.
          </p>
        </div>

        <GalleryGrid images={gallery} />
      </div>

      <div className="mt-20">
        <Footer restaurant={restaurant} hours={hours} />
      </div>
    </main>
  );
}
