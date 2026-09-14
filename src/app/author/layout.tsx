"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePortal } from "@/context/portal-context";
import { Avatar } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  FileText,
  PenSquare,
  User,
  Globe,
  LogOut,
  Menu,
  X,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AuthorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { currentUser, setRole, signOut } = usePortal();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const author = currentUser || {
    name: "Budi Santoso",
    email: "budi@student.untag-bwi.ac.id",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    role: "author" as const,
  };

  const navLinks = [
    {
      name: "Beranda Dashboard",
      href: "/author",
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      name: "Tulisan Saya",
      href: "/author/tulisan",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      name: "Tulis Baru",
      href: "/author/tulis",
      icon: <PenSquare className="w-4 h-4" />,
    },
    {
      name: "Profil Penulis",
      href: "/author/profil",
      icon: <User className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex flex-col md:flex-row">
      {/* Mobile Topbar */}
      <header className="md:hidden bg-white border-b border-[#E5E7EB] px-4 py-3 flex items-center justify-between sticky top-9 z-30">
        <div className="flex items-center gap-2.5">
          <img
            src="/images/logo_pilar.svg"
            alt="Logo Pilar Bangsa"
            className="w-8 h-8 object-contain"
          />
          <span className="font-bold text-sm text-[#005AE0]">
            AUTHOR STUDIO
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-gray-600 hover:text-black"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Fixed Left Sidebar (240px Desktop) */}
      <aside
        className={cn(
          "w-full md:w-60 bg-white border-r border-[#E5E7EB] flex flex-col justify-between shrink-0 p-4 transition-all z-40",
          mobileMenuOpen ? "block fixed inset-0 top-20" : "hidden md:flex md:min-h-screen"
        )}
      >
        <div>
          {/* Brand Header in Sidebar */}
          <div className="hidden md:flex items-center gap-3 px-2 py-3 mb-6 border-b border-[#E5E7EB]">
            <img
              src="/images/logo_pilar.svg"
              alt="Logo Pilar Bangsa"
              className="w-9 h-9 object-contain shrink-0"
            />
            <div>
              <span className="block font-bold text-sm text-[#005AE0] leading-none">
                PILAR BANGSA
              </span>
              <span className="block text-[11px] text-[#6B7280] font-medium mt-1">
                Ruang Kerja Penulis Mahasiswa
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navLinks.map((item) => {
              const isActive =
                item.href === "/author"
                  ? pathname === "/author"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors min-h-[44px]",
                    isActive
                      ? "bg-[#005AE0] text-white shadow-xs"
                      : "text-[#111827] hover:bg-[#F0F4F8] hover:text-[#005AE0]"
                  )}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar: User Box & Portal Link */}
        <div className="pt-4 border-t border-[#E5E7EB] space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#6B7280] hover:text-[#005AE0] hover:bg-[#F0F4F8] rounded-xl transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span>Kunjungi Portal Publik</span>
          </Link>

          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#F0F4F8]">
            <Avatar src={author.avatar} name={author.name} size="sm" />
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-[#111827] block truncate">
                {author.name}
              </span>
              <span className="text-[10px] text-[#6B7280] block truncate">
                {author.email}
              </span>
            </div>
            <button
              onClick={async () => {
                await signOut();
                window.location.href = "/";
              }}
              title="Keluar dari akun"
              className="p-1 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
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
