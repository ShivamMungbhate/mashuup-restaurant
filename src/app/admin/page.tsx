import React from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import {
  UtensilsCrossed,
  CheckCircle2,
  Layers,
  Image as ImageIcon,
  PlusCircle,
  Edit3,
  Upload,
  Clock,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const [totalItems, availableItems, categoriesCount, galleryCount, recentItems, restaurant] =
    await Promise.all([
      prisma.menuItem.count(),
      prisma.menuItem.count({ where: { isAvailable: true } }),
      prisma.menuCategory.count(),
      prisma.galleryImage.count(),
      prisma.menuItem.findMany({
        take: 5,
        orderBy: { updatedAt: 'desc' },
        include: { category: true },
      }),
      prisma.restaurant.findFirst(),
    ]);

  return (
    <div className="flex-1 pb-12">
      <AdminHeader
        title="Dashboard Overview"
        subtitle={`Welcome back, Owner! Managing content for ${restaurant?.name || 'THE OLIVE TABLE'}`}
      />

      <div className="p-6 max-w-7xl mx-auto space-y-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="glass-card p-5 rounded-3xl border-amber-500/20 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-200/70">
                Total Menu Items
              </p>
              <h3 className="text-3xl font-black text-white mt-1">{totalItems}</h3>
              <p className="text-[11px] text-zinc-400 mt-1">Across all categories</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
          </div>

          <div className="glass-card p-5 rounded-3xl border-amber-500/20 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-300/80">
                Available Items
              </p>
              <h3 className="text-3xl font-black text-emerald-300 mt-1">{availableItems}</h3>
              <p className="text-[11px] text-zinc-400 mt-1">Active on public website</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="glass-card p-5 rounded-3xl border-amber-500/20 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-200/70">
                Menu Categories
              </p>
              <h3 className="text-3xl font-black text-white mt-1">{categoriesCount}</h3>
              <p className="text-[11px] text-zinc-400 mt-1">Dynamic categories</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Layers className="w-6 h-6" />
            </div>
          </div>

          <div className="glass-card p-5 rounded-3xl border-amber-500/20 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-200/70">
                Gallery Photos
              </p>
              <h3 className="text-3xl font-black text-white mt-1">{galleryCount}</h3>
              <p className="text-[11px] text-zinc-400 mt-1">Photos in gallery</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <ImageIcon className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Quick Action Shortcuts */}
        <div className="glass-card p-6 rounded-3xl border-amber-500/20">
          <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            Quick Management Actions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/admin/menu"
              className="p-4 rounded-2xl bg-zinc-950/80 border border-amber-500/20 hover:border-amber-500/40 hover:scale-[1.02] transition flex items-center gap-3 group"
            >
              <div className="p-3 rounded-xl gold-gradient-bg text-zinc-950 font-bold shrink-0">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-amber-300">
                  Add Menu Item
                </h4>
                <p className="text-[10px] text-zinc-400">Create new dish with image</p>
              </div>
            </Link>

            <Link
              href="/admin/restaurant"
              className="p-4 rounded-2xl bg-zinc-950/80 border border-amber-500/20 hover:border-amber-500/40 hover:scale-[1.02] transition flex items-center gap-3 group"
            >
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-amber-300">
                  Restaurant Profile
                </h4>
                <p className="text-[10px] text-zinc-400">Update story, logo, tagline</p>
              </div>
            </Link>

            <Link
              href="/admin/gallery"
              className="p-4 rounded-2xl bg-zinc-950/80 border border-amber-500/20 hover:border-amber-500/40 hover:scale-[1.02] transition flex items-center gap-3 group"
            >
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-amber-300">
                  Manage Gallery
                </h4>
                <p className="text-[10px] text-zinc-400">Upload or remove photos</p>
              </div>
            </Link>

            <Link
              href="/admin/hours"
              className="p-4 rounded-2xl bg-zinc-950/80 border border-amber-500/20 hover:border-amber-500/40 hover:scale-[1.02] transition flex items-center gap-3 group"
            >
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-amber-300">
                  Opening Hours
                </h4>
                <p className="text-[10px] text-zinc-400">Set weekly schedule</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recently Updated Menu Items Table */}
        <div className="glass-card p-6 rounded-3xl border-amber-500/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-amber-400" />
              Recently Updated Menu Items
            </h2>
            <Link
              href="/admin/menu"
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              Manage All Items <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-amber-500/15 text-amber-200/70 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Dish</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Dietary</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {recentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition">
                    <td className="py-3 px-4 flex items-center gap-3 font-semibold text-white">
                      <img
                        src={
                          item.image ||
                          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=100&q=80'
                        }
                        alt={item.name}
                        className="w-8 h-8 rounded-lg object-cover border border-amber-500/20"
                      />
                      {item.name}
                    </td>
                    <td className="py-3 px-4 text-amber-200/80">{item.category?.name || '—'}</td>
                    <td className="py-3 px-4 font-mono font-bold text-amber-300">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      {item.isVeg ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                          Veg
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-500/30">
                          Non-Veg
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {item.isAvailable ? (
                        <span className="text-emerald-400 font-semibold text-[11px]">Available</span>
                      ) : (
                        <span className="text-rose-400 font-semibold text-[11px]">Unavailable</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
