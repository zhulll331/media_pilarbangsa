"use client";

import React from "react";
import { usePortal } from "@/context/portal-context";
import { TopUtilityBar } from "@/components/public/top-utility-bar";
import { Header } from "@/components/public/header";
import { Navbar } from "@/components/public/navbar";
import { HeroSection } from "@/components/public/hero-section";
import { BentoGrid } from "@/components/public/bento-grid";
import { CategoryFeed } from "@/components/public/category-feed";
import { NewsletterBanner } from "@/components/public/newsletter-banner";
import { Footer } from "@/components/public/footer";

export default function HomePage() {
  const { posts, categories } = usePortal();

  const publishedPosts = posts.filter((p) => p.status === "published");

  // Featured post (first or marked as featured)
  const featuredPost =
    publishedPosts.find((p) => p.isFeatured) || publishedPosts[0];

  // Popular posts sorted by viewCount
  const popularPosts = [...publishedPosts].sort(
    (a, b) => b.viewCount - a.viewCount
  );

  // Editor's choice for Bento Grid
  const editorChoicePosts = publishedPosts.filter(
    (p) => p.id !== featuredPost?.id
  );

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* 1. Top Utility Bar */}
      <TopUtilityBar />

      {/* 2. Main Header */}
      <Header />

      {/* 3. Navigation Bar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* 4. 8+4 Asymmetric Hero Grid & Terpopuler Sidebar */}
        {featuredPost && (
          <HeroSection
            featuredPost={featuredPost}
            popularPosts={popularPosts}
          />
        )}

        {/* 5. Bento Grid "Don't Miss" / Pilihan Redaksi */}
        <BentoGrid posts={editorChoicePosts} />

        {/* 6. Curated Category & Latest Feeds */}
        <CategoryFeed categories={categories} posts={publishedPosts} />

        {/* 7. Newsletter Banner */}
        <NewsletterBanner />
      </main>

      {/* 8. Global Footer */}
      <Footer />
    </div>
  );
}
