"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePortal } from "@/context/portal-context";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { MessageSquare, Reply, CornerDownRight, LogIn, AlertCircle } from "lucide-react";

interface CommentsSectionProps {
  postId: string;
}

export function CommentsSection({ postId }: CommentsSectionProps) {
  const { comments, addComment, currentRole, currentUser, showToast } = usePortal();
  const [newComment, setNewComment] = useState("");
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const postComments = comments.filter((c) => c.postId === postId && c.status === "visible");
  const totalCount = postComments.reduce(
    (acc, c) => acc + 1 + (c.replies ? c.replies.filter((r) => r.status === "visible").length : 0),
    0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (currentRole === "guest") {
      showToast("Anda harus masuk (login) terlebih dahulu untuk mengirim komentar.", "warning");
      return;
    }

    addComment(postId, newComment.trim());
    setNewComment("");
  };

  const handleReplySubmit = (parentId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    if (currentRole === "guest") {
      showToast("Anda harus masuk (login) terlebih dahulu untuk membalas komentar.", "warning");
      return;
    }

    addComment(postId, replyContent.trim(), parentId);
    setReplyContent("");
    setReplyToId(null);
  };

  return (
    <section id="komentar" className="pt-10 mt-12 border-t border-[#E5E7EB]">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2.5">
          <MessageSquare className="w-5 h-5 text-[#005AE0]" />
          <h3 className="text-xl font-bold text-[#111827] tracking-tight">
            Komentar Pembaca ({totalCount})
          </h3>
        </div>
        <span className="text-xs text-[#6B7280]">
          Moderasi aktif • Taati etika dialektika kampus
        </span>
      </div>

      {/* Main Comment Input Form */}
      <div className="bg-[#F0F4F8] border border-[#E5E7EB] rounded-2xl p-4 sm:p-6 mb-10">
        {currentRole === "guest" ? (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 bg-white rounded-xl border border-blue-100">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-50 text-[#005AE0]">
                <AlertCircle className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm text-[#111827]">
                <span className="font-semibold">Sesuai ketentuan Redaksi & Komunitas (§3.4 PRD):</span> Pembaca wajib masuk untuk berkomentar guna mencegah spam.
              </p>
            </div>
            <Link href="/login" className="shrink-0">
              <Button variant="primary" size="sm" className="gap-1.5">
                <LogIn className="w-4 h-4" />
                <span>Masuk Sekarang</span>
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex items-start gap-3 mb-3">
              <Avatar src={currentUser?.avatar} name={currentUser?.name} size="md" />
              <div className="flex-1">
                <span className="text-xs font-semibold text-[#111827] block mb-1">
                  Komentari sebagai: {currentUser?.name} ({currentUser?.role.toUpperCase()})
                </span>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Tuliskan tanggapan, sanggahan, atau pandangan kritis Anda terhadap artikel ini..."
                  rows={3}
                  className="w-full p-3 text-sm bg-white rounded-xl border border-[#E5E7EB] focus:border-[#005AE0] focus:outline-none focus:ring-2 focus:ring-[#005AE0]/20 transition-all placeholder:text-[#6B7280]"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-[#6B7280]">
                Maksimal 1.000 karakter • Beretika & bebas SARA
              </span>
              <Button variant="primary" size="sm" type="submit" disabled={!newComment.trim()}>
                Kirim Komentar
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Comment List */}
      <div className="space-y-6 divide-y divide-[#E5E7EB]">
        {postComments.length === 0 ? (
          <div className="text-center py-10 text-sm text-[#6B7280]">
            Belum ada komentar untuk tulisan ini. Jadilah yang pertama memberikan pandangan!
          </div>
        ) : (
          postComments.map((comment) => (
            <div key={comment.id} className="pt-6 first:pt-0">
              {/* Top Level Comment */}
              <div className="flex items-start gap-3.5">
                <Avatar src={comment.userAvatar} name={comment.userName} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-sm font-bold text-[#111827]">
                      {comment.userName}
                    </span>
                    <span className="text-xs text-[#6B7280]">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>

                  <p className="text-sm text-[#111827] leading-relaxed mb-2.5">
                    {comment.content}
                  </p>

                  <button
                    onClick={() => {
                      if (replyToId === comment.id) {
                        setReplyToId(null);
                      } else {
                        setReplyToId(comment.id);
                        setReplyContent("");
                      }
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#005AE0] hover:text-[#003c94] transition-colors cursor-pointer py-1"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    <span>{replyToId === comment.id ? "Batal Balas" : "Balas"}</span>
                  </button>

                  {/* Reply Form */}
                  {replyToId === comment.id && (
                    <form
                      onSubmit={(e) => handleReplySubmit(comment.id, e)}
                      className="mt-3 pl-3 border-l-2 border-[#005AE0] bg-gray-50 p-3 rounded-r-xl"
                    >
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder={`Balas komentar ${comment.userName}...`}
                        rows={2}
                        className="w-full p-2.5 text-xs sm:text-sm bg-white rounded-lg border border-[#E5E7EB] focus:border-[#005AE0] focus:outline-none transition-all mb-2"
                        required
                        autoFocus
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          type="button"
                          onClick={() => setReplyToId(null)}
                        >
                          Batal
                        </Button>
                        <Button variant="primary" size="sm" type="submit">
                          Kirim Balasan
                        </Button>
                      </div>
                    </form>
                  )}

                  {/* 1-Level Nested Replies (indent: spacing.xl / 32px) */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 pl-6 sm:pl-8 space-y-3.5 border-l-2 border-[#E5E7EB]">
                      {comment.replies
                        .filter((r) => r.status === "visible")
                        .map((reply) => (
                          <div key={reply.id} className="flex items-start gap-3">
                            <CornerDownRight className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
                            <Avatar src={reply.userAvatar} name={reply.userName} size="sm" />
                            <div className="flex-1 min-w-0 bg-gray-50 p-3 rounded-xl border border-[#E5E7EB]">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <span className="text-xs font-bold text-[#111827]">
                                  {reply.userName}
                                </span>
                                <span className="text-[11px] text-[#6B7280]">
                                  {formatDate(reply.createdAt)}
                                </span>
                              </div>
                              <p className="text-xs sm:text-sm text-[#111827] leading-relaxed">
                                {reply.content}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
