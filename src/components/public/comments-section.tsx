"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { usePortal } from "@/context/portal-context";
import { addComment } from "@/actions/comments";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import {
  MessageSquare,
  Reply,
  CornerDownRight,
  LogIn,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface CommentItem {
  id: string;
  postId: string;
  parentId: string | null;
  content: string;
  userName: string;
  userAvatar: string | null;
  createdAt: string;
  replies?: CommentItem[];
}

interface CommentsSectionProps {
  postId: string;
}

export function CommentsSection({ postId }: CommentsSectionProps) {
  const { user, profile, showToast } = usePortal();
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("comments")
      .select(`
        id, post_id, parent_id, content, status, created_at,
        author:profiles(id, full_name, avatar_url)
      `)
      .eq("post_id", postId)
      .eq("status", "visible")
      .order("created_at", { ascending: true });

    if (!error && data) {
      // Map to items
      const rawList: CommentItem[] = data.map((c: any) => ({
        id: c.id,
        postId: c.post_id,
        parentId: c.parent_id,
        content: c.content,
        userName: c.author?.full_name || "Pembaca",
        userAvatar: c.author?.avatar_url || null,
        createdAt: c.created_at,
        replies: [],
      }));

      // Group parent and child
      const parents: CommentItem[] = [];
      const parentMap = new Map<string, CommentItem>();

      rawList.forEach((c) => {
        if (!c.parentId) {
          parents.push(c);
          parentMap.set(c.id, c);
        }
      });

      rawList.forEach((c) => {
        if (c.parentId) {
          const p = parentMap.get(c.parentId);
          if (p) {
            p.replies = p.replies || [];
            p.replies.push(c);
          } else {
            parents.push(c);
          }
        }
      });

      setComments(parents);
    }
    setLoading(false);
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const totalCount = comments.reduce(
    (acc, c) => acc + 1 + (c.replies ? c.replies.length : 0),
    0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!user) {
      showToast("Anda harus masuk terlebih dahulu untuk mengirim komentar.", "warning");
      return;
    }

    setIsSubmitting(true);
    const res = await addComment(postId, newComment.trim());
    setIsSubmitting(false);

    if (res?.error) {
      showToast(res.error, "error");
    } else {
      showToast("Komentar Anda berhasil dikirim!", "success");
      setNewComment("");
      fetchComments();
    }
  };

  const handleReplySubmit = async (parentId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    if (!user) {
      showToast("Anda harus masuk terlebih dahulu untuk membalas komentar.", "warning");
      return;
    }

    setIsSubmitting(true);
    const res = await addComment(postId, replyContent.trim(), parentId);
    setIsSubmitting(false);

    if (res?.error) {
      showToast(res.error, "error");
    } else {
      showToast("Balasan komentar berhasil dikirim!", "success");
      setReplyContent("");
      setReplyToId(null);
      fetchComments();
    }
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

      {/* Comment Form */}
      <div className="bg-[#F0F4F8] border border-[#E5E7EB] rounded-2xl p-4 sm:p-6 mb-10">
        {!user ? (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 bg-white rounded-xl border border-blue-100">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-50 text-[#005AE0]">
                <AlertCircle className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm text-[#111827]">
                <span className="font-semibold">Ketentuan Redaksi:</span> Pembaca wajib masuk akun untuk berkomentar guna mencegah spam.
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
              <Avatar
                src={profile?.avatar_url}
                name={profile?.full_name || user.email || "Pengguna"}
                size="md"
              />
              <div className="flex-1">
                <span className="text-xs font-semibold text-[#111827] block mb-1">
                  Komentari sebagai: {profile?.full_name || user.email}
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
              <Button
                variant="primary"
                size="sm"
                type="submit"
                disabled={isSubmitting || !newComment.trim()}
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-1" />
                ) : null}
                <span>Kirim Komentar</span>
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Comment List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-[#005AE0]" />
        </div>
      ) : (
        <div className="space-y-6 divide-y divide-[#E5E7EB]">
          {comments.length === 0 ? (
            <div className="text-center py-10 text-sm text-[#6B7280]">
              Belum ada komentar untuk tulisan ini. Jadilah yang pertama memberikan pandangan!
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="pt-6 first:pt-0">
                <div className="flex items-start gap-3.5">
                  <Avatar
                    src={comment.userAvatar}
                    name={comment.userName}
                    size="md"
                  />
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

                    {user && (
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
                    )}

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
                          <Button
                            variant="primary"
                            size="sm"
                            type="submit"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                            ) : null}
                            <span>Kirim Balasan</span>
                          </Button>
                        </div>
                      </form>
                    )}

                    {/* Nested Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-4 pl-6 sm:pl-8 space-y-3.5 border-l-2 border-[#E5E7EB]">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex items-start gap-3">
                            <CornerDownRight className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
                            <Avatar
                              src={reply.userAvatar}
                              name={reply.userName}
                              size="sm"
                            />
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
      )}
    </section>
  );
}
