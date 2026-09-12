'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ShieldLock, Phone, Leaf } from 'lucide-react';
import { Restaurant } from '@/types';
import WhatsAppIcon from './WhatsAppIcon';

interface HeaderProps {
  restaurant?: Restaurant | null;
}

export default function Header({ restaurant }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/menu' },
    { name: 'About', href: '/about' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Contact', href: '/contact' },
  ];

  const brandName = restaurant?.name || 'Mashuup';
  const logoUrl = restaurant?.logo || '/logo.png';
  const phone = restaurant?.phone || '9009310300';
  const whatsappNumber = `91${phone.replace(/[^0-9]/g, '')}`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass-nav py-3 shadow-2xl' : 'bg-gradient-to-b from-black/90 via-black/70 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400/80 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform shrink-0 bg-black flex items-center justify-center">
              <img src={logoUrl} alt={brandName} className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-white gold-gradient-text block leading-none font-serif">
                {brandName}
              </span>
              <span className="text-[10px] tracking-widest text-emerald-400 uppercase font-bold flex items-center gap-1 mt-0.5">
                <Leaf className="w-3 h-3 text-emerald-400" /> Pure Veg Restaurant
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-amber-100/90 hover:text-amber-300 hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* CTA & Admin Link */}
          <div className="hidden md:flex items-center gap-2.5">
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-2 text-xs font-bold text-emerald-400 px-3.5 py-2 border border-emerald-500/30 rounded-full hover:bg-emerald-500/10 transition"
              title="Chat on WhatsApp"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-400" />
              WhatsApp
            </a>

            {restaurant?.phone && (
              <a
                href={`tel:${restaurant.phone}`}
                className="hidden xl:flex items-center gap-2 text-xs font-semibold text-amber-300 px-3.5 py-2 border border-amber-500/30 rounded-full hover:bg-amber-500/10 transition font-mono"
              >
                <Phone className="w-3.5 h-3.5" />
                +91 {restaurant.phone}
              </a>
            )}

            <Link
              href="/menu"
              className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-zinc-950 gold-gradient-bg shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-105 active:scale-95 transition"
            >
              View Menu
            </Link>

            <Link
              href="/admin/login"
              className="p-2 rounded-full text-amber-400/60 hover:text-amber-300 hover:bg-amber-500/10 border border-transparent hover:border-amber-500/20 transition"
              title="Owner / Admin Dashboard"
            >
              <ShieldLock className="w-5 h-5" />
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-emerald-400 hover:text-emerald-300"
              title="WhatsApp"
            >
              <WhatsAppIcon className="w-5 h-5" />
            </a>
            <Link
              href="/admin/login"
              className="p-2 text-amber-400/70 hover:text-amber-300"
              title="Admin Login"
            >
              <ShieldLock className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-amber-200 bg-white/5 border border-amber-500/20 hover:bg-white/10 transition"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-nav border-b border-amber-500/20 px-4 pt-3 pb-6 mt-3 space-y-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-base font-medium flex items-center justify-between ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                      : 'text-amber-100/90 hover:bg-white/5 hover:text-amber-300'
                  }`}
                >
                  {link.name}
                  {isActive && <span className="w-2 h-2 rounded-full bg-amber-400" />}
                </Link>
              );
            })}
          </nav>

          <div className="pt-2 border-t border-amber-500/15 space-y-2">
            <Link
              href="/menu"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 rounded-xl text-sm font-bold uppercase tracking-wider text-zinc-950 gold-gradient-bg block shadow-lg shadow-amber-500/20"
            >
              View Menu
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tel:${phone}`}
                className="py-2.5 rounded-xl text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 flex items-center justify-center gap-2 font-mono"
              >
                <Phone className="w-4 h-4" />
                Call Us
              </a>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center gap-2"
              >
                <WhatsAppIcon className="w-4 h-4 text-emerald-400" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
