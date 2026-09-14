"use client";

import React, { use } from "react";
import Link from "next/link";
import { usePortal } from "@/context/portal-context";
import { TopUtilityBar } from "@/components/public/top-utility-bar";
import { Header } from "@/components/public/header";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { CategoryBadge } from "@/components/ui/badge";
import { TagChip } from "@/components/ui/tag-chip";
import { formatDate, formatNumber } from "@/lib/utils";
import { ChevronRight, Eye, Layers } from "lucide-react";

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { categories, posts } = usePortal();

  const category = categories.find((c) => c.slug === slug);
  const categoryPosts = posts.filter(
    (p) => p.category.slug === slug && p.status === "published"
  );

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <TopUtilityBar />
      <Header />
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-[#6B7280]">
            <Link href="/" className="hover:text-[#005AE0] transition-colors">
              Beranda
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span>Kategori</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="font-semibold text-[#111827]">
              {category?.name || slug}
            </span>
          </nav>

          {/* Category Header Banner */}
          <div className="bg-[#F0F4F8] border border-[#E5E7EB] rounded-2xl p-6 sm:p-10 mb-10">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#005AE0] mb-2">
                <Layers className="w-4 h-4" />
                <span>Rubrik Publikasi</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold text-[#111827] tracking-tight mb-3">
                {category?.name || slug}
              </h1>
              <p className="text-sm sm:text-base text-[#6B7280] leading-relaxed">
                {category?.description ||
                  "Kumpulan karya jurnalistik dan literasi mahasiswa dalam rubrik ini."}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#111827] bg-white px-3 py-1 rounded-full border border-[#E5E7EB]">
                <span>Total {categoryPosts.length} Tulisan Terbit</span>
              </div>
            </div>
          </div>

          {/* Articles Grid */}
          {categoryPosts.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-[#E5E7EB] rounded-2xl">
              <p className="text-sm text-[#6B7280] mb-4">
                Belum ada tulisan yang dipublikasikan dalam kategori ini.
              </p>
              <Link
                href="/"
                className="text-xs font-semibold text-[#005AE0] hover:underline"
              >
                Kembali ke Beranda
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryPosts.map((post) => (
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
                      <div className="flex items-center gap-2 text-xs text-[#6B7280] mb-2.5">
                        <span>{post.publishedAt ? formatDate(post.publishedAt) : ""}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 data-tabular">
                          <Eye className="w-3.5 h-3.5" />
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

                    <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between gap-2 mt-auto">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {post.tags.slice(0, 2).map((tag) => (
                          <TagChip key={tag.id} href={`/tag/${tag.slug}`}>
                            {tag.name}
                          </TagChip>
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-[#111827] truncate max-w-[120px]">
                        {post.author.name}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
