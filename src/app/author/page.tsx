"use client";

import React from "react";
import Link from "next/link";
import { usePortal } from "@/context/portal-context";
import { StatCard } from "@/components/ui/stat-card";
import { BadgeStatus } from "@/components/ui/badge-status";
import { Button } from "@/components/ui/button";
import { formatDate, formatNumber } from "@/lib/utils";
import {
  PenSquare,
  BookOpen,
  Eye,
  Clock,
  ArrowRight,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";

export default function AuthorDashboardPage() {
  const { posts, currentUser } = usePortal();

  // Filter posts belonging to author (Budi Santoso or current user)
  const authorId = currentUser?.id || "user-author-1";
  const authorPosts = posts.filter((p) => p.authorId === authorId);

  const publishedCount = authorPosts.filter((p) => p.status === "published").length;
  const pendingCount = authorPosts.filter((p) => p.status === "pending").length;
  const draftCount = authorPosts.filter((p) => p.status === "draft").length;
  const rejectedCount = authorPosts.filter((p) => p.status === "rejected").length;

  const totalViews = authorPosts.reduce((acc, p) => acc + p.viewCount, 0);

  const recentPosts = authorPosts.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Top Greeting & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">
            Halo, {currentUser?.name || "Budi Santoso"}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
            Ruang kreasi dan publikasi naskah terbuka bagi seluruh mahasiswa UNTAG Banyuwangi bersama Redaksi UKM Pilar Bangsa.
          </p>
        </div>

        <Link href="/author/tulis">
          <Button variant="primary" size="md" className="gap-2 shadow-sm">
            <PenSquare className="w-4 h-4" />
            <span>Tulis Naskah Baru</span>
          </Button>
        </Link>
      </div>

      {/* 3-Column Stat Card Grid (§3.2 PRD & design.md) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          label="Total Tulisan"
          value={authorPosts.length}
          subtext={`${publishedCount} naskah tayang, ${draftCount} draf aktif`}
          icon={<BookOpen className="w-5 h-5" />}
        />
        <StatCard
          label="Total Pembaca"
          value={totalViews}
          subtext="Akumulasi views seluruh artikel publik"
          icon={<Eye className="w-5 h-5" />}
          variant="highlight"
        />
        <StatCard
          label="Menunggu Kurasi"
          value={pendingCount}
          subtext={rejectedCount > 0 ? `${rejectedCount} naskah perlu revisi` : "Dalam antrean tinjau editor"}
          icon={<Clock className="w-5 h-5" />}
          variant={rejectedCount > 0 ? "warning" : "default"}
        />
      </div>

      {/* Rejection Alert Notice if any */}
      {rejectedCount > 0 && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <span className="font-bold text-[#DC2626] block text-sm">
              Perhatian: Anda memiliki naskah yang memerlukan revisi
            </span>
            <p className="text-red-800 mt-0.5">
              Editor redaksi telah memberikan catatan perbaikan. Silakan periksa tab naskah Anda untuk memperbaiki dan mengirim ulang.
            </p>
          </div>
          <Link href="/author/tulisan">
            <Button variant="danger" size="sm">
              Periksa Catatan
            </Button>
          </Link>
        </div>
      )}

      {/* Recent Articles Table Preview */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
        <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#111827]">
              Aktivitas Naskah Terbaru
            </h2>
            <p className="text-xs text-[#6B7280]">
              Riwayat status publikasi karya tulis Anda
            </p>
          </div>
          <Link
            href="/author/tulisan"
            className="text-xs font-semibold text-[#005AE0] hover:underline flex items-center gap-1"
          >
            <span>Lihat Semua ({authorPosts.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F0F4F8] border-b border-[#E5E7EB] text-[#6B7280] font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Judul Naskah</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Tanggal Diperbarui</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {recentPosts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#6B7280]">
                    Belum ada tulisan. Klik tombol &quot;Tulis Naskah Baru&quot; untuk memulai!
                  </td>
                </tr>
              ) : (
                recentPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-[#F0F4F8]/50 transition-colors">
                    <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                      <span className="font-semibold text-sm text-[#111827] block truncate">
                        {post.title}
                      </span>
                      {post.status === "rejected" && post.rejectionNote && (
                        <div className="mt-1 text-xs text-[#DC2626] bg-red-50 p-2 rounded-lg border border-red-100">
                          <strong>Catatan Redaksi:</strong> {post.rejectionNote}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-[#6B7280] whitespace-nowrap">
                      {post.category.name}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <BadgeStatus status={post.status} />
                    </td>
                    <td className="py-3.5 px-4 text-[#6B7280] whitespace-nowrap">
                      {formatDate(post.updatedAt)}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      {post.status === "published" ? (
                        <Link
                          href={`/artikel/${post.slug}`}
                          className="inline-flex items-center gap-1 text-[#005AE0] hover:underline font-semibold"
                        >
                          <span>Lihat</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      ) : (
                        <Link
                          href="/author/tulis"
                          className="text-[#005AE0] hover:underline font-semibold"
                        >
                          Edit / Tinjau
                        </Link>
                      )}
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
