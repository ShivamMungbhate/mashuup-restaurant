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
        isScrolled
          ? 'glass-nav py-3 shadow-lg shadow-green-900/10'
          : 'bg-white/95 backdrop-blur-sm border-b border-green-100 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-green-700/70 shadow-lg shadow-green-800/20 group-hover:scale-105 transition-transform shrink-0 bg-white flex items-center justify-center">
              <img src={logoUrl} alt={brandName} className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-green-900 block leading-none font-serif">
                {brandName}
              </span>
              <span className="text-[10px] tracking-widest text-green-600 uppercase font-bold flex items-center gap-1 mt-0.5">
                <Leaf className="w-3 h-3 text-green-500" /> Pure Veg Restaurant
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
                      ? 'bg-green-800 text-white shadow-md shadow-green-800/20'
                      : 'text-green-800 hover:text-green-900 hover:bg-green-50'
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
              className="hidden lg:flex items-center gap-2 text-xs font-bold text-green-700 px-3.5 py-2 border border-green-300 rounded-full hover:bg-green-50 transition"
              title="Chat on WhatsApp"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 text-green-600" />
              WhatsApp
            </a>

            {restaurant?.phone && (
              <a
                href={`tel:${restaurant.phone}`}
                className="hidden xl:flex items-center gap-2 text-xs font-semibold text-green-800 px-3.5 py-2 border border-green-200 rounded-full hover:bg-green-50 transition font-mono"
              >
                <Phone className="w-3.5 h-3.5" />
                +91 {restaurant.phone}
              </a>
            )}

            <Link
              href="/menu"
              className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white green-gradient-bg shadow-lg shadow-green-800/20 hover:shadow-green-800/40 hover:scale-105 active:scale-95 transition"
            >
              View Menu
            </Link>

            <Link
              href="/admin/login"
              className="p-2 rounded-full text-green-600/60 hover:text-green-700 hover:bg-green-50 border border-transparent hover:border-green-200 transition"
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
              className="p-2 text-green-600 hover:text-green-800"
              title="WhatsApp"
            >
              <WhatsAppIcon className="w-5 h-5" />
            </a>
            <Link
              href="/admin/login"
              className="p-2 text-green-700/70 hover:text-green-800"
              title="Admin Login"
            >
              <ShieldLock className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-green-800 bg-green-50 border border-green-200 hover:bg-green-100 transition"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-green-100 shadow-lg px-4 pt-3 pb-6 mt-3 space-y-3 animate-in fade-in slide-in-from-top-4 duration-200">
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
                      ? 'bg-green-800 text-white font-semibold'
                      : 'text-green-800 hover:bg-green-50'
                  }`}
                >
                  {link.name}
                  {isActive && <span className="w-2 h-2 rounded-full bg-white" />}
                </Link>
              );
            })}
          </nav>

          <div className="pt-2 border-t border-green-100 space-y-2">
            <Link
              href="/menu"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 rounded-xl text-sm font-bold uppercase tracking-wider text-white green-gradient-bg block shadow-lg shadow-green-800/20"
            >
              View Menu
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tel:${phone}`}
                className="py-2.5 rounded-xl text-xs font-semibold text-green-800 bg-green-50 border border-green-200 flex items-center justify-center gap-2 font-mono"
              >
                <Phone className="w-4 h-4" />
                Call Us
              </a>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 rounded-xl text-xs font-semibold text-green-700 bg-green-50 border border-green-200 flex items-center justify-center gap-2"
              >
                <WhatsAppIcon className="w-4 h-4 text-green-600" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
