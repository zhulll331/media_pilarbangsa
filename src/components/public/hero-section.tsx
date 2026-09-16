"use client";

import React from "react";
import Link from "next/link";
import type { Post } from "@/lib/types";
import { CategoryBadge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { formatDate, formatNumber } from "@/lib/utils";
import { Eye, ArrowRight, TrendingUp } from "lucide-react";

interface HeroSectionProps {
  featuredPost: Post;
  popularPosts: Post[];
}

export function HeroSection({ featuredPost, popularPosts }: HeroSectionProps) {
  return (
    <section className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* 12-Column Asymmetric Grid: 8 (Main Hero) + 4 (Sidebar Terpopuler) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Main Hero: 8 Columns */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="relative rounded-2xl overflow-hidden group bg-[#0B172A] flex-1 flex flex-col justify-end min-h-[300px] sm:min-h-[420px] lg:min-h-[480px] shadow-sm">
              {/* Background Cover Image with Hover Scale */}
              <img
                src={featuredPost.coverImage}
                alt={featuredPost.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-80"
              />

              {/* Dark Gradient Overlay for 4.5:1 WCAG contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B172A] via-[#0B172A]/70 to-transparent" />

              {/* Hero Content Area */}
              <div className="relative z-10 p-5 sm:p-8 lg:p-10 flex flex-col gap-3.5">
                <div className="flex items-center gap-2.5">
                  <CategoryBadge>{featuredPost.category.name}</CategoryBadge>
                  <span className="text-white/80 text-xs font-medium">
                    {featuredPost.readTime}
                  </span>
                </div>

                <Link href={`/artikel/${featuredPost.slug}`}>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight hover:text-blue-300 transition-colors">
                    {featuredPost.title}
                  </h1>
                </Link>

                <p className="text-sm sm:text-base text-gray-200 line-clamp-2 max-w-2xl leading-relaxed">
                  {featuredPost.excerpt}
                </p>

                {/* Byline & CTA */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 mt-2">
                  <div className="flex items-center gap-2.5">
                    <Avatar
                      src={featuredPost.author.avatar}
                      name={featuredPost.author.name}
                      size="sm"
                      className="border-white/20"
                    />
                    <div className="text-xs text-white">
                      <span className="font-semibold block">{featuredPost.author.name}</span>
                      <span className="text-gray-300 text-[11px]">
                        {featuredPost.publishedAt ? formatDate(featuredPost.publishedAt) : ""}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/artikel/${featuredPost.slug}`}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-white bg-[#005AE0] hover:bg-[#0048b3] px-5 py-2.5 rounded-full transition-all duration-200 shadow-md group-hover:gap-3"
                  >
                    <span>Baca Selengkapnya</span>
                    <ArrowRight className="w-4 h-4 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar: 4 Columns (surface-dark / #0B172A with Tabular Figures) */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="bg-[#0B172A] text-white rounded-2xl p-6 flex-1 flex flex-col border border-white/10 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#DC2626]" />
                  <h2 className="text-base font-bold text-white tracking-tight">
                    Karya Terpopuler
                  </h2>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-white/10 px-2 py-0.5 rounded-full">
                  Minggu Ini
                </span>
              </div>

              {/* 5 Popular Items List */}
              <div className="flex flex-col divide-y divide-white/10 flex-1 justify-between">
                {popularPosts.slice(0, 5).map((post, index) => (
                  <Link
                    key={post.id}
                    href={`/artikel/${post.slug}`}
                    className="py-3 group flex items-start gap-3.5 hover:bg-white/5 px-2.5 rounded-lg transition-colors"
                  >
                    {/* Ranking Number */}
                    <span className="text-2xl font-black text-gray-500 group-hover:text-[#005AE0] transition-colors leading-none shrink-0 data-tabular w-6">
                      0{index + 1}
                    </span>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-1">
                        <span className="text-blue-400 font-semibold">{post.category.name}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 data-tabular">
                          <Eye className="w-3 h-3 text-gray-400" />
                          {formatNumber(post.viewCount)}
                        </span>
                      </div>
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-100 group-hover:text-blue-300 transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
