import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TopUtilityBar } from "@/components/public/top-utility-bar";
import { Header } from "@/components/public/header";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { CategoryBadge } from "@/components/ui/badge";
import { TagChip } from "@/components/ui/tag-chip";
import { Avatar } from "@/components/ui/avatar";
import { ShareBar } from "@/components/ui/share-bar";
import { CommentsSection } from "@/components/public/comments-section";
import { RelatedArticles } from "@/components/public/related-articles";
import { ViewCounter } from "@/components/public/view-counter";
import { formatDate, formatNumber } from "@/lib/utils";
import { ChevronRight, Clock, Eye, Calendar } from "lucide-react";
import type { Post } from "@/lib/types";

export const revalidate = 60;

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: rawPost } = await supabase
    .from("posts")
    .select(`
      id, title, slug, excerpt, content, cover_image_url, published_at, created_at, updated_at, view_count,
      author_id, author:profiles(id, full_name, avatar_url, bio, created_at, role),
      category_id, category:categories(id, name, slug),
      post_tags(tag:tags(id, name, slug))
    `)
    .eq("slug", slug)
    .single();

  if (!rawPost) {
    notFound();
  }

  const wordCount = (rawPost.content || "").replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
  const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} mnt`;

  const p = rawPost as any;
  const authorData = Array.isArray(p.author) ? p.author[0] : p.author;
  const categoryData = Array.isArray(p.category) ? p.category[0] : p.category;

  const post: Post = {
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt || "",
    content: p.content || "",
    coverImage: p.cover_image_url || "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1200",
    authorId: p.author_id,
    author: {
      id: authorData?.id || p.author_id,
      name: authorData?.full_name || "Redaksi Pilar Bangsa",
      avatar: authorData?.avatar_url || null,
      bio: authorData?.bio || null,
      role: authorData?.role || "author",
      joinedAt: authorData?.created_at || p.created_at,
    },
    categoryId: p.category_id,
    category: categoryData || { id: "", name: "Umum", slug: "umum" },
    tags: (p.post_tags || []).map((pt: any) => pt.tag).filter(Boolean),
    status: "published",
    publishedAt: p.published_at,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
    viewCount: p.view_count || 0,
    readTime,
  };

  const { data: rawRelated } = await supabase
    .from("posts")
    .select(`
      id, title, slug, excerpt, cover_image_url, published_at, view_count,
      author_id, author:profiles(id, full_name, avatar_url),
      category_id, category:categories(id, name, slug),
      post_tags(tag:tags(id, name, slug))
    `)
    .eq("status", "published")
    .neq("id", rawPost.id)
    .order("published_at", { ascending: false })
    .limit(6);

  const relatedPosts: Post[] = (rawRelated || []).map((p: any) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt || "",
    content: "",
    coverImage: p.cover_image_url || "",
    authorId: p.author_id,
    author: {
      id: p.author?.id || p.author_id,
      name: p.author?.full_name || "Penulis UNTAG",
      avatar: p.author?.avatar_url || null,
    },
    categoryId: p.category_id,
    category: p.category || { id: "", name: "Umum", slug: "umum" },
    tags: (p.post_tags || []).map((pt: any) => pt.tag).filter(Boolean),
    status: "published" as const,
    publishedAt: p.published_at,
    createdAt: p.published_at,
    updatedAt: p.published_at,
    viewCount: p.view_count || 0,
  }));

  const paragraphs = post.content.split("\n\n").filter((p) => p.trim());

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    description: post.excerpt,
    image: [post.coverImage],
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: post.author.name,
    },
    publisher: {
      "@type": "Organization",
      name: "Media Karya Mahasiswa UNTAG Banyuwangi & UKM Pilar Bangsa",
    },
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <ViewCounter postId={post.id} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TopUtilityBar />
      <Header />
      <Navbar />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-[#6B7280]">
            <Link href="/" className="hover:text-[#005AE0] transition-colors">
              Beranda
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <Link
              href={`/kategori/${post.category.slug}`}
              className="hover:text-[#005AE0] transition-colors font-medium text-[#111827]"
            >
              {post.category.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="truncate max-w-[240px] sm:max-w-md text-gray-400">
              {post.title}
            </span>
          </nav>

          {/* 12-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Main Article Column */}
            <article className="lg:col-span-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <CategoryBadge>{post.category.name}</CategoryBadge>
                <div className="flex items-center gap-3 text-xs text-[#6B7280]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {post.publishedAt ? formatDate(post.publishedAt) : "Draf"}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readTime}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 data-tabular">
                    <Eye className="w-3.5 h-3.5" />
                    {formatNumber(post.viewCount)} pembaca
                  </span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#111827] tracking-tight leading-[1.25] mb-6">
                {post.title}
              </h1>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y border-[#E5E7EB] mb-8">
                <Link
                  href={`/penulis/${post.author.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  className="flex items-center gap-3 group"
                >
                  <Avatar
                    src={post.author.avatar}
                    name={post.author.name}
                    size="md"
                    className="border-gray-200"
                  />
                  <div>
                    <span className="text-sm font-bold text-[#111827] group-hover:text-[#005AE0] transition-colors block leading-tight">
                      {post.author.name}
                    </span>
                    <span className="text-xs text-[#6B7280]">
                      {post.author.role === "admin"
                        ? "Editor / Redaksi UKM Pilar Bangsa"
                        : "Penulis Mahasiswa UNTAG Banyuwangi"}
                    </span>
                  </div>
                </Link>

                <ShareBar title={post.title} />
              </div>

              {/* Cover Image */}
              <div className="rounded-2xl overflow-hidden mb-8 shadow-xs border border-[#E5E7EB] bg-gray-100">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full aspect-16/10 object-cover"
                />
                <div className="p-3 bg-[#F0F4F8] text-xs text-[#6B7280] italic">
                  Foto dokumentasi liputan UKM Pilar Bangsa / Ilustrasi Editorial
                </div>
              </div>

              {/* Article Content */}
              {/<[a-z][\s\S]*>/i.test(post.content) ? (
                <div
                  className="max-w-[65ch] drop-cap text-[#111827] text-base sm:text-[17px] leading-[1.8] tiptap ProseMirror"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              ) : (
                <div className="max-w-[65ch] drop-cap text-[#111827] text-base leading-[1.75] space-y-6">
                  {paragraphs.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>
              )}

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-10 pt-6 border-t border-[#E5E7EB]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280] block mb-2.5">
                    Topik Terkait:
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {post.tags.map((tag) => (
                      <TagChip key={tag.id} href={`/tag/${tag.slug}`}>
                        {tag.name}
                      </TagChip>
                    ))}
                  </div>
                </div>
              )}

              {/* Share Box */}
              <div className="mt-6 p-4 rounded-xl bg-[#F0F4F8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs font-semibold text-[#111827]">
                  Sukai tulisan ini? Bagikan kepada rekan mahasiswa lainnya:
                </span>
                <ShareBar title={post.title} />
              </div>

              {/* Author Box */}
              <div className="mt-10 p-6 rounded-2xl border border-[#E5E7EB] bg-white flex flex-col sm:flex-row items-start gap-4">
                <Avatar
                  src={post.author.avatar}
                  name={post.author.name}
                  size="lg"
                  className="shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#005AE0]">
                      Tentang Penulis
                    </span>
                    {post.author.joinedAt && (
                      <>
                        <span className="text-gray-300">•</span>
                        <span className="text-xs text-[#6B7280]">
                          Bergabung sejak {formatDate(post.author.joinedAt)}
                        </span>
                      </>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-[#111827] mb-1.5">
                    {post.author.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed mb-3">
                    {post.author.bio ||
                      "Penulis & Kontributor Mahasiswa Universitas 17 Agustus 1945 Banyuwangi • Media Karya Mahasiswa & UKM Pilar Bangsa."}
                  </p>
                  <Link
                    href={`/penulis/${post.author.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                    className="text-xs font-semibold text-[#005AE0] hover:underline inline-flex items-center gap-1"
                  >
                    <span>Lihat Semua Tulisan Penulis</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Comments */}
              <CommentsSection postId={post.id} />
            </article>

            {/* Sidebar */}
            <div className="lg:col-span-4 w-full">
              <RelatedArticles
                currentPostId={post.id}
                categoryId={post.categoryId}
                posts={relatedPosts}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
