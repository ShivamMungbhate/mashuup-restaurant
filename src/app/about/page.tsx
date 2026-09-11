import React from 'react';
import Header from '@/components/public/Header';
import AboutSection from '@/components/public/AboutSection';
import Footer from '@/components/public/Footer';
import { prisma } from '@/lib/prisma';

export const revalidate = 0;

export default async function AboutPage() {
  const [restaurant, hours] = await Promise.all([
    prisma.restaurant.findFirst(),
    prisma.openingHour.findMany({
      orderBy: { displayOrder: 'asc' },
    }),
  ]);

  return (
    <main className="min-h-screen bg-[#0f140e] text-[#f4e6c9] pt-28">
      <Header restaurant={restaurant} />

      {/* Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10">
        <h1 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight mb-4">
          About <span className="gold-gradient-text font-serif">The Olive Table</span>
        </h1>
        <p className="text-base sm:text-lg text-zinc-300 font-light max-w-2xl mx-auto">
          Our culinary philosophy, commitment to artisanal freshness, and passion for exceptional hospitality.
        </p>
      </div>

      <AboutSection restaurant={restaurant} />

      <Footer restaurant={restaurant} hours={hours} />
    </main>
  );
}
