"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePortal } from "@/context/portal-context";
import { ShieldCheck, PenTool, Eye, ChevronRight, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function RolePreviewBar() {
  const { currentRole, setRole, posts } = usePortal();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const pendingCount = posts.filter((p) => p.status === "pending").length;

  if (isCollapsed) {
    return (
      <button
        onClick={() => setIsCollapsed(false)}
        className="fixed top-2 right-2 z-50 bg-[#0B172A] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg border border-blue-500/30 flex items-center gap-1.5 cursor-pointer hover:bg-blue-900 transition-colors"
        title="Buka Menu Pengujian Peran"
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>Mode Uji: {currentRole.toUpperCase()}</span>
      </button>
    );
  }

  return (
    <aside
      aria-label="Panel Pengujian Frontend"
      className="bg-[#0B172A] text-white text-xs py-2 px-4 border-b border-white/10 sticky top-0 z-50 shadow-md flex flex-wrap items-center justify-between gap-3"
    >
      <div className="flex items-center gap-2">
        <span className="bg-[#005AE0] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
          Demo Mode
        </span>
        <span className="text-gray-300 hidden md:inline">
          Pilih peran untuk menguji antarmuka & alur kerja:
        </span>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        {/* Guest / Reader */}
        <button
          onClick={() => setRole("guest")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer",
            currentRole === "guest"
              ? "bg-white text-[#0B172A] shadow-xs"
              : "text-gray-300 hover:text-white hover:bg-white/10"
          )}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Pembaca (Tamu)</span>
        </button>

        {/* Author */}
        <button
          onClick={() => setRole("author")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer",
            currentRole === "author"
              ? "bg-[#005AE0] text-white shadow-xs"
              : "text-gray-300 hover:text-white hover:bg-white/10"
          )}
        >
          <PenTool className="w-3.5 h-3.5" />
          <span>Author (Budi)</span>
        </button>

        {/* Admin */}
        <button
          onClick={() => setRole("admin")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer relative",
            currentRole === "admin"
              ? "bg-amber-500 text-[#0B172A] font-semibold shadow-xs"
              : "text-gray-300 hover:text-white hover:bg-white/10"
          )}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Admin / Redaksi (Siti)</span>
          {pendingCount > 0 && (
            <span className="ml-0.5 px-1.5 py-0.2 bg-red-600 text-white text-[10px] font-bold rounded-full">
              {pendingCount}
            </span>
          )}
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="h-4 w-px bg-white/20 hidden sm:block" />

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="text-gray-300 hover:text-white underline-offset-2 hover:underline text-[11px]"
          >
            Portal
          </Link>
          <span className="text-gray-600">/</span>
          <Link
            href="/author"
            className="text-gray-300 hover:text-white underline-offset-2 hover:underline text-[11px]"
          >
            Dashboard Author
          </Link>
          <span className="text-gray-600">/</span>
          <Link
            href="/admin"
            className="text-amber-400 hover:text-amber-300 underline-offset-2 hover:underline text-[11px] font-medium"
          >
            Dashboard Admin
          </Link>
        </div>

        <button
          onClick={() => setIsCollapsed(true)}
          className="text-gray-400 hover:text-white p-1 rounded-sm cursor-pointer ml-1"
          title="Sembunyikan bar pengujian"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
