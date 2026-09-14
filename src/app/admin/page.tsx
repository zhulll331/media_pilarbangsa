"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePortal } from "@/context/portal-context";
import { Post } from "@/lib/mock-data";
import { BadgeStatus } from "@/components/ui/badge-status";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import {
  Inbox,
  CheckCircle2,
  XCircle,
  Eye,
  AlertTriangle,
  X,
  FileText,
} from "lucide-react";

export default function AdminReviewQueuePage() {
  const { posts, approvePost, rejectPost, showToast } = usePortal();

  const [previewPost, setPreviewPost] = useState<Post | null>(null);
  const [rejectingPost, setRejectingPost] = useState<Post | null>(null);
  const [rejectionNote, setRejectionNote] = useState("");

  const pendingPosts = posts.filter((p) => p.status === "pending");

  const handleApprove = (postId: string) => {
    approvePost(postId);
    if (previewPost?.id === postId) {
      setPreviewPost(null);
    }
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingPost) return;

    if (!rejectionNote.trim()) {
      showToast("Alasan penolakan / catatan revisi wajib diisi (§5.2 PRD).", "warning");
      return;
    }

    rejectPost(rejectingPost.id, rejectionNote.trim());
    setRejectingPost(null);
    setRejectionNote("");
    if (previewPost?.id === rejectingPost.id) {
      setPreviewPost(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-amber-100 text-[#D97706]">
              <Inbox className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#D97706]">
              Kurasi Redaksi UKM Pilar Bangsa
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">
            Antrean Review Naskah ({pendingPosts.length})
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280]">
            Tinjau kelayakan publikasi karya mahasiswa, orisinalitas, dan etika penulisan sebelum terbit
          </p>
        </div>
      </div>

      {/* Pending Queue Table */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F0F4F8] border-b border-[#E5E7EB] text-[#6B7280] font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Judul Naskah</th>
                <th className="py-3.5 px-4">Penulis Mahasiswa</th>
                <th className="py-3.5 px-4">Rubrik</th>
                <th className="py-3.5 px-4">Tanggal Diajukan</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Tindakan Redaksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {pendingPosts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-[#6B7280]">
                    <CheckCircle2 className="w-10 h-10 text-[#059669] mx-auto mb-2 opacity-80" />
                    <p className="text-sm font-semibold text-[#111827]">
                      Semua antrean telah ditinjau!
                    </p>
                    <p className="text-xs text-[#6B7280]">
                      Tidak ada naskah baru yang menunggu keputusan kurasi saat ini.
                    </p>
                  </td>
                </tr>
              ) : (
                pendingPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-[#F0F4F8]/50 transition-colors">
                    <td className="py-4 px-4 max-w-xs">
                      <span className="font-bold text-sm text-[#111827] block mb-1">
                        {post.title}
                      </span>
                      <p className="text-xs text-[#6B7280] line-clamp-1">
                        {post.excerpt}
                      </p>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Avatar src={post.author.avatar} name={post.author.name} size="sm" />
                        <div>
                          <span className="font-semibold text-xs text-[#111827] block">
                            {post.author.name}
                          </span>
                          <span className="text-[10px] text-[#6B7280]">
                            {post.author.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-[#6B7280] whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full bg-gray-100 font-medium">
                        {post.category.name}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-[#6B7280] whitespace-nowrap">
                      {formatDate(post.createdAt)}
                    </td>

                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <BadgeStatus status="pending" />
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {/* Preview / Read Button */}
                        <button
                          onClick={() => setPreviewPost(post)}
                          className="px-3 py-1.5 rounded-full border border-[#E5E7EB] text-[#111827] hover:border-[#005AE0] hover:text-[#005AE0] font-semibold text-xs transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Baca</span>
                        </button>

                        {/* Approve Button (Green #059669 per design.md) */}
                        <button
                          onClick={() => handleApprove(post.id)}
                          className="px-3 py-1.5 rounded-full bg-[#059669] hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1"
                          title="Setujui dan tayangkan ke portal publik"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>

                        {/* Reject Button (Red #DC2626 opens mandatory note modal) */}
                        <button
                          onClick={() => {
                            setRejectingPost(post);
                            setRejectionNote("");
                          }}
                          className="px-3 py-1.5 rounded-full border border-[#DC2626] text-[#DC2626] hover:bg-red-50 font-semibold text-xs transition-colors cursor-pointer inline-flex items-center gap-1"
                          title="Tolak dan minta revisi dari penulis"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
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

      {/* MODAL 1: Full Article Preview Drawer/Modal */}
      {previewPost && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F0F4F8]">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-white shadow-2xs text-[#005AE0]">
                  <FileText className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-[#111827]">
                    Tinjauan Naskah Kurasi
                  </h3>
                  <span className="text-xs text-[#6B7280]">
                    Diajukan oleh {previewPost.author.name} • {previewPost.category.name}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setPreviewPost(null)}
                className="p-1.5 text-gray-400 hover:text-black rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-sm text-[#111827] leading-relaxed">
              <h2 className="text-2xl font-bold tracking-tight">
                {previewPost.title}
              </h2>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs italic text-gray-700">
                <strong>Excerpt Ringkasan:</strong> {previewPost.excerpt}
              </div>

              <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={previewPost.coverImage}
                  alt={previewPost.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/<[a-z][\s\S]*>/i.test(previewPost.content) ? (
                <div
                  className="tiptap ProseMirror text-sm leading-loose text-gray-800"
                  dangerouslySetInnerHTML={{ __html: previewPost.content }}
                />
              ) : (
                <div className="space-y-4 whitespace-pre-line text-sm leading-loose text-gray-800">
                  {previewPost.content}
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 sm:p-6 border-t border-[#E5E7EB] bg-gray-50 flex items-center justify-between gap-3">
              <span className="text-xs text-[#6B7280]">
                Status saat ini: <strong>Menunggu Persetujuan</strong>
              </span>

              <div className="flex items-center gap-3">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    setRejectingPost(previewPost);
                    setRejectionNote("");
                  }}
                  className="gap-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Tolak & Minta Revisi</span>
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleApprove(previewPost.id)}
                  className="bg-[#059669] hover:bg-emerald-700 gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Publikasikan</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Mandatory Rejection Note Modal (§3.3 & §5.2 PRD) */}
      {rejectingPost && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between bg-red-50">
              <div className="flex items-center gap-2 text-[#DC2626]">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-sm font-bold">
                  Catatan Revisi Wajib (§3.3 PRD)
                </h3>
              </div>
              <button
                onClick={() => setRejectingPost(null)}
                className="p-1 text-gray-400 hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmReject} className="p-6 space-y-4">
              <p className="text-xs text-gray-700 leading-relaxed">
                Anda akan menolak naskah <strong>&quot;{rejectingPost.title}&quot;</strong> karya <strong>{rejectingPost.author.name}</strong>. Jelaskan bagian yang perlu direvisi agar penulis dapat memperbaiki:
              </p>

              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1">
                  Catatan Revisi / Alasan Penolakan:
                </label>
                <textarea
                  value={rejectionNote}
                  onChange={(e) => setRejectionNote(e.target.value)}
                  placeholder="Contoh: Naskah belum menyertakan data verifikasi primer pihak dekanat. Mohon tambahkan kutipan konfirmasi dan rapikan kutipan pada alinea ketiga."
                  rows={4}
                  className="w-full p-3 text-xs sm:text-sm bg-[#F0F4F8] text-[#111827] rounded-xl border border-[#E5E7EB] focus:border-[#DC2626] focus:bg-white focus:outline-none transition-all placeholder:text-gray-400"
                  required
                  autoFocus
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() => setRejectingPost(null)}
                >
                  Batal
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  type="submit"
                  disabled={!rejectionNote.trim()}
                  className="bg-[#DC2626] text-white hover:bg-red-700"
                >
                  Kirim Catatan & Tolak Naskah
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
