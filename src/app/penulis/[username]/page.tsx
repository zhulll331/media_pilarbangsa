"use client";

import React, { use } from "react";
import Link from "next/link";
import { usePortal } from "@/context/portal-context";
import { TopUtilityBar } from "@/components/public/top-utility-bar";
import { Header } from "@/components/public/header";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { Avatar } from "@/components/ui/avatar";
import { CategoryBadge } from "@/components/ui/badge";
import { formatDate, formatNumber } from "@/lib/utils";
import { MOCK_USERS } from "@/lib/mock-data";
import { ChevronRight, Calendar, BookOpen, Eye, Award, Mail } from "lucide-react";

export default function AuthorProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  const { posts } = usePortal();

  // Match author by slugified username
  const author =
    MOCK_USERS.find(
      (u) =>
        u.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === username
    ) || MOCK_USERS[1]; // fallback to Budi Santoso

  const authorPosts = posts.filter(
    (p) => p.authorId === author.id && p.status === "published"
  );
  const totalViews = authorPosts.reduce((acc, p) => acc + p.viewCount, 0);

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <TopUtilityBar />
      <Header />
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-[#6B7280]">
            <Link href="/" className="hover:text-[#005AE0] transition-colors">
              Beranda
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span>Penulis Mahasiswa</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="font-semibold text-[#111827]">{author.name}</span>
          </nav>

          {/* Author Profile Header Box */}
          <div className="bg-[#F0F4F8] border border-[#E5E7EB] rounded-3xl p-6 sm:p-10 mb-10 flex flex-col md:flex-row items-start md:items-center gap-6 sm:gap-8">
            <Avatar
              src={author.avatar}
              name={author.name}
              size="xl"
              className="w-24 h-24 sm:w-28 sm:h-28 text-2xl border-2 border-white shadow-md shrink-0"
            />

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#005AE0] text-white">
                  {author.role === "admin"
                    ? "Editor / Redaksi"
                    : author.role === "author"
                    ? "Penulis Mahasiswa"
                    : "Kontributor Terbuka"}
                </span>
                <span className="text-xs text-[#6B7280]">
                  Bergabung sejak {formatDate(author.joinedAt)}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-2">
                {author.name}
              </h1>

              <p className="text-sm text-[#6B7280] leading-relaxed max-w-2xl mb-4">
                {author.bio}
              </p>

              {/* Author Stats Row */}
              <div className="flex items-center gap-6 pt-2 border-t border-[#E5E7EB] text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-[#111827]">
                  <BookOpen className="w-4 h-4 text-[#005AE0]" />
                  <span className="data-tabular">{authorPosts.length} Tulisan Terbit</span>
                </div>
                <div className="flex items-center gap-1.5 font-semibold text-[#111827]">
                  <Eye className="w-4 h-4 text-[#005AE0]" />
                  <span className="data-tabular">{formatNumber(totalViews)} Total Pembaca</span>
                </div>
              </div>
            </div>
          </div>

          {/* Published Articles List */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#111827]">
              Karya Tulis {author.name}
            </h2>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Daftar naskah liputan, opini, dan karya sastra yang telah kurasi redaksi
            </p>
          </div>

          {authorPosts.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-[#E5E7EB] rounded-2xl">
              <p className="text-sm text-[#6B7280]">
                Penulis belum memiliki karya yang berstatus tayang.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {authorPosts.map((post) => (
                <article
                  key={post.id}
                  className="group bg-white rounded-xl border border-[#E5E7EB] overflow-hidden hover:border-[#005AE0] hover:shadow-md transition-all duration-300 flex flex-col"
                >
                  <Link
                    href={`/artikel/${post.slug}`}
                    className="relative aspect-16/10 overflow-hidden bg-gray-100 block"
                  >
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <CategoryBadge>{post.category.name}</CategoryBadge>
                    </div>
                  </Link>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-[#6B7280] mb-2">
                        <span>{post.publishedAt ? formatDate(post.publishedAt) : ""}</span>
                        <span>•</span>
                        <span className="data-tabular">{formatNumber(post.viewCount)} views</span>
                      </div>

                      <Link href={`/artikel/${post.slug}`}>
                        <h3 className="text-base font-bold text-[#111827] group-hover:text-[#005AE0] transition-colors line-clamp-2 leading-snug mb-2">
                          {post.title}
                        </h3>
                      </Link>

                      <p className="text-xs sm:text-sm text-[#6B7280] line-clamp-2 leading-relaxed mb-4">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-xs text-[#6B7280]">
                      <span>{post.readTime}</span>
                      <span className="text-[#005AE0] font-semibold group-hover:underline">
                        Baca →
                      </span>
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
