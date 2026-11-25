import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mashuup | 100% Pure Veg Restaurant – Chhindwara',
  description:
    'Welcome to Mashuup – a 100% Pure Veg restaurant in Chhindwara serving fresh grilled pizzas, burgers, sandwiches, thick shakes, beverages, and crispy snacks.',
  keywords: [
    'Mashuup',
    'Pure Veg Restaurant',
    'Chhindwara',
    'Vegetarian Food',
    'Pizza',
    'Burger',
    'Thick Shakes',
    'Sandwiches',
    'Chhindwara Restaurant',
  ],
  openGraph: {
    title: 'Mashuup | 100% Pure Veg Restaurant – Chhindwara',
    description:
      'Fresh grilled pizzas, burgers, sandwiches, thick shakes and more. 100% Pure Veg. Open daily 11 AM – 11 PM.',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Mashuup Restaurant – Pure Veg Chhindwara',
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
    <html lang="en" className="scroll-smooth">
      <body className="bg-white text-green-900 antialiased selection:bg-green-700 selection:text-white">
        {children}
      </body>
    </html>
  );
}
