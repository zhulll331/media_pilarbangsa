"use client";

import React from "react";
import Link from "next/link";
import type { Post } from "@/lib/types";
import { CategoryBadge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Sparkles, ArrowRight } from "lucide-react";

interface BentoGridProps {
  posts: Post[];
}

export function BentoGrid({ posts }: BentoGridProps) {
  if (posts.length < 4) return null;

  const [lead, item1, item2, item3] = posts;

  return (
    <section className="py-8 sm:py-12 border-t border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-blue-50 text-[#005AE0]">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">
                Pilihan Redaksi & Editor
              </h2>
              <p className="text-xs text-[#6B7280]">
                Sorotan karya tulisan dan literasi mahasiswa UNTAG Banyuwangi paling berbobot
              </p>
            </div>
          </div>
        </div>

        {/* Bento Grid: 1 large card + 3 stacked cards */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Card 1: Large Featured Bento Card (7 cols) */}
          <Link
            href={`/artikel/${lead.slug}`}
            className="md:col-span-7 group relative rounded-2xl overflow-hidden bg-[#0B172A] min-h-[360px] flex flex-col justify-end p-6 sm:p-8 shadow-xs hover:shadow-md transition-all"
          >
            <img
              src={lead.coverImage}
              alt={lead.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B172A] via-[#0B172A]/60 to-transparent" />

            <div className="relative z-10 flex flex-col gap-2.5">
              <CategoryBadge>{lead.category.name}</CategoryBadge>
              <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-blue-300 transition-colors leading-snug">
                {lead.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-200 line-clamp-2">
                {lead.excerpt}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-300 pt-1">
                <span>Oleh {lead.author.name}</span>
                <span>•</span>
                <span>{lead.publishedAt ? formatDate(lead.publishedAt) : ""}</span>
              </div>
            </div>
          </Link>

          {/* Cards 2, 3, 4: Right Bento Stack (5 cols) */}
          <div className="md:col-span-5 grid grid-cols-1 gap-5">
            {[item1, item2, item3].map((post) => (
              <Link
                key={post.id}
                href={`/artikel/${post.slug}`}
                className="group flex items-center gap-4 p-4 rounded-xl border border-[#E5E7EB] bg-white hover:border-[#005AE0] hover:shadow-sm transition-all"
              >
                {/* Thumbnail */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-24 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                  <div>
                    <span className="text-[10px] font-bold text-[#005AE0] uppercase tracking-wider block mb-1">
                      {post.category.name}
                    </span>
                    <h4 className="text-xs sm:text-sm font-semibold text-[#111827] group-hover:text-[#005AE0] transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h4>
                  </div>
                  <div className="text-[11px] text-[#6B7280] mt-2">
                    {post.author.name} • {post.readTime}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
