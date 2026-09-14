import React from "react";
import Link from "next/link";
import { TrendingUp, Mail } from "lucide-react";
import { InstagramIcon, YoutubeIcon, FacebookIcon } from "@/components/ui/social-icons";

export function TopUtilityBar() {
  const currentDate = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="bg-[#F0F4F8] border-b border-[#E5E7EB] text-xs text-[#6B7280] py-1.5 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Trending News Ticker */}
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="inline-flex items-center gap-1 font-bold text-[#DC2626] uppercase text-[10px] tracking-wider shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-pulse" />
            Trending:
          </span>
          <Link
            href="/artikel/pelantikan-pengurus-baru-pilar-bangsa-2026"
            className="truncate hover:text-[#005AE0] transition-colors font-medium text-[#111827]"
          >
            Pelantikan Pengurus Baru UKM Pilar Bangsa 2026: Merawat Nalar Kritis Pers Mahasiswa
          </Link>
        </div>

        {/* Right: Date & Social Media Links */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          <span className="text-[#6B7280] font-normal">{currentDate}</span>
          <div className="h-3 w-px bg-[#E5E7EB]" />
          <div className="flex items-center gap-2 text-[#6B7280]">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#005AE0] transition-colors"
              aria-label="Instagram Pilar Bangsa"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#005AE0] transition-colors"
              aria-label="YouTube Pilar Bangsa"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#005AE0] transition-colors"
              aria-label="Facebook Pilar Bangsa"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a
              href="mailto:ukmpilarbangsa@gmail.com"
              className="hover:text-[#005AE0] transition-colors"
              aria-label="Email Redaksi Pilar Bangsa"
            >
              <Mail className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
