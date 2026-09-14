"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePortal } from "@/context/portal-context";
import { BadgeStatus, StatusVariant } from "@/components/ui/badge-status";
import { Button } from "@/components/ui/button";
import { formatDate, formatNumber } from "@/lib/utils";
import {
  PenSquare,
  Search,
  Trash2,
  ExternalLink,
  Edit,
  Eye,
  AlertCircle,
} from "lucide-react";

export default function AuthorArticlesPage() {
  const { posts, currentUser, deletePost } = usePortal();
  const [selectedTab, setSelectedTab] = useState<"all" | StatusVariant>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const authorId = currentUser?.id || "user-author-1";
  const authorPosts = posts.filter((p) => p.authorId === authorId);

  const filteredPosts = authorPosts.filter((p) => {
    const matchesTab = selectedTab === "all" || p.status === selectedTab;
    const matchesSearch =
      searchQuery.trim() === "" ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const tabCounts = {
    all: authorPosts.length,
    draft: authorPosts.filter((p) => p.status === "draft").length,
    pending: authorPosts.filter((p) => p.status === "pending").length,
    published: authorPosts.filter((p) => p.status === "published").length,
    rejected: authorPosts.filter((p) => p.status === "rejected").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">
            Tulisan Saya
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
            Kelola draf, pantau proses kurasi editor, dan lihat statistik karya Anda
          </p>
        </div>

        <Link href="/author/tulis">
          <Button variant="primary" size="md" className="gap-2">
            <PenSquare className="w-4 h-4" />
            <span>Tulis Naskah Baru</span>
          </Button>
        </Link>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto no-scrollbar">
          {[
            { id: "all", label: "Semua" },
            { id: "published", label: "Tayang" },
            { id: "pending", label: "Menunggu Review" },
            { id: "draft", label: "Draf" },
            { id: "rejected", label: "Perlu Revisi" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as "all" | StatusVariant)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                selectedTab === tab.id
                  ? "bg-[#005AE0] text-white shadow-xs"
                  : "bg-[#F0F4F8] text-[#6B7280] hover:text-[#111827]"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedTab === tab.id
                    ? "bg-white/20 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {tabCounts[tab.id as keyof typeof tabCounts]}
              </span>
            </button>
          ))}
        </div>

        {/* Search Filter */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari naskah saya..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F0F4F8] text-[#111827] rounded-full border border-transparent focus:border-[#005AE0] focus:bg-white focus:outline-none transition-all placeholder:text-[#6B7280]"
          />
          <Search className="w-3.5 h-3.5 text-[#6B7280] absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F0F4F8] border-b border-[#E5E7EB] text-[#6B7280] font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Judul & Catatan Revisi</th>
                <th className="py-3 px-4">Rubrik</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Pembaca</th>
                <th className="py-3 px-4">Pembaruan Terakhir</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#6B7280]">
                    Tidak ada naskah yang sesuai dengan kriteria filter saat ini.
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-[#F0F4F8]/50 transition-colors">
                    <td className="py-4 px-4 max-w-sm">
                      <span className="font-bold text-sm text-[#111827] block mb-1">
                        {post.title}
                      </span>
                      <p className="text-xs text-[#6B7280] line-clamp-1 mb-1">
                        {post.excerpt}
                      </p>

                      {/* Explicit Rejection Note Display as mandated by PRD §3.2 & §3.3 */}
                      {post.status === "rejected" && post.rejectionNote && (
                        <div className="mt-2 p-2.5 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                          <div className="text-xs text-red-900 leading-relaxed">
                            <span className="font-bold text-[#DC2626] block">
                              Catatan Revisi dari Editor:
                            </span>
                            {post.rejectionNote}
                          </div>
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-4 text-[#6B7280] whitespace-nowrap">
                      {post.category.name}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <BadgeStatus status={post.status} />
                    </td>

                    <td className="py-4 px-4 text-[#111827] font-semibold data-tabular whitespace-nowrap">
                      {formatNumber(post.viewCount)}
                    </td>

                    <td className="py-4 px-4 text-[#6B7280] whitespace-nowrap">
                      {formatDate(post.updatedAt)}
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {post.status === "published" ? (
                          <Link
                            href={`/artikel/${post.slug}`}
                            className="p-1.5 text-gray-500 hover:text-[#005AE0] rounded transition-colors"
                            title="Buka Halaman Artikel"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        ) : (
                          <Link
                            href="/author/tulis"
                            className="p-1.5 text-gray-500 hover:text-[#005AE0] rounded transition-colors"
                            title="Lanjutkan Menulis / Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                        )}

                        <button
                          onClick={() => {
                            if (confirm("Apakah Anda yakin ingin menghapus naskah ini?")) {
                              deletePost(post.id);
                            }
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                          title="Hapus Naskah"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
