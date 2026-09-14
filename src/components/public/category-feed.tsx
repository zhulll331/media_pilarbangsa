"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Post, Category } from "@/lib/mock-data";
import { CategoryBadge } from "@/components/ui/badge";
import { TagChip } from "@/components/ui/tag-chip";
import { formatDate, formatNumber } from "@/lib/utils";
import { Eye, ArrowRight, BookOpen } from "lucide-react";

interface CategoryFeedProps {
  categories: Category[];
  posts: Post[];
}

export function CategoryFeed({ categories, posts }: CategoryFeedProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredPosts =
    selectedCategory === "all"
      ? posts
      : posts.filter((p) => p.categoryId === selectedCategory);

  return (
    <section className="py-8 sm:py-12 border-t border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header & Category Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">
              Katalog Tulisan Terbaru
            </h2>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Jelajahi warta kampus, analisis opini, dan karya sastra mahasiswa
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-[#005AE0] text-white shadow-xs"
                  : "bg-[#F0F4F8] text-[#6B7280] hover:text-[#111827]"
              }`}
            >
              Semua Rubrik
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-[#005AE0] text-white shadow-xs"
                    : "bg-[#F0F4F8] text-[#6B7280] hover:text-[#111827]"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* 3-Column Article Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="group bg-white rounded-xl border border-[#E5E7EB] overflow-hidden hover:border-[#005AE0] hover:shadow-md transition-all duration-300 flex flex-col"
            >
              {/* Card Image */}
              <Link href={`/artikel/${post.slug}`} className="relative aspect-16/10 overflow-hidden bg-gray-100 block">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <CategoryBadge>{post.category.name}</CategoryBadge>
                </div>
              </Link>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#6B7280] mb-2.5">
                    <span>{post.publishedAt ? formatDate(post.publishedAt) : "Draf"}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 data-tabular">
                      <Eye className="w-3.5 h-3.5" />
                      {formatNumber(post.viewCount)}
                    </span>
                  </div>

                  <Link href={`/artikel/${post.slug}`}>
                    <h3 className="text-base font-bold text-[#111827] group-hover:text-[#005AE0] transition-colors line-clamp-2 leading-snug mb-2">
                      {post.title}
                    </h3>
                  </Link>

                  <p className="text-xs sm:text-sm text-[#6B7280] line-clamp-2 leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                </div>

                {/* Tags & Author Footer */}
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
      </div>
    </section>
  );
}
