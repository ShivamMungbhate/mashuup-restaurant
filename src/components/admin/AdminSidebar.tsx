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
    { name: 'Dashboard Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Menu Items', href: '/admin/menu', icon: UtensilsCrossed },
    { name: 'Categories', href: '/admin/categories', icon: Layers },
    { name: 'Restaurant Profile', href: '/admin/restaurant', icon: Store },
    { name: 'Contact & Location', href: '/admin/contact', icon: PhoneCall },
    { name: 'Opening Hours', href: '/admin/hours', icon: Clock },
    { name: 'Photo Gallery', href: '/admin/gallery', icon: ImageIcon },
    { name: 'Admin Users & OTP', href: '/admin/admins', icon: Users },
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
    <aside className="w-64 bg-[#0f140e] border-r border-amber-500/15 flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-amber-500/15 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gold-gradient-bg flex items-center justify-center text-zinc-950 font-black shadow-lg shadow-amber-500/20">
              <ShieldLock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-extrabold text-white gold-gradient-text block leading-none">
                OWNER PANEL
              </span>
              <span className="text-[10px] text-amber-400/70 tracking-widest uppercase font-semibold">
                Mashuup Restaurant
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1.5">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-amber-400/60">
            Management
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'gold-gradient-bg text-zinc-950 font-bold shadow-lg shadow-amber-500/20 scale-[1.02]'
                    : 'text-zinc-300 hover:text-amber-300 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-zinc-950' : 'text-amber-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Controls */}
      <div className="p-4 border-t border-amber-500/15 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4" /> Live Website
          </span>
          <span className="text-[10px] uppercase font-bold text-amber-400">Preview</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-transparent hover:border-rose-500/20 transition"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
