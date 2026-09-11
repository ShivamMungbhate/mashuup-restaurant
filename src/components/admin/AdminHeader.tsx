'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ExternalLink, ShieldCheck, User } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export default function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  const [adminUser, setAdminUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setAdminUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <header className="bg-[#121811] border-b border-amber-500/15 px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">{title}</h1>
        {subtitle ? (
          <p className="text-xs text-amber-200/70 font-light mt-0.5">{subtitle}</p>
        ) : (
          adminUser && (
            <p className="text-xs text-amber-200/70 font-light mt-0.5">
              Logged in as <strong className="text-amber-100">{adminUser.name}</strong> ({adminUser.email})
            </p>
          )
        )}
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Preview Website
        </Link>

        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-zinc-950 border border-amber-500/20 shadow-md">
          <div className="w-6 h-6 rounded-full gold-gradient-bg text-zinc-950 flex items-center justify-center font-bold text-[10px]">
            <User className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-amber-100 flex items-center gap-1">
            {adminUser ? adminUser.name : 'Owner Admin'}{' '}
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          </span>
        </div>
      </div>
    </header>
  );
}
