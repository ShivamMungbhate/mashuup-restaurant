'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // If on login page, don't show admin sidebar
  if (pathname === '/admin/login') {
    return <div className="min-h-screen bg-[#0f140e] text-[#f4e6c9]">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#0f140e] text-[#f4e6c9] flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">{children}</div>
    </div>
  );
}
