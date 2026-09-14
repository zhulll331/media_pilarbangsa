"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePortal } from "@/context/portal-context";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import {
  MessageSquare,
  Eye,
  EyeOff,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

export default function AdminCommentsPage() {
  const { comments, moderateComment, deleteComment, posts } = usePortal();
  const [filterStatus, setFilterStatus] = useState<"all" | "visible" | "hidden" | "flagged">("all");

  // Flatten comments including replies
  const allComments = comments.flatMap((c) => [c, ...(c.replies || [])]);

  const filteredComments = allComments.filter((c) => {
    if (filterStatus === "all") return true;
    return c.status === filterStatus;
  });

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
            Moderasi Komentar Pembaca ({allComments.length})
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280]">
            Pantau dan tindak komentar yang melanggar etika dialektika kampus (§3.4 PRD)
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {[
          { id: "all", label: "Semua Komentar" },
          { id: "visible", label: "Tayang Aktif" },
          { id: "hidden", label: "Disembunyikan" },
          { id: "flagged", label: "Ditandai Spam" },
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

      {/* Comments Moderation List */}
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
            filteredComments.map((comment) => {
              const relatedPost = posts.find((p) => p.id === comment.postId);

              return (
                <div
                  key={comment.id}
                  className={`p-5 flex flex-col sm:flex-row items-start justify-between gap-4 hover:bg-[#F0F4F8]/40 transition-colors ${
                    comment.status === "hidden"
                      ? "opacity-60 bg-gray-50"
                      : comment.status === "flagged"
                      ? "bg-amber-50/50"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <Avatar
                      src={comment.userAvatar}
                      name={comment.userName}
                      size="md"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-bold text-sm text-[#111827]">
                          {comment.userName}
                        </span>
                        <span className="text-xs text-[#6B7280]">
                          • {formatDate(comment.createdAt)}
                        </span>
                        {comment.parentId && (
                          <span className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                            Balasan
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            comment.status === "visible"
                              ? "bg-emerald-100 text-[#059669]"
                              : comment.status === "hidden"
                              ? "bg-gray-200 text-gray-700"
                              : "bg-amber-100 text-[#D97706]"
                          }`}
                        >
                          {comment.status.toUpperCase()}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-[#111827] leading-relaxed mb-2">
                        {comment.content}
                      </p>

                      {relatedPost && (
                        <div className="text-xs text-[#6B7280] flex items-center gap-1.5">
                          <span>Pada naskah:</span>
                          <Link
                            href={`/artikel/${relatedPost.slug}`}
                            className="font-medium text-[#005AE0] hover:underline truncate max-w-sm"
                          >
                            {relatedPost.title}
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {comment.status === "visible" ? (
                      <button
                        onClick={() => moderateComment(comment.id, "hidden")}
                        className="px-2.5 py-1.5 rounded-lg border border-[#E5E7EB] hover:bg-gray-100 text-xs font-semibold text-gray-700 transition-colors inline-flex items-center gap-1 cursor-pointer"
                        title="Sembunyikan dari publik"
                      >
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Sembunyikan</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => moderateComment(comment.id, "visible")}
                        className="px-2.5 py-1.5 rounded-lg border border-[#059669] hover:bg-emerald-50 text-xs font-semibold text-[#059669] transition-colors inline-flex items-center gap-1 cursor-pointer"
                        title="Tampilkan kembali ke publik"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Pulihkan</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (confirm("Hapus komentar ini secara permanen?")) {
                          deleteComment(comment.id);
                        }
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                      title="Hapus Komentar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
