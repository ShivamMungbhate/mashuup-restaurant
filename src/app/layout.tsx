import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'THE OLIVE TABLE | Fine Dining & Artisanal Cuisine',
  description:
    'Experience contemporary Mediterranean dining at The Olive Table. Fresh organic ingredients, wood-fired dishes, and an incredible welcoming atmosphere.',
  keywords: [
    'Restaurant',
    'Fine Dining',
    'The Olive Table',
    'Mediterranean Cuisine',
    'Artisanal Food',
    'Menu',
    'Reservations',
  ],
  openGraph: {
    title: 'THE OLIVE TABLE | Fine Dining & Artisanal Cuisine',
    description:
      'Contemporary restaurant serving carefully crafted dishes made with fresh ingredients.',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'The Olive Table Restaurant Interior',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-[#0f140e] text-[#f4e6c9] antialiased selection:bg-amber-500 selection:text-zinc-950">
        {children}
      </body>
    </html>
  );
}
