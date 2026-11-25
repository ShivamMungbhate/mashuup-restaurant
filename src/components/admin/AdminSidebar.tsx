'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Layers,
  Store,
  PhoneCall,
  Clock,
  Image as ImageIcon,
  Users,
  ExternalLink,
  LogOut,
  ShieldLock,
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Menu Items', href: '/admin/menu', icon: UtensilsCrossed },
    { name: 'Categories', href: '/admin/categories', icon: Layers },
    { name: 'Restaurant Profile', href: '/admin/restaurant', icon: Store },
    { name: 'Contact & Location', href: '/admin/contact', icon: PhoneCall },
    { name: 'Opening Hours', href: '/admin/hours', icon: Clock },
    { name: 'Photo Gallery', href: '/admin/gallery', icon: ImageIcon },
    { name: 'Admin Users', href: '/admin/admins', icon: Users },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <aside className="w-64 bg-green-900 flex flex-col justify-between shrink-0 min-h-screen shadow-xl">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-green-900 shadow-lg">
            <ShieldLock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-sm font-extrabold text-white block leading-none tracking-wide">
              OWNER PANEL
            </span>
            <span className="text-[10px] text-green-300 tracking-widest uppercase font-semibold">
              Mashuup Restaurant
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-green-400">
            Management
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-white text-green-900 font-bold shadow-md scale-[1.02]'
                    : 'text-green-100 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-green-700' : 'text-green-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-green-200 bg-white/10 border border-white/20 hover:bg-white/20 transition"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4" /> Live Website
          </span>
          <span className="text-[10px] uppercase font-bold text-green-300">Preview</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-300 hover:text-white hover:bg-red-600/40 border border-transparent hover:border-red-500/30 transition"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
