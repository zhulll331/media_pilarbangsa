"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Flame } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Beranda", href: "/" },
    { name: "Berita UKM", href: "/kategori/berita-ukm" },
    { name: "Opini", href: "/kategori/opini" },
    { name: "Sastra", href: "/kategori/sastra" },
    { name: "Cerpen", href: "/kategori/cerpen" },
    { name: "Puisi", href: "/kategori/puisi" },
    { name: "Galeri", href: "/kategori/galeri" },
  ];

  return (
    <nav className="border-b border-[#E5E7EB] bg-white overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <ul className="flex items-center gap-1 sm:gap-2 shrink-0 py-2">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  prefetch={true}
                  className={cn(
                    "inline-block px-3.5 py-2 text-sm font-semibold rounded-full transition-all duration-150 whitespace-nowrap min-h-[44px] flex items-center",
                    isActive
                      ? "bg-[#005AE0] text-white shadow-xs"
                      : "text-[#111827] hover:text-[#005AE0] hover:bg-[#F0F4F8]"
                  )}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-[#DC2626] uppercase tracking-wider shrink-0 pl-4">
          <Flame className="w-4 h-4 fill-[#DC2626]" />
          <span>Edisi Khusus Lustrum Pilar Bangsa</span>
        </div>
      </div>
    </nav>
  );
}
