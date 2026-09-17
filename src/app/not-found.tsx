import React from "react";
import Link from "next/link";
import { TopUtilityBar } from "@/components/public/top-utility-bar";
import { Header } from "@/components/public/header";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Search, Compass, BookOpen } from "lucide-react";

export default function NotFound() {
  const popularCategories = [
    { name: "Berita UKM", href: "/kategori/berita-ukm" },
    { name: "Opini & Gagasan", href: "/kategori/opini" },
    { name: "Sastra & Budaya", href: "/kategori/sastra" },
    { name: "Cerpen", href: "/kategori/cerpen" },
    { name: "Puisi", href: "/kategori/puisi" },
    { name: "Galeri Karya", href: "/kategori/galeri" },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F8FAFC]">
      <TopUtilityBar />
      <Header />
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="max-w-xl w-full text-center">
          {/* Badge 404 */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#005AE0] text-xs font-bold tracking-wider uppercase mb-6">
            <Compass className="w-3.5 h-3.5" />
            <span>Galat 404 — Halaman Tidak Ditemukan</span>
          </div>

          <h1 className="text-6xl sm:text-7xl font-extrabold text-[#111827] tracking-tight mb-4">
            404
          </h1>

          <p className="text-lg sm:text-xl font-semibold text-[#1F2937] mb-2">
            Halaman atau Rubrik Belum Tersedia
          </p>
          <p className="text-sm text-[#6B7280] leading-relaxed max-w-md mx-auto mb-8">
            Tautan yang Anda tuju mungkin salah ketik, telah diperbarui alamatnya, atau naskah sedang dalam tahap kurasi redaksi.
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3 flex-wrap mb-10">
            <Link href="/">
              <Button className="bg-[#005AE0] hover:bg-[#0048B3] text-white flex items-center gap-2 px-5 py-2.5 rounded-xl shadow-xs">
                <Home className="w-4 h-4" />
                <span>Kembali ke Beranda</span>
              </Button>
            </Link>
            <Link href="/cari">
              <Button variant="secondary" className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                <span>Cari Artikel</span>
              </Button>
            </Link>
          </div>

          {/* Popular Categories */}
          <div className="pt-8 border-t border-gray-200">
            <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-4 flex items-center justify-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#005AE0]" />
              <span>Jelajahi Rubrik Utama Pilar Bangsa</span>
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {popularCategories.map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-[#374151] hover:border-[#005AE0] hover:text-[#005AE0] transition-colors shadow-2xs"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
