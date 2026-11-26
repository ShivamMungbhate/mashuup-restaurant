import React from 'react';
import Header from '@/components/public/Header';
import AboutSection from '@/components/public/AboutSection';
import Footer from '@/components/public/Footer';
import { prisma } from '@/lib/prisma';

export const revalidate = 0;

export const metadata = {
  title: 'About Us | Mashuup Cafe – Street Eats & Sips, Chhindwara',
  description:
    'Learn about Mashuup Cafe — a 100% Pure Veg street food cafe in Chhindwara serving freshly crafted pizzas, momos, cold coffees, burgers, and Indo-Chinese favourites.',
};

export default async function AboutPage() {
  const [restaurant, hours] = await Promise.all([
    prisma.restaurant.findFirst(),
    prisma.openingHour.findMany({
      orderBy: { displayOrder: 'asc' },
    }),
  ]);

  const name = restaurant?.name || 'Mashuup Cafe';

  return (
    <main className="min-h-screen bg-white pt-28">
      <Header restaurant={restaurant} />

      {/* Banner */}
      <div className="bg-gradient-to-br from-green-900 to-green-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight mb-4">
            About <span className="text-green-300 font-serif">{name}</span>
          </h1>
          <p className="text-base sm:text-lg text-green-100 font-light max-w-2xl mx-auto">
            Our love for good food, great vibes, and serving the Chhindwara community with 100% pure vegetarian street eats and sips.
          </p>
        </div>
      </div>

      <AboutSection restaurant={restaurant} />

      <Footer restaurant={restaurant} hours={hours} />
    </main>
  );
}
