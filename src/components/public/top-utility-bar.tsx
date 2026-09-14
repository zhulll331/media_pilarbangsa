"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Mail, MapPin } from "lucide-react";
import { InstagramIcon } from "@/components/ui/social-icons";

export interface TrendingItem {
  title: string;
  slug: string;
}

interface TopUtilityBarProps {
  initialTrending?: TrendingItem | null;
}

export function TopUtilityBar({ initialTrending }: TopUtilityBarProps) {
  const [trending, setTrending] = useState<TrendingItem | null>(
    initialTrending !== undefined ? initialTrending : null
  );

  useEffect(() => {
    if (initialTrending !== undefined) {
      setTrending(initialTrending);
      return;
    }

    const fetchTrendingPost = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("posts")
          .select("title, slug")
          .eq("status", "published")
          .order("view_count", { ascending: false })
          .order("published_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (data) {
          setTrending({
            title: data.title,
            slug: data.slug,
          });
        }
      } catch (err) {
        console.warn("Gagal memuat berita trending:", err);
      }
    };

    fetchTrendingPost();
  }, [initialTrending]);

  const currentDate = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="bg-[#F0F4F8] border-b border-[#E5E7EB] text-xs text-[#6B7280] py-1.5 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Dynamic Trending News Ticker */}
        <div className="flex items-center gap-2 overflow-hidden">
          {trending ? (
            <>
              <span className="inline-flex items-center gap-1 font-bold text-[#DC2626] uppercase text-[10px] tracking-wider shrink-0">
                <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-pulse" />
                Trending:
              </span>
              <Link
                href={`/artikel/${trending.slug}`}
                className="truncate hover:text-[#005AE0] transition-colors font-medium text-[#111827]"
              >
                {trending.title}
              </Link>
            </>
          ) : (
            <span className="truncate text-gray-500 font-medium text-[11px]">
              Media Karya Mahasiswa & Pers Kampus UNTAG Banyuwangi
            </span>
          )}
        </div>

        {/* Right: Date & Social Media Links */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          <span className="text-[#6B7280] font-normal">{currentDate}</span>
          <div className="h-3 w-px bg-[#E5E7EB]" />
          <div className="flex items-center gap-3 text-[#6B7280]">
            <a
              href="https://www.instagram.com/ukmpilarbangsa?igsh=MWxtOHlhaGlrczNl"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#E1306C] transition-colors"
              aria-label="Instagram @ukmpilarbangsa"
              title="Instagram @ukmpilarbangsa"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
            </a>
            <a
              href="mailto:ukmpilarbangsa@gmail.com"
              className="hover:text-[#005AE0] transition-colors"
              aria-label="Email Redaksi Pilar Bangsa"
              title="Email ukmpilarbangsa@gmail.com"
            >
              <Mail className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://maps.app.goo.gl/Kqw7VtiUXvSuqFFS6"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red-500 transition-colors"
              aria-label="Lokasi Sekretariat Google Maps"
              title="Lokasi Google Maps"
            >
              <MapPin className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
