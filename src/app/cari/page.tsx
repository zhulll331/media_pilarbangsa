"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { usePortal } from "@/context/portal-context";
import { TopUtilityBar } from "@/components/public/top-utility-bar";
import { Header } from "@/components/public/header";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { CategoryBadge } from "@/components/ui/badge";
import { formatDate, formatNumber } from "@/lib/utils";
import { Search, ChevronRight, Eye, Calendar } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const { posts, categories } = usePortal();

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  const filteredPosts = posts.filter((post) => {
    if (post.status !== "published") return false;

    const matchesQuery =
      query.trim() === "" ||
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
      post.content.toLowerCase().includes(query.toLowerCase()) ||
      post.tags.some((t) => t.name.toLowerCase().includes(query.toLowerCase()));

    const matchesCategory =
      selectedCategory === "all" || post.categoryId === selectedCategory;

    return matchesQuery && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-[#6B7280]">
        <Link href="/" className="hover:text-[#005AE0] transition-colors">
          Beranda
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="font-semibold text-[#111827]">Pencarian Naskah</span>
      </nav>

      {/* Search Input Hero */}
      <div className="bg-[#F0F4F8] border border-[#E5E7EB] rounded-3xl p-6 sm:p-10 mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-2 tracking-tight">
          Cari Berita & Karya Sastra
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280] mb-6">
          Telusuri arsip artikel investigasi, tulisan opini, cerpen, dan sajak mahasiswa UNTAG
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ketik kata kunci judul, topik, atau penulis..."
              className="w-full pl-10 pr-4 py-3 text-sm bg-white text-[#111827] rounded-full border border-[#E5E7EB] focus:border-[#005AE0] focus:outline-none focus:ring-2 focus:ring-[#005AE0]/20 transition-all placeholder:text-[#6B7280]"
            />
            <Search className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-3.5" />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 bg-white text-sm text-[#111827] rounded-full border border-[#E5E7EB] focus:border-[#005AE0] focus:outline-none transition-all cursor-pointer shrink-0"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Search Results Summary */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB] mb-6">
        <span className="text-xs sm:text-sm text-[#6B7280]">
          Ditemukan <strong className="text-[#111827]">{filteredPosts.length}</strong> tulisan
          {query ? ` untuk kata kunci "${query}"` : ""}
        </span>
      </div>

      {/* Results Grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-[#E5E7EB] rounded-2xl">
          <p className="text-sm font-semibold text-[#111827] mb-1">
            Tidak ada tulisan yang cocok dengan pencarian Anda.
          </p>
          <p className="text-xs text-[#6B7280]">
            Coba gunakan kata kunci lain atau pilih &quot;Semua Kategori&quot;.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="group bg-white rounded-xl border border-[#E5E7EB] overflow-hidden hover:border-[#005AE0] hover:shadow-md transition-all duration-300 flex flex-col"
            >
              <Link
                href={`/artikel/${post.slug}`}
                className="relative aspect-16/10 overflow-hidden bg-gray-100 block"
              >
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <CategoryBadge>{post.category.name}</CategoryBadge>
                </div>
              </Link>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#6B7280] mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.publishedAt ? formatDate(post.publishedAt) : ""}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 data-tabular">
                      <Eye className="w-3 h-3" />
                      {formatNumber(post.viewCount)}
                    </span>
                  </div>

                  <Link href={`/artikel/${post.slug}`}>
                    <h2 className="text-base font-bold text-[#111827] group-hover:text-[#005AE0] transition-colors line-clamp-2 leading-snug mb-2">
                      {post.title}
                    </h2>
                  </Link>

                  <p className="text-xs sm:text-sm text-[#6B7280] line-clamp-2 leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#111827]">{post.author.name}</span>
                  <span className="text-[#005AE0] font-medium group-hover:underline">
                    Baca Selengkapnya →
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <TopUtilityBar />
      <Header />
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<div className="p-12 text-center text-sm">Memuat pencarian...</div>}>
          <SearchContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
