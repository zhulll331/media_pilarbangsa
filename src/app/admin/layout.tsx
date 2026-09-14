"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePortal } from "@/context/portal-context";
import { createClient } from "@/lib/supabase/client";
import { Avatar } from "@/components/ui/avatar";
import {
  Inbox,
  FileCheck2,
  MessageSquare,
  Layers,
  Globe,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { profile, user, signOut } = usePortal();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pendingPostsCount, setPendingPostsCount] = useState(0);

  const adminName = profile?.full_name ?? user?.email ?? 'Admin Redaksi';
  const adminAvatar = profile?.avatar_url ?? undefined;

  useEffect(() => {
    const fetchPendingCount = async () => {
      const supabase = createClient();
      const { count } = await supabase
        .from('posts')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending_review');
      setPendingPostsCount(count ?? 0);
    };
    fetchPendingCount();
  }, []);

  const navLinks = [
    {
      name: "Antrean Review",
      href: "/admin",
      icon: <Inbox className="w-4 h-4" />,
      badge: pendingPostsCount > 0 ? pendingPostsCount : undefined,
    },
    {
      name: "Semua Naskah",
      href: "/admin/naskah",
      icon: <FileCheck2 className="w-4 h-4" />,
    },
    {
      name: "Moderasi Komentar",
      href: "/admin/komentar",
      icon: <MessageSquare className="w-4 h-4" />,
    },
    {
      name: "Kategori & Tag",
      href: "/admin/kategori",
      icon: <Layers className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex flex-col md:flex-row">
      {/* Mobile Topbar */}
      <header className="md:hidden bg-[#0B172A] text-white px-4 py-3 flex items-center justify-between sticky top-9 z-30">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-6 h-6 text-amber-400" />
          <span className="font-bold text-sm">PANEL REDAKSI & KURASI</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-gray-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Fixed Left Sidebar (240px Desktop) */}
      <aside
        className={cn(
          "w-full md:w-60 bg-[#0B172A] text-white flex flex-col justify-between shrink-0 p-4 transition-all z-40 border-r border-white/10",
          mobileMenuOpen ? "block fixed inset-0 top-20" : "hidden md:flex md:min-h-screen"
        )}
      >
        <div>
          {/* Brand Header */}
          <div className="hidden md:flex items-center gap-3 px-2 py-3 mb-6 border-b border-white/10">
            <img
              src="/images/logo_pilar.svg"
              alt="Logo Pilar Bangsa"
              className="w-9 h-9 object-contain brightness-125 shrink-0"
            />
            <div>
              <span className="block font-bold text-sm text-white leading-none">
                PILAR BANGSA
              </span>
              <span className="block text-[11px] text-amber-400 font-semibold mt-1">
                Panel Redaksi & Kurasi
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navLinks.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors min-h-[44px]",
                    isActive
                      ? "bg-[#005AE0] text-white shadow-xs"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.name}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DC2626] text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar */}
        <div className="pt-4 border-t border-white/10 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <Globe className="w-4 h-4 text-blue-400" />
            <span>Kunjungi Portal Publik</span>
          </Link>

          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 border border-white/10">
            <Avatar src={adminAvatar} name={adminName} size="sm" />
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-white block truncate">
                {adminName}
              </span>
              <span className="text-[10px] text-amber-400 block truncate">
                Pemimpin Redaksi
              </span>
            </div>
            <button
              onClick={async () => {
                await signOut();
                window.location.href = "/";
              }}
              title="Keluar dari panel redaksi"
              className="p-1 text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
