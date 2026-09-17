import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata, ResolvingMetadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { TopUtilityBar } from "@/components/public/top-utility-bar";
import { Header } from "@/components/public/header";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { CategoryBadge } from "@/components/ui/badge";
import { TagChip } from "@/components/ui/tag-chip";
import { formatDate, formatNumber } from "@/lib/utils";
import { ChevronRight, Eye, Layers } from "lucide-react";
import type { Post } from "@/lib/types";

export const revalidate = 300;

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: category } = await supabase
    .from("categories")
    .select("name, slug, description")
    .eq("slug", slug)
    .single();

  if (!category) {
    return {
      title: "Kategori Tidak Ditemukan — Pilar Bangsa",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.mediapilarbangsa.web.id";
  const title = `Rubrik ${category.name} — Pilar Bangsa`;
  const description =
    category.description ||
    `Kumpulan artikel, opini, dan karya literasi mahasiswa UNTAG Banyuwangi dalam rubrik ${category.name}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl}/kategori/${category.slug}`,
      siteName: "Media Karya Mahasiswa UNTAG Banyuwangi & UKM Pilar Bangsa",
      type: "website",
      locale: "id_ID",
      images: [
        {
          url: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1200",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1200"],
      site: "@ukmpilarbangsa",
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: category } = await supabase
    .from("categories")
    .select("id, name, slug, description")
    .eq("slug", slug)
    .single();

  const { data: rawPosts } = await supabase
    .from("posts")
    .select(`
      id, title, slug, excerpt, cover_image_url, published_at, view_count,
      author_id, author:profiles(id, full_name, avatar_url),
      category_id, category:categories(id, name, slug),
      post_tags(tag:tags(id, name, slug))
    `)
    .eq("status", "published")
    .eq("category.slug", slug)
    .order("published_at", { ascending: false });

  // Filter by category slug since eq on joined column may not work in all cases
  const posts: Post[] = (rawPosts || [])
    .filter((p: any) => p.category?.slug === slug)
    .map((p: any) => ({
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
      tags: (p.post_tags || []).map((pt: any) => pt.tag).filter(Boolean),
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
            <span>Kategori</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="font-semibold text-[#111827]">{category?.name || slug}</span>
          </nav>

          <div className="bg-[#F0F4F8] border border-[#E5E7EB] rounded-2xl p-6 sm:p-10 mb-10">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#005AE0] mb-2">
                <Layers className="w-4 h-4" />
                <span>Rubrik Publikasi</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold text-[#111827] tracking-tight mb-3">
                {category?.name || slug}
              </h1>
              <p className="text-sm sm:text-base text-[#6B7280] leading-relaxed">
                {category?.description || "Kumpulan karya jurnalistik dan literasi mahasiswa dalam rubrik ini."}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#111827] bg-white px-3 py-1 rounded-full border border-[#E5E7EB]">
                <span>Total {posts.length} Tulisan Terbit</span>
              </div>
            </div>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-[#E5E7EB] rounded-2xl">
              <p className="text-sm text-[#6B7280] mb-4">Belum ada tulisan yang dipublikasikan dalam kategori ini.</p>
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
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {post.tags.slice(0, 2).map((tag) => (
                          <TagChip key={tag.id} href={`/tag/${tag.slug}`}>{tag.name}</TagChip>
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-[#111827] truncate max-w-[120px]">{post.author.name}</span>
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
