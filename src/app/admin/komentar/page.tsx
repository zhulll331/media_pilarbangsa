"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { usePortal } from "@/context/portal-context";
import { hideComment, deleteComment as deleteCommentAction } from "@/actions/comments";
import { Avatar } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import {
  MessageSquare,
  Eye,
  EyeOff,
  Trash2,
  CheckCircle2,
  Loader2,
} from "lucide-react";

interface CommentRow {
  id: string;
  post_id: string;
  user_id: string | null;
  parent_id: string | null;
  content: string;
  status: "visible" | "hidden";
  created_at: string;
  user: { full_name: string | null; avatar_url: string | null } | null;
  post: { title: string; slug: string } | null;
}

export default function AdminCommentsPage() {
  const { showToast } = usePortal();
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"all" | "visible" | "hidden">("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("comments")
      .select(`
        id, post_id, user_id, parent_id, content, status, created_at,
        user:profiles(full_name, avatar_url),
        post:posts(title, slug)
      `)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setComments(data as any);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleHide = async (commentId: string) => {
    setActionLoading(commentId);
    const result = await hideComment(commentId);
    if (result?.error) {
      showToast(result.error, "error");
    } else {
      showToast("Komentar disembunyikan dari publik.", "info");
      await fetchComments();
    }
    setActionLoading(null);
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("Hapus komentar ini secara permanen?")) return;
    setActionLoading(commentId);
    const result = await deleteCommentAction(commentId);
    if (result?.error) {
      showToast(result.error, "error");
    } else {
      showToast("Komentar telah dihapus.", "warning");
      await fetchComments();
    }
    setActionLoading(null);
  };

  const filteredComments = comments.filter((c) => {
    if (filterStatus === "all") return true;
    return c.status === filterStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-[#005AE0]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-blue-100 text-[#005AE0]">
              <MessageSquare className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#005AE0]">
              Pengawasan Diskusi
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">
            Moderasi Komentar Pembaca ({comments.length})
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280]">
            Pantau dan tindak komentar yang melanggar etika dialektika kampus
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {[
          { id: "all", label: "Semua Komentar" },
          { id: "visible", label: "Tayang Aktif" },
          { id: "hidden", label: "Disembunyikan" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id as any)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filterStatus === tab.id
                ? "bg-[#005AE0] text-white shadow-xs"
                : "bg-[#F0F4F8] text-[#6B7280] hover:text-[#111827]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Comments List */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
        <div className="divide-y divide-[#E5E7EB]">
          {filteredComments.length === 0 ? (
            <div className="py-16 text-center text-[#6B7280]">
              <CheckCircle2 className="w-10 h-10 text-[#059669] mx-auto mb-2 opacity-80" />
              <p className="text-sm font-semibold text-[#111827]">
                Tidak ada komentar dalam status ini.
              </p>
            </div>
          ) : (
            filteredComments.map((comment) => (
              <div
                key={comment.id}
                className={`p-5 flex flex-col sm:flex-row items-start justify-between gap-4 hover:bg-[#F0F4F8]/40 transition-colors ${
                  comment.status === "hidden" ? "opacity-60 bg-gray-50" : ""
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <Avatar
                    src={comment.user?.avatar_url ?? undefined}
                    name={comment.user?.full_name ?? "Anonim"}
                    size="md"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-[#111827]">
                        {comment.user?.full_name ?? "Anonim"}
                      </span>
                      <span className="text-xs text-[#6B7280]">
                        • {formatDate(comment.created_at)}
                      </span>
                      {comment.parent_id && (
                        <span className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                          Balasan
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          comment.status === "visible"
                            ? "bg-emerald-100 text-[#059669]"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {comment.status.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#111827] leading-relaxed mb-2">
                      {comment.content}
                    </p>

                    {comment.post && (
                      <div className="text-xs text-[#6B7280] flex items-center gap-1.5">
                        <span>Pada naskah:</span>
                        <Link
                          href={`/artikel/${comment.post.slug}`}
                          className="font-medium text-[#005AE0] hover:underline truncate max-w-sm"
                        >
                          {comment.post.title}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {comment.status === "visible" ? (
                    <button
                      onClick={() => handleHide(comment.id)}
                      disabled={actionLoading === comment.id}
                      className="px-2.5 py-1.5 rounded-lg border border-[#E5E7EB] hover:bg-gray-100 text-xs font-semibold text-gray-700 transition-colors inline-flex items-center gap-1 cursor-pointer disabled:opacity-60"
                    >
                      {actionLoading === comment.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5" />
                      )}
                      <span>Sembunyikan</span>
                    </button>
                  ) : (
                    <span className="px-2.5 py-1.5 text-xs text-gray-400 italic">Tersembunyi</span>
                  )}

                  <button
                    onClick={() => handleDelete(comment.id)}
                    disabled={actionLoading === comment.id}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-60"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
