"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import type { Post } from "@/lib/types";
import { CategoryBadge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { formatDate, formatNumber } from "@/lib/utils";
import { Eye, ArrowRight, TrendingUp, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

interface HeroSectionProps {
  featuredPost?: Post;
  featuredPosts?: Post[];
  popularPosts: Post[];
}

export function HeroSection({ featuredPost, featuredPosts, popularPosts }: HeroSectionProps) {
  // Normalize posts into an array of featured items
  const posts: Post[] = featuredPosts && featuredPosts.length > 0
    ? featuredPosts
    : featuredPost
    ? [featuredPost]
    : [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  const total = posts.length;

  const goToPrev = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  }, [total]);

  const goToNext = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  }, [total]);

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
  };

  // Auto-play timer every 5 seconds (5000ms)
  useEffect(() => {
    if (isPaused || total <= 1) return;

    const timer = setInterval(() => {
      goToNext();
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, total, goToNext]);

  // Touch Swipe Handlers for mobile ("bisa digeser")
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchEndXRef.current = null;
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (touchStartXRef.current === null || touchEndXRef.current === null) return;

    const diff = touchStartXRef.current - touchEndXRef.current;
    // Swipe threshold 40px
    if (diff > 40) {
      goToNext();
    } else if (diff < -40) {
      goToPrev();
    }

    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  if (posts.length === 0) return null;

  return (
    <section className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* 12-Column Asymmetric Grid: 8 (Main Hero Slider) + 4 (Sidebar Terpopuler) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* Main Hero Slider: 8 Columns */}
          <div className="lg:col-span-8 flex flex-col">
            <div
              className="relative rounded-2xl overflow-hidden group bg-[#0B172A] flex-1 flex flex-col justify-end min-h-[340px] sm:min-h-[440px] lg:min-h-[500px] shadow-sm select-none"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Carousel Track with smooth horizontal transform */}
              <div
                className="flex w-full h-full absolute inset-0 transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {posts.map((post, idx) => (
                  <div
                    key={post.id || idx}
                    className="min-w-full w-full h-full relative flex flex-col justify-end shrink-0"
                  >
                    {/* Background Cover Image with subtle scale */}
                    <img
                      src={post.coverImage || "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1200"}
                      alt={post.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-80"
                    />

                    {/* Dark Gradient Overlay for optimal readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B172A] via-[#0B172A]/70 to-transparent pointer-events-none" />

                    {/* Slide Content Area */}
                    <div className="relative z-10 p-5 sm:p-8 lg:p-10 flex flex-col gap-3.5">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <CategoryBadge>{post.category?.name || "Umum"}</CategoryBadge>
                        <span className="text-white/80 text-xs font-medium">
                          {post.readTime || "3 menit baca"}
                        </span>
                        <span className="text-white/60 text-xs">•</span>
                        <span className="text-white/80 text-xs flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-blue-400" />
                          {formatNumber(post.viewCount || 0)} pembaca
                        </span>
                      </div>

                      <Link href={`/artikel/${post.slug}`}>
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight leading-snug hover:text-blue-300 transition-colors line-clamp-2 sm:line-clamp-3">
                          {post.title}
                        </h2>
                      </Link>

                      <p className="text-xs sm:text-sm text-gray-200 line-clamp-2 max-w-2xl leading-relaxed hidden sm:block">
                        {post.excerpt}
                      </p>

                      {/* Byline & CTA */}
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 mt-1">
                        <div className="flex items-center gap-2.5">
                          <Avatar
                            src={post.author?.avatar}
                            name={post.author?.name || "Penulis"}
                            size="sm"
                            className="border-white/20"
                          />
                          <div className="text-xs text-white">
                            <span className="font-semibold block">{post.author?.name || "Redaksi"}</span>
                            <span className="text-gray-300 text-[11px]">
                              {post.publishedAt ? formatDate(post.publishedAt) : ""}
                            </span>
                          </div>
                        </div>

                        <Link
                          href={`/artikel/${post.slug}`}
                          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-white bg-[#005AE0] hover:bg-[#0048b3] px-4 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all duration-200 shadow-md group-hover:gap-3"
                        >
                          <span>Baca Selengkapnya</span>
                          <ArrowRight className="w-4 h-4 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Floating Slide Navigation Controls (Left & Right Arrows) */}
              {total > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      goToPrev();
                    }}
                    aria-label="Berita Sebelumnya"
                    className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/75 active:scale-90 text-white flex items-center justify-center backdrop-blur-md border border-white/25 transition-all shadow-md cursor-pointer hover:border-white/60"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      goToNext();
                    }}
                    aria-label="Berita Berikutnya"
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/75 active:scale-90 text-white flex items-center justify-center backdrop-blur-md border border-white/25 transition-all shadow-md cursor-pointer hover:border-white/60"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>

                  {/* Slide Indicators & Auto-Play Status Bar (Top Right) */}
                  <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                    {/* Index Counter */}
                    <span className="text-[11px] font-bold text-white tracking-wider data-tabular">
                      0{currentIndex + 1} <span className="text-white/50">/</span> 0{total}
                    </span>

                    {/* Dot Indicators */}
                    <div className="flex items-center gap-1.5 ml-1">
                      {posts.map((_, dotIdx) => (
                        <button
                          key={dotIdx}
                          type="button"
                          onClick={() => goToSlide(dotIdx)}
                          aria-label={`Ke slide ${dotIdx + 1}`}
                          className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                            currentIndex === dotIdx
                              ? "w-5 bg-[#005AE0]"
                              : "w-1.5 bg-white/40 hover:bg-white/70"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Sidebar: 4 Columns (Karya Terpopuler Minggu Ini) */}
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
