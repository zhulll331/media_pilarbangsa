import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const revalidate = 60; // Revalidate cache every 60 seconds

// Standard CORS headers for cross-site access from pilarbangsa.my.id
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "6", 10) || 6, 1), 30);
    const categoryParam = searchParams.get("category"); // optional override

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://www.mediapilarbangsa.web.id";

    const supabase = createAdminClient();

    // 1. Get categories: filter strictly to news categories ('berita-ukm' by default)
    // Explicitly exclude creative/literary categories (cerpen, puisi, sastra, opini, galeri)
    let categoryQuery = supabase.from("categories").select("id, name, slug");

    if (categoryParam) {
      categoryQuery = categoryQuery.eq("slug", categoryParam);
    } else {
      // Default: strictly 'berita-ukm' (news category)
      categoryQuery = categoryQuery.in("slug", ["berita-ukm"]);
    }

    const { data: categories, error: catError } = await categoryQuery;

    if (catError || !categories || categories.length === 0) {
      return NextResponse.json(
        { success: false, message: "Kategori berita tidak ditemukan.", data: [] },
        { status: 404, headers: corsHeaders }
      );
    }

    const categoryIds = categories.map((c) => c.id);

    // 2. Fetch published posts in the news category
    const { data: posts, error: postError } = await supabase
      .from("posts")
      .select(`
        id,
        title,
        slug,
        excerpt,
        cover_image_url,
        published_at,
        created_at,
        author:profiles(full_name, avatar_url),
        category:categories(id, name, slug)
      `)
      .eq("status", "published")
      .in("category_id", categoryIds)
      .order("published_at", { ascending: false })
      .limit(limit);

    if (postError) {
      console.error("Error fetching news posts:", postError);
      return NextResponse.json(
        { success: false, message: "Gagal mengambil data berita.", error: postError.message },
        { status: 500, headers: corsHeaders }
      );
    }

    // 3. Format news items to be directly compatible with pilarbangsa_manajemen
    const fallbackImage = `${baseUrl}/images/og-pilar-bangsa.png`;

    const formattedNews = (posts || []).map((post: any) => {
      let imageUrl = post.cover_image_url;

      if (!imageUrl || imageUrl.startsWith("blob:")) {
        imageUrl = fallbackImage;
      } else if (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
        imageUrl = `${baseUrl}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
      }

      const authorName = Array.isArray(post.author)
        ? post.author[0]?.full_name
        : post.author?.full_name || "Redaksi Pilar Bangsa";

      const categoryName = Array.isArray(post.category)
        ? post.category[0]?.name
        : post.category?.name || "Berita UKM";

      return {
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || "",
        image_url: imageUrl, // Compatible with news.image_url in pilarbangsa_manajemen
        url: `${baseUrl}/artikel/${post.slug}`, // Direct link to read on mediapilarbangsa.web.id
        published_at: post.published_at || post.created_at,
        created_at: post.created_at,
        author: authorName,
        category: categoryName,
      };
    });

    return NextResponse.json(formattedNews, {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err: any) {
    console.error("Internal API error in /api/berita-ukm:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error", error: err?.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
