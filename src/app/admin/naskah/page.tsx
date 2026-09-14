"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePortal } from "@/context/portal-context";
import { Post } from "@/lib/mock-data";
import { BadgeStatus, StatusVariant } from "@/components/ui/badge-status";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { formatDate, formatNumber } from "@/lib/utils";
import {
  FileText,
  Search,
  ExternalLink,
  History,
  Trash2,
  X,
  Clock,
  UserCheck,
} from "lucide-react";

export default function AdminAllArticlesPage() {
  const { posts, deletePost } = usePortal();

  const [selectedStatus, setSelectedStatus] = useState<"all" | StatusVariant>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [auditPost, setAuditPost] = useState<Post | null>(null);

  const filteredPosts = posts.filter((post) => {
    const matchesStatus =
      selectedStatus === "all" || post.status === selectedStatus;
    const matchesSearch =
      searchQuery.trim() === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-blue-100 text-[#005AE0]">
              <FileText className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#005AE0]">
              Manajemen Konten
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">
            Semua Naskah & Audit Trail ({posts.length})
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280]">
            Katalog lengkap seluruh artikel, draf, dan riwayat kurasi Redaksi UKM Pilar Bangsa & Mahasiswa UNTAG Banyuwangi
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto no-scrollbar">
          {[
            { id: "all", label: "Semua Naskah" },
            { id: "published", label: "Tayang" },
            { id: "pending", label: "Menunggu Review" },
            { id: "draft", label: "Draf" },
            { id: "rejected", label: "Perlu Revisi" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id as "all" | StatusVariant)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedStatus === tab.id
                  ? "bg-[#005AE0] text-white shadow-xs"
                  : "bg-[#F0F4F8] text-[#6B7280] hover:text-[#111827]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul atau nama penulis..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#F0F4F8] text-[#111827] rounded-full border border-transparent focus:border-[#005AE0] focus:bg-white focus:outline-none transition-all placeholder:text-[#6B7280]"
          />
          <Search className="w-3.5 h-3.5 text-[#6B7280] absolute left-3 top-2.5" />
        </div>
      </div>

      {/* All Articles Table */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F0F4F8] border-b border-[#E5E7EB] text-[#6B7280] font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Judul Artikel</th>
                <th className="py-3.5 px-4">Penulis</th>
                <th className="py-3.5 px-4">Rubrik</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Views</th>
                <th className="py-3.5 px-4">Pembaruan</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#6B7280]">
                    Tidak ada artikel yang cocok dengan filter yang dipilih.
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-[#F0F4F8]/50 transition-colors">
                    <td className="py-3.5 px-4 max-w-xs sm:max-w-sm">
                      <span className="font-semibold text-sm text-[#111827] block truncate">
                        {post.title}
                      </span>
                      <span className="text-[11px] text-[#6B7280]">
                        Slug: /{post.slug}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Avatar src={post.author.avatar} name={post.author.name} size="xs" />
                        <span className="text-xs font-medium text-[#111827]">
                          {post.author.name}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-[#6B7280] whitespace-nowrap">
                      {post.category.name}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <BadgeStatus status={post.status} />
                    </td>

                    <td className="py-3.5 px-4 text-[#111827] font-semibold data-tabular whitespace-nowrap">
                      {formatNumber(post.viewCount)}
                    </td>

                    <td className="py-3.5 px-4 text-[#6B7280] whitespace-nowrap">
                      {formatDate(post.updatedAt)}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Audit Trail Button */}
                        <button
                          onClick={() => setAuditPost(post)}
                          className="p-1.5 text-gray-500 hover:text-[#005AE0] rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                          title="Lihat Riwayat Audit Status"
                        >
                          <History className="w-4 h-4" />
                        </button>

                        {post.status === "published" && (
                          <Link
                            href={`/artikel/${post.slug}`}
                            className="p-1.5 text-gray-500 hover:text-[#005AE0] rounded-md hover:bg-gray-100 transition-colors"
                            title="Buka Halaman Publik"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        )}

                        <button
                          onClick={() => {
                            if (confirm("Hapus naskah ini secara permanen dari portal?")) {
                              deletePost(post.id);
                            }
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
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

      {/* Audit Trail Modal (§4 & §5.1 PRD - post_status_history) */}
      {auditPost && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between bg-[#0B172A] text-white">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-blue-400" />
                <div>
                  <h3 className="text-sm font-bold">
                    Audit Trail Riwayat Status (§5.1 PRD)
                  </h3>
                  <span className="text-[11px] text-gray-300">
                    Transparansi perubahan status naskah
                  </span>
                </div>
              </div>
              <button
                onClick={() => setAuditPost(null)}
                className="p-1 text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="pb-3 border-b border-[#E5E7EB]">
                <h4 className="font-bold text-sm text-[#111827]">
                  {auditPost.title}
                </h4>
                <span className="text-xs text-[#6B7280]">
                  Penulis: {auditPost.author.name} ({auditPost.author.email})
                </span>
              </div>

              {/* Timeline of Status Changes */}
              <div className="space-y-4 pl-2 border-l-2 border-blue-200 ml-2">
                <div className="relative pl-4">
                  <div className="absolute -left-[23px] top-0.5 w-3 h-3 rounded-full bg-[#005AE0] ring-4 ring-white" />
                  <span className="text-xs font-bold text-[#111827] block">
                    Status Terkini: {auditPost.status.toUpperCase()}
                  </span>
                  <span className="text-[11px] text-[#6B7280] block">
                    {formatDate(auditPost.updatedAt)} • Diperbarui oleh Pemimpin Redaksi
                  </span>
                  {auditPost.rejectionNote && (
                    <div className="mt-2 p-2.5 rounded-lg bg-red-50 text-xs text-red-900 border border-red-200">
                      <strong>Catatan Revisi:</strong> {auditPost.rejectionNote}
                    </div>
                  )}
                </div>

                <div className="relative pl-4">
                  <div className="absolute -left-[23px] top-0.5 w-3 h-3 rounded-full bg-gray-400 ring-4 ring-white" />
                  <span className="text-xs font-bold text-[#111827] block">
                    Naskah Dibuat
                  </span>
                  <span className="text-[11px] text-[#6B7280]">
                    {formatDate(auditPost.createdAt)} • Diinisialisasi oleh {auditPost.author.name}
                  </span>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setAuditPost(null)}
                >
                  Tutup Riwayat
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
