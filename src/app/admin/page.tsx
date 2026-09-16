"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { usePortal } from "@/context/portal-context";
import { approvePost, rejectPost } from "@/actions/posts";
import type { Post } from "@/lib/types";
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
  Loader2,
} from "lucide-react";

export default function AdminReviewQueuePage() {
  const { showToast } = usePortal();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewPost, setPreviewPost] = useState<Post | null>(null);
  const [rejectingPost, setRejectingPost] = useState<Post | null>(null);
  const [rejectionNote, setRejectionNote] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchPendingPosts = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("posts")
      .select(`
        id, title, slug, excerpt, content, cover_image_url, status,
        published_at, created_at, updated_at, view_count, rejection_note,
        author_id, author:profiles(id, full_name, avatar_url),
        category_id, category:categories(id, name, slug)
      `)
      .eq("status", "pending_review")
      .order("created_at", { ascending: false });

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
            id: p.author?.id || p.author_id,
            name: p.author?.full_name || "Penulis UNTAG",
            avatar: p.author?.avatar_url || null,
            email: "",
          },
          categoryId: p.category_id,
          category: p.category || { id: "", name: "Umum", slug: "umum" },
          tags: [],
          status: "pending" as const,
          publishedAt: p.published_at,
          createdAt: p.created_at,
          updatedAt: p.updated_at,
          viewCount: p.view_count || 0,
          rejectionNote: p.rejection_note,
        }))
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPendingPosts();
  }, [fetchPendingPosts]);

  const handleApprove = async (postId: string) => {
    setActionLoading(postId);
    const result = await approvePost(postId);
    if (result?.error) {
      showToast(result.error, "error");
    } else {
      showToast("Naskah telah disetujui & langsung tayang di portal!", "success");
      if (previewPost?.id === postId) setPreviewPost(null);
      await fetchPendingPosts();
    }
    setActionLoading(null);
  };

  const handleConfirmReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingPost || !rejectionNote.trim()) {
      showToast("Alasan penolakan / catatan revisi wajib diisi.", "warning");
      return;
    }

    setActionLoading(rejectingPost.id);
    const result = await rejectPost(rejectingPost.id, rejectionNote.trim());
    if (result?.error) {
      showToast(result.error, "error");
    } else {
      showToast("Naskah ditolak dengan catatan revisi untuk penulis.", "warning");
      if (previewPost?.id === rejectingPost.id) setPreviewPost(null);
      setRejectingPost(null);
      setRejectionNote("");
      await fetchPendingPosts();
    }
    setActionLoading(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-[#005AE0]" />
      </div>
    );
  }

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
            Antrean Review Naskah ({posts.length})
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280]">
            Tinjau kelayakan publikasi karya mahasiswa, orisinalitas, dan etika penulisan sebelum terbit
          </p>
        </div>
      </div>

      {/* Pending Queue Table */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
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
              {posts.length === 0 ? (
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
                posts.map((post) => (
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
                        <button
                          onClick={() => setPreviewPost(post)}
                          className="px-3 py-1.5 rounded-full border border-[#E5E7EB] text-[#111827] hover:border-[#005AE0] hover:text-[#005AE0] font-semibold text-xs transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Baca</span>
                        </button>

                        <button
                          onClick={() => handleApprove(post.id)}
                          disabled={actionLoading === post.id}
                          className="px-3 py-1.5 rounded-full bg-[#059669] hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1 disabled:opacity-60"
                        >
                          {actionLoading === post.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          )}
                          <span>Approve</span>
                        </button>

                        <button
                          onClick={() => {
                            setRejectingPost(post);
                            setRejectionNote("");
                          }}
                          className="px-3 py-1.5 rounded-full border border-[#DC2626] text-[#DC2626] hover:bg-red-50 font-semibold text-xs transition-colors cursor-pointer inline-flex items-center gap-1"
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

        {/* Mobile Card List View */}
        <div className="block md:hidden divide-y divide-[#E5E7EB]">
          {posts.length === 0 ? (
            <div className="py-12 px-4 text-center text-[#6B7280]">
              <CheckCircle2 className="w-10 h-10 text-[#059669] mx-auto mb-2 opacity-80" />
              <p className="text-sm font-semibold text-[#111827]">
                Semua antrean telah ditinjau!
              </p>
              <p className="text-xs text-[#6B7280]">
                Tidak ada naskah baru yang menunggu keputusan kurasi saat ini.
              </p>
            </div>
          ) : (
            posts.map((post) => (
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
                    <BadgeStatus status="pending" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-[#6B7280]">
                  <div className="flex items-center gap-2">
                    <Avatar src={post.author.avatar} name={post.author.name} size="sm" />
                    <span className="font-semibold text-[#111827]">{post.author.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 font-medium">
                      {post.category.name}
                    </span>
                    <span>•</span>
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => setPreviewPost(post)}
                    className="px-3 py-1.5 rounded-full border border-[#E5E7EB] text-[#111827] hover:border-[#005AE0] hover:text-[#005AE0] font-semibold text-xs transition-colors cursor-pointer inline-flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Baca</span>
                  </button>

                  <button
                    onClick={() => {
                      setRejectingPost(post);
                      setRejectionNote("");
                    }}
                    className="px-3 py-1.5 rounded-full border border-[#DC2626] text-[#DC2626] hover:bg-red-50 font-semibold text-xs transition-colors cursor-pointer inline-flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>

                  <button
                    onClick={() => handleApprove(post.id)}
                    disabled={actionLoading === post.id}
                    className="px-3 py-1.5 rounded-full bg-[#059669] hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1 disabled:opacity-60"
                  >
                    {actionLoading === post.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                    <span>Approve</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL 1: Full Article Preview */}
      {previewPost && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F0F4F8]">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-white shadow-2xs text-[#005AE0]">
                  <FileText className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-[#111827]">Tinjauan Naskah Kurasi</h3>
                  <span className="text-xs text-[#6B7280]">
                    Diajukan oleh {previewPost.author.name} • {previewPost.category.name}
                  </span>
                </div>
              </div>
              <button onClick={() => setPreviewPost(null)} className="p-1.5 text-gray-400 hover:text-black rounded-full cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-sm text-[#111827] leading-relaxed">
              <h2 className="text-2xl font-bold tracking-tight">{previewPost.title}</h2>
              {previewPost.excerpt && (
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs italic text-gray-700">
                  <strong>Excerpt:</strong> {previewPost.excerpt}
                </div>
              )}
              {previewPost.coverImage && (
                <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-gray-100">
                  <img src={previewPost.coverImage} alt={previewPost.title} className="w-full h-full object-cover" />
                </div>
              )}
              {/<[a-z][\s\S]*>/i.test(previewPost.content) ? (
                <div className="tiptap ProseMirror text-sm leading-loose text-gray-800" dangerouslySetInnerHTML={{ __html: previewPost.content }} />
              ) : (
                <div className="space-y-4 whitespace-pre-line text-sm leading-loose text-gray-800">{previewPost.content}</div>
              )}
            </div>

            <div className="p-4 sm:p-6 border-t border-[#E5E7EB] bg-gray-50 flex items-center justify-between gap-3">
              <span className="text-xs text-[#6B7280]">Status: <strong>Menunggu Persetujuan</strong></span>
              <div className="flex items-center gap-3">
                <Button variant="danger" size="sm" onClick={() => { setRejectingPost(previewPost); setRejectionNote(""); }} className="gap-1.5">
                  <XCircle className="w-4 h-4" />
                  <span>Tolak & Minta Revisi</span>
                </Button>
                <Button variant="primary" size="sm" onClick={() => handleApprove(previewPost.id)} className="bg-[#059669] hover:bg-emerald-700 gap-1.5" disabled={actionLoading === previewPost.id}>
                  {actionLoading === previewPost.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>Approve & Publikasikan</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Rejection Note Modal */}
      {rejectingPost && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between bg-red-50">
              <div className="flex items-center gap-2 text-[#DC2626]">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-sm font-bold">Catatan Revisi Wajib</h3>
              </div>
              <button onClick={() => setRejectingPost(null)} className="p-1 text-gray-400 hover:text-black cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmReject} className="p-6 space-y-4">
              <p className="text-xs text-gray-700 leading-relaxed">
                Anda akan menolak naskah <strong>&quot;{rejectingPost.title}&quot;</strong> karya <strong>{rejectingPost.author.name}</strong>. Jelaskan bagian yang perlu direvisi:
              </p>
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1">
                  Catatan Revisi / Alasan Penolakan:
                </label>
                <textarea
                  value={rejectionNote}
                  onChange={(e) => setRejectionNote(e.target.value)}
                  placeholder="Contoh: Naskah belum menyertakan data verifikasi primer. Mohon tambahkan kutipan konfirmasi..."
                  rows={4}
                  className="w-full p-3 text-xs sm:text-sm bg-[#F0F4F8] text-[#111827] rounded-xl border border-[#E5E7EB] focus:border-[#DC2626] focus:bg-white focus:outline-none transition-all placeholder:text-gray-400"
                  required
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" size="sm" type="button" onClick={() => setRejectingPost(null)}>
                  Batal
                </Button>
                <Button variant="danger" size="sm" type="submit" disabled={!rejectionNote.trim() || actionLoading === rejectingPost.id} className="bg-[#DC2626] text-white hover:bg-red-700">
                  {actionLoading === rejectingPost.id ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
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
