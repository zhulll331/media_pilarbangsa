"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { usePortal } from "@/context/portal-context";
import { deletePost } from "@/actions/posts";
import type { Post } from "@/lib/types";
import { BadgeStatus, StatusVariant } from "@/components/ui/badge-status";
import { Button } from "@/components/ui/button";
import { formatDate, formatNumber } from "@/lib/utils";
import {
  PenSquare,
  Search,
  Trash2,
  ExternalLink,
  Edit,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function AuthorArticlesPage() {
  const { user, showToast } = usePortal();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<"all" | StatusVariant>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchAuthorPosts = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("posts")
      .select(`
        id, title, slug, excerpt, content, cover_image_url, status,
        published_at, created_at, updated_at, view_count, rejection_note,
        author_id,
        category_id, category:categories(id, name, slug)
      `)
      .eq("author_id", user.id)
      .order("updated_at", { ascending: false });

    if (!error && data) {
      setPosts(
        data.map((p: any) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          excerpt: p.excerpt || "",
          content: p.content || "",
          coverImage: p.cover_image_url || "",
          authorId: p.author_id,
          author: {
            id: user.id,
            name: user.user_metadata?.full_name || user.email || "Penulis",
            avatar: null,
          },
          categoryId: p.category_id,
          category: p.category || { id: "", name: "Umum", slug: "umum" },
          tags: [],
          status: (p.status === "pending_review" ? "pending" : p.status) as Post["status"],
          publishedAt: p.published_at,
          createdAt: p.created_at,
          updatedAt: p.updated_at,
          viewCount: p.view_count || 0,
          rejectionNote: p.rejection_note,
        }))
      );
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchAuthorPosts();
  }, [fetchAuthorPosts]);

  const handleDelete = async (postId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus naskah ini?")) return;

    setDeletingId(postId);
    const res = await deletePost(postId);
    setDeletingId(null);

    if (res?.error) {
      showToast(res.error, "error");
    } else {
      showToast("Naskah berhasil dihapus.", "success");
      fetchAuthorPosts();
    }
  };

  const filteredPosts = posts.filter((p) => {
    const matchesTab = selectedTab === "all" || p.status === selectedTab;
    const matchesSearch =
      searchQuery.trim() === "" ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const tabCounts = {
    all: posts.length,
    draft: posts.filter((p) => p.status === "draft").length,
    pending: posts.filter((p) => p.status === "pending").length,
    published: posts.filter((p) => p.status === "published").length,
    rejected: posts.filter((p) => p.status === "rejected").length,
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
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#005AE0]" />
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
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
                          {post.updatedAt ? formatDate(post.updatedAt) : "-"}
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
                                href={`/author/tulis?id=${post.id}`}
                                className="p-1.5 text-gray-500 hover:text-[#005AE0] rounded transition-colors"
                                title="Lanjutkan Menulis / Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </Link>
                            )}

                            <button
                              disabled={deletingId === post.id}
                              onClick={() => handleDelete(post.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 rounded transition-colors cursor-pointer disabled:opacity-50"
                              title="Hapus Naskah"
                            >
                              {deletingId === post.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="block md:hidden divide-y divide-[#E5E7EB]">
              {filteredPosts.length === 0 ? (
                <div className="py-12 px-4 text-center text-xs text-[#6B7280]">
                  Tidak ada naskah yang sesuai dengan kriteria filter saat ini.
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <div key={post.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-sm text-[#111827] block leading-snug">
                          {post.title}
                        </span>
                        {post.excerpt && (
                          <p className="text-xs text-[#6B7280] line-clamp-2 mt-1">
                            {post.excerpt}
                          </p>
                        )}
                      </div>
                      <div className="shrink-0 pt-0.5">
                        <BadgeStatus status={post.status} />
                      </div>
                    </div>

                    {post.status === "rejected" && post.rejectionNote && (
                      <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2 text-xs text-red-900 leading-relaxed">
                        <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-[#DC2626] block">
                            Catatan Revisi dari Editor:
                          </span>
                          {post.rejectionNote}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 text-xs text-[#6B7280]">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#111827]">{post.category.name}</span>
                        <span>•</span>
                        <span className="data-tabular">{formatNumber(post.viewCount)} baca</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {post.status === "published" ? (
                          <Link
                            href={`/artikel/${post.slug}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#005AE0] hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <span>Lihat</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        ) : (
                          <Link
                            href={`/author/tulis?id=${post.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#005AE0] hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <span>Edit</span>
                            <Edit className="w-3.5 h-3.5" />
                          </Link>
                        )}

                        <button
                          disabled={deletingId === post.id}
                          onClick={() => handleDelete(post.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded transition-colors cursor-pointer disabled:opacity-50"
                          title="Hapus Naskah"
                        >
                          {deletingId === post.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
