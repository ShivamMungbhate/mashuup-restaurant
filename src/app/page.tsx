import React from 'react';
import Header from '@/components/public/Header';
import Hero from '@/components/public/Hero';
import FeaturedDishes from '@/components/public/FeaturedDishes';
import AboutSection from '@/components/public/AboutSection';
import GalleryGrid from '@/components/public/GalleryGrid';
import ContactSection from '@/components/public/ContactSection';
import Footer from '@/components/public/Footer';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ArrowRight, Image as ImageIcon } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0; // Ensure fresh data on every request

export default async function HomePage() {
  const [restaurant, featuredItems, gallery, hours] = await Promise.all([
    prisma.restaurant.findFirst(),
    prisma.menuItem.findMany({
      where: { isFeatured: true, isAvailable: true },
      include: { category: true },
      orderBy: { displayOrder: 'asc' },
    }),
    prisma.galleryImage.findMany({
      take: 6,
      orderBy: { displayOrder: 'asc' },
    }),
    prisma.openingHour.findMany({
      orderBy: { displayOrder: 'asc' },
    }),
  ]);

  return (
    <main className="min-h-screen bg-[#0f140e] text-[#f4e6c9]">
      <Header restaurant={restaurant} />
      <Hero restaurant={restaurant} hours={hours} />

      {/* Featured Dishes Section */}
      <FeaturedDishes items={featuredItems} />

      {/* About Us Section */}
      <AboutSection restaurant={restaurant} />

      {/* Photo Gallery Teaser */}
      <section className="py-20 bg-[#121811] relative border-t border-amber-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-3">
                <ImageIcon className="w-3.5 h-3.5" /> Ambiance & Atmosphere
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Our Restaurant <span className="gold-gradient-text">Gallery</span>
              </h2>
            </div>
            <Link
              href="/gallery"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-bold text-amber-400 hover:text-amber-300 group"
            >
              View All Photos
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <GalleryGrid images={gallery} />
        </div>
      </section>

      {/* Location & Contact Section */}
      <ContactSection restaurant={restaurant} hours={hours} />

      {/* Footer */}
      <Footer restaurant={restaurant} hours={hours} />
    </main>
  );
}
