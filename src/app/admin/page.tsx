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
    <div className="flex-1 pb-12 bg-gray-50">
      <AdminHeader
        title="Dashboard Overview"
        subtitle={`Welcome back, Owner! Managing ${restaurant?.name || 'Mashuup'} restaurant.`}
      />

      <div className="p-6 max-w-7xl mx-auto space-y-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-3xl border border-green-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Menu Items</p>
              <h3 className="text-3xl font-black text-green-900 mt-1">{totalItems}</h3>
              <p className="text-[11px] text-gray-400 mt-1">Across all categories</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-green-100 text-green-700">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-green-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-green-600">Available Items</p>
              <h3 className="text-3xl font-black text-green-700 mt-1">{availableItems}</h3>
              <p className="text-[11px] text-gray-400 mt-1">Active on public website</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-green-100 text-green-700">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-green-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Menu Categories</p>
              <h3 className="text-3xl font-black text-green-900 mt-1">{categoriesCount}</h3>
              <p className="text-[11px] text-gray-400 mt-1">Dynamic categories</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-green-100 text-green-700">
              <Layers className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-green-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Gallery Photos</p>
              <h3 className="text-3xl font-black text-green-900 mt-1">{galleryCount}</h3>
              <p className="text-[11px] text-gray-400 mt-1">Photos in gallery</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-green-100 text-green-700">
              <ImageIcon className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-3xl border border-green-100 shadow-sm">
          <h2 className="text-base font-bold text-green-900 mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-600" />
            Quick Management Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/admin/menu"
              className="p-4 rounded-2xl bg-green-50 border border-green-200 hover:border-green-400 hover:bg-green-100 hover:scale-[1.02] transition flex items-center gap-3 group">
              <div className="p-3 rounded-xl bg-green-800 text-white shrink-0">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-green-900 group-hover:text-green-700">Add Menu Item</h4>
                <p className="text-[10px] text-gray-500">Create new dish with image</p>
              </div>
            </Link>

            <Link href="/admin/restaurant"
              className="p-4 rounded-2xl bg-green-50 border border-green-200 hover:border-green-400 hover:bg-green-100 hover:scale-[1.02] transition flex items-center gap-3 group">
              <div className="p-3 rounded-xl bg-green-100 text-green-700 border border-green-200 shrink-0">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-green-900 group-hover:text-green-700">Restaurant Profile</h4>
                <p className="text-[10px] text-gray-500">Update story, logo, tagline</p>
              </div>
            </Link>

            <Link href="/admin/gallery"
              className="p-4 rounded-2xl bg-green-50 border border-green-200 hover:border-green-400 hover:bg-green-100 hover:scale-[1.02] transition flex items-center gap-3 group">
              <div className="p-3 rounded-xl bg-green-100 text-green-700 border border-green-200 shrink-0">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-green-900 group-hover:text-green-700">Manage Gallery</h4>
                <p className="text-[10px] text-gray-500">Upload or remove photos</p>
              </div>
            </Link>

            <Link href="/admin/hours"
              className="p-4 rounded-2xl bg-green-50 border border-green-200 hover:border-green-400 hover:bg-green-100 hover:scale-[1.02] transition flex items-center gap-3 group">
              <div className="p-3 rounded-xl bg-green-100 text-green-700 border border-green-200 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-green-900 group-hover:text-green-700">Opening Hours</h4>
                <p className="text-[10px] text-gray-500">Set weekly schedule</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Items Table */}
        <div className="bg-white p-6 rounded-3xl border border-green-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-green-900 flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-green-600" />
              Recently Updated Menu Items
            </h2>
            <Link href="/admin/menu"
              className="text-xs font-bold text-green-700 hover:text-green-900 flex items-center gap-1">
              Manage All <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-green-100 text-green-600 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Dish</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-50 text-gray-700">
                {recentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-green-50 transition">
                    <td className="py-3 px-4 flex items-center gap-3 font-semibold text-green-900">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=100&q=80'}
                        alt={item.name}
                        className="w-8 h-8 rounded-lg object-cover border border-green-100"
                      />
                      {item.name}
                    </td>
                    <td className="py-3 px-4 text-gray-500">{item.category?.name || '—'}</td>
                    <td className="py-3 px-4 font-mono font-bold text-green-700">
                      ₹{item.price.toFixed(0)}
                    </td>
                    <td className="py-3 px-4">
                      {item.isAvailable ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 font-bold text-[10px]">Available</span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-600 font-bold text-[10px]">Unavailable</span>
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
