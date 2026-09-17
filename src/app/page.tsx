import React from "react";
import { createClient } from "@/lib/supabase/server";
import { TopUtilityBar } from "@/components/public/top-utility-bar";
import { Header } from "@/components/public/header";
import { Navbar } from "@/components/public/navbar";
import { HeroSection } from "@/components/public/hero-section";
import { BentoGrid } from "@/components/public/bento-grid";
import { CategoryFeed } from "@/components/public/category-feed";
import { NewsletterBanner } from "@/components/public/newsletter-banner";
import { Footer } from "@/components/public/footer";
import type { Post, Category } from "@/lib/types";

export const revalidate = 300; // ISR: update tiap 5 menit

function mapPost(p: any): Post {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt || "",
    content: p.content || "",
    coverImage: p.cover_image_url || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop&q=80",
    authorId: p.author_id,
    author: {
      id: p.author?.id || p.author_id,
      name: p.author?.full_name || "Penulis UNTAG",
      avatar: p.author?.avatar_url || null,
      role: p.author?.role || "author",
      joinedAt: p.created_at,
    },
    categoryId: p.category_id,
    category: p.category || { id: "", name: "Umum", slug: "umum" },
    tags: (p.post_tags || []).map((pt: any) => pt.tag).filter(Boolean),
    status: "published" as const,
    publishedAt: p.published_at,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
    viewCount: p.view_count || 0,
    readTime: `${Math.max(1, Math.ceil((p.content?.length || 500) / 1000))} menit baca`,
  };
}

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch published posts
  const { data: rawPosts } = await supabase
    .from("posts")
    .select(`
      id, title, slug, excerpt, content, cover_image_url, status,
      published_at, created_at, updated_at, view_count,
      author_id, author:profiles(id, full_name, avatar_url, role),
      category_id, category:categories(id, name, slug),
      post_tags(tag:tags(id, name, slug))
    `)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(20);

  // Fetch categories
  const { data: rawCategories } = await supabase
    .from("categories")
    .select("id, name, slug, description")
    .order("name");

  const publishedPosts: Post[] = (rawPosts || []).map(mapPost);
  const categories: Category[] = (rawCategories || []).map((c: any) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description || "",
    count: publishedPosts.filter((p) => p.categoryId === c.id).length,
  }));

  const featuredPosts = publishedPosts.slice(0, 5);
  const popularPosts = [...publishedPosts].sort((a, b) => b.viewCount - a.viewCount);
  const editorChoicePosts = publishedPosts.filter((p) => p.id !== publishedPosts[0]?.id);

  const trendingItem = popularPosts[0]
    ? { title: popularPosts[0].title, slug: popularPosts[0].slug }
    : null;

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <TopUtilityBar initialTrending={trendingItem} />
      <Header />
      <Navbar />

      <main className="flex-1">
        {featuredPosts.length > 0 && (
          <HeroSection featuredPosts={featuredPosts} popularPosts={popularPosts} />
        )}
        <BentoGrid posts={editorChoicePosts} />
        <CategoryFeed categories={categories} posts={publishedPosts} />
        <NewsletterBanner />
      </main>

      <Footer />
    </div>
  );
}
