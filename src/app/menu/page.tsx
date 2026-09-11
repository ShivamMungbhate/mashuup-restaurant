import React from 'react';
import Header from '@/components/public/Header';
import MenuGrid from '@/components/public/MenuGrid';
import Footer from '@/components/public/Footer';
import { prisma } from '@/lib/prisma';
import { Utensils } from 'lucide-react';

export const revalidate = 0;

export default async function MenuPage() {
  const [restaurant, categories, hours] = await Promise.all([
    prisma.restaurant.findFirst(),
    prisma.menuCategory.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        items: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    }),
    prisma.openingHour.findMany({
      orderBy: { displayOrder: 'asc' },
    }),
  ]);

  return (
    <main className="min-h-screen bg-[#0f140e] text-[#f4e6c9] pt-28 pb-16">
      <Header restaurant={restaurant} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Banner */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-widest mb-4">
            <Utensils className="w-3.5 h-3.5" /> Dynamic Menu
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight mb-4">
            Culinary <span className="gold-gradient-text font-serif">Menu</span>
          </h1>
          <p className="text-base sm:text-lg text-zinc-300 font-light leading-relaxed">
            Explore our curated selection of starters, signature mains, aromatic biryanis, artisanal breads, desserts, and beverages.
          </p>
        </div>

        {/* Interactive Filterable Menu Component */}
        <MenuGrid categories={categories} />
      </div>

      <div className="mt-20">
        <Footer restaurant={restaurant} hours={hours} />
      </div>
    </main>
  );
}
