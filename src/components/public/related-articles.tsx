import React from "react";
import Link from "next/link";
import { Post } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import { BookOpen } from "lucide-react";

interface RelatedArticlesProps {
  currentPostId: string;
  categoryId: string;
  posts: Post[];
}

export function RelatedArticles({ currentPostId, categoryId, posts }: RelatedArticlesProps) {
  // Find related posts in same category or any published post excluding current
  const related = posts
    .filter((p) => p.id !== currentPostId && p.status === "published")
    .sort((a, b) => (a.categoryId === categoryId ? -1 : 1))
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <aside className="sticky top-20 bg-[#F0F4F8] border border-[#E5E7EB] rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#E5E7EB]">
        <BookOpen className="w-4 h-4 text-[#005AE0]" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#111827]">
          Tulisan Terkait
        </h3>
      </div>

      <div className="space-y-4 divide-y divide-[#E5E7EB]">
        {related.map((post, idx) => (
          <Link
            key={post.id}
            href={`/artikel/${post.slug}`}
            className={`group flex items-start gap-3 ${idx > 0 ? "pt-4" : ""}`}
          >
            <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-200">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-[#005AE0] uppercase tracking-wider block mb-1">
                {post.category.name}
              </span>
              <h4 className="text-xs font-semibold text-[#111827] group-hover:text-[#005AE0] transition-colors line-clamp-2 leading-snug">
                {post.title}
              </h4>
              <span className="text-[11px] text-[#6B7280] block mt-1">
                {post.publishedAt ? formatDate(post.publishedAt) : ""}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}
