import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { TopUtilityBar } from "@/components/public/top-utility-bar";
import { Header } from "@/components/public/header";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { CategoryBadge } from "@/components/ui/badge";
import { formatDate, formatNumber } from "@/lib/utils";
import { ChevronRight, Eye, Hash } from "lucide-react";
import type { Post } from "@/lib/types";

export const revalidate = 300;

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: tag } = await supabase
    .from("tags")
    .select("id, name, slug")
    .eq("slug", slug)
    .single();

  const { data: postTagRows } = await supabase
    .from("post_tags")
    .select(`
      post:posts(
        id, title, slug, excerpt, cover_image_url, published_at, view_count,
        author_id, author:profiles(id, full_name, avatar_url),
        category_id, category:categories(id, name, slug)
      )
    `)
    .eq("tag.slug", slug);

  // Also try direct join approach
  const { data: rawPosts } = await supabase
    .from("posts")
    .select(`
      id, title, slug, excerpt, cover_image_url, published_at, view_count,
      author_id, author:profiles(id, full_name, avatar_url),
      category_id, category:categories(id, name, slug),
      post_tags!inner(tag_id, tag:tags!inner(id, name, slug))
    `)
    .eq("status", "published")
    .eq("post_tags.tag.slug", slug)
    .order("published_at", { ascending: false });

  const posts: Post[] = (rawPosts || []).map((p: any) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt || "",
    content: "",
    coverImage: p.cover_image_url || "",
    authorId: p.author_id,
    author: { id: p.author?.id || p.author_id, name: p.author?.full_name || "Penulis UNTAG", avatar: p.author?.avatar_url || null },
    categoryId: p.category_id,
    category: p.category || { id: "", name: "Umum", slug: "umum" },
    tags: [],
    status: "published" as const,
    publishedAt: p.published_at,
    createdAt: p.published_at,
    updatedAt: p.published_at,
    viewCount: p.view_count || 0,
  }));

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <TopUtilityBar />
      <Header />
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-[#6B7280]">
            <Link href="/" className="hover:text-[#005AE0] transition-colors">Beranda</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span>Tagar</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="font-semibold text-[#111827]">#{slug}</span>
          </nav>

          <div className="bg-[#F0F4F8] border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 mb-10">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="p-2 rounded-xl bg-blue-100 text-[#005AE0]">
                <Hash className="w-5 h-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight">
                {tag ? tag.name : `#${slug}`}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#6B7280]">
              Menampilkan {posts.length} tulisan yang ditandai dengan topik ini.
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-[#E5E7EB] rounded-2xl">
              <p className="text-sm text-[#6B7280] mb-4">Tidak ada tulisan aktif dengan tagar ini.</p>
              <Link href="/" className="text-xs font-semibold text-[#005AE0] hover:underline">Kembali ke Beranda</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <article key={post.id} className="group bg-white rounded-xl border border-[#E5E7EB] overflow-hidden hover:border-[#005AE0] hover:shadow-md transition-all duration-300 flex flex-col">
                  <Link href={`/artikel/${post.slug}`} className="relative aspect-16/10 overflow-hidden bg-gray-100 block">
                    <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute top-3 left-3">
                      <CategoryBadge>{post.category.name}</CategoryBadge>
                    </div>
                  </Link>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-[#6B7280] mb-2.5">
                        <span>{post.publishedAt ? formatDate(post.publishedAt) : ""}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 data-tabular">
                          <Eye className="w-3.5 h-3.5" />{formatNumber(post.viewCount)}
                        </span>
                      </div>
                      <Link href={`/artikel/${post.slug}`}>
                        <h2 className="text-base font-bold text-[#111827] group-hover:text-[#005AE0] transition-colors line-clamp-2 leading-snug mb-2">{post.title}</h2>
                      </Link>
                      <p className="text-xs sm:text-sm text-[#6B7280] line-clamp-2 leading-relaxed mb-4">{post.excerpt}</p>
                    </div>
                    <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between gap-2 mt-auto">
                      <span className="text-xs font-semibold text-[#111827]">{post.author.name}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
