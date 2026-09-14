"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, PenSquare, LogIn, LayoutDashboard, UserCircle } from "lucide-react";
import { usePortal } from "@/context/portal-context";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function Header() {
  const router = useRouter();
  const { currentRole, currentUser } = usePortal();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/cari?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-white border-b border-[#E5E7EB] py-3.5 px-4 sticky top-0 md:static z-40 bg-white/95 backdrop-blur-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Brand Logos (Pilar Bangsa + UNTAG) */}
        <div className="flex items-center gap-3.5">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 shrink-0">
              <img
                src="/images/logo_pilar.svg"
                alt="Logo UKM Pilar Bangsa"
                className="w-full h-full object-contain group-hover:scale-105 transition-transform"
              />
            </div>
            <div>
              <span className="block font-bold text-lg sm:text-xl text-[#005AE0] tracking-tight leading-none group-hover:text-[#0048b3] transition-colors">
                PILAR BANGSA
              </span>
              <span className="block text-[10px] sm:text-xs text-[#6B7280] font-medium tracking-wide mt-0.5">
                Media Karya Mahasiswa UNTAG Banyuwangi & UKM Pilar Bangsa
              </span>
            </div>
          </Link>

          <div className="h-8 w-px bg-[#E5E7EB] hidden sm:block mx-1" />

          <div className="hidden sm:flex items-center" title="Universitas 17 Agustus 1945 Banyuwangi">
            <img
              src="/images/logo_untag.svg"
              alt="Logo UNTAG Banyuwangi"
              className="h-9 w-auto object-contain opacity-85 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>

        {/* Center: Search Bar (Desktop) */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center relative flex-1 max-w-md mx-6"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berita, opini, cerpen, puisi..."
            className="w-full pl-9 pr-4 py-2 bg-[#F0F4F8] text-sm text-[#111827] rounded-full border border-transparent focus:border-[#005AE0] focus:bg-white focus:outline-none transition-all placeholder:text-[#6B7280]"
          />
          <Search className="w-4 h-4 text-[#6B7280] absolute left-3 pointer-events-none" />
          <button type="submit" className="sr-only">Cari</button>
        </form>

        {/* Right: Actions & User State */}
        <div className="flex items-center gap-2.5">
          {/* Mobile search button */}
          <Link
            href="/cari"
            className="md:hidden p-2 text-[#6B7280] hover:text-[#005AE0] rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Pencarian artikel"
          >
            <Search className="w-5 h-5" />
          </Link>

          {currentRole === "author" ? (
            <div className="flex items-center gap-2">
              <Link href="/author/tulis">
                <Button variant="primary" size="sm" className="hidden sm:inline-flex gap-1.5">
                  <PenSquare className="w-4 h-4" />
                  <span>Tulis Naskah</span>
                </Button>
              </Link>
              <Link href="/author" className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors">
                <Avatar src={currentUser?.avatar} name={currentUser?.name} size="md" />
                <span className="hidden lg:inline text-xs font-semibold text-[#111827]">
                  {currentUser?.name}
                </span>
              </Link>
            </div>
          ) : currentRole === "admin" ? (
            <div className="flex items-center gap-2">
              <Link href="/admin">
                <Button variant="primary" size="sm" className="hidden sm:inline-flex gap-1.5 bg-[#0B172A] hover:bg-[#1E3A8A]">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Panel Redaksi</span>
                </Button>
              </Link>
              <Link href="/admin" className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors">
                <Avatar src={currentUser?.avatar} name={currentUser?.name} size="md" />
                <span className="hidden lg:inline text-xs font-semibold text-[#0B172A]">
                  {currentUser?.name} (Admin)
                </span>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="secondary" size="sm" className="gap-1.5">
                  <LogIn className="w-4 h-4" />
                  <span>Masuk</span>
                </Button>
              </Link>
              <Link href="#newsletter" className="hidden sm:inline-block">
                <Button variant="primary" size="sm">
                  Berlangganan
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
