import React from 'react';
import Header from '@/components/public/Header';
import ContactSection from '@/components/public/ContactSection';
import Footer from '@/components/public/Footer';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function LocationPage() {
  const [restaurant, hours] = await Promise.all([
    prisma.restaurant.findFirst(),
    prisma.openingHour.findMany({
      orderBy: { displayOrder: 'asc' },
    }),
  ]);

  return (
    <main className="min-h-screen bg-[#0f140e] text-[#f4e6c9] pt-28">
      <Header restaurant={restaurant} />
      <ContactSection restaurant={restaurant} hours={hours} />
      <Footer restaurant={restaurant} hours={hours} />
    </main>
  );
}
