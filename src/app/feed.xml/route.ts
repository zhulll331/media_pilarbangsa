import { createAdminClient } from '@/lib/supabase/admin';

export const revalidate = 3600;

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  let itemsXml = '';

  try {
    const supabase = createAdminClient();
    const { data: posts } = await supabase
      .from('posts')
      .select('title, slug, excerpt, published_at, author:profiles(full_name)')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(20);

    if (posts && posts.length > 0) {
      itemsXml = posts
        .map((post: any) => {
          const authorName = post.author?.full_name || 'Redaksi Pilar Bangsa';
          return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/artikel/${post.slug}</link>
      <guid>${baseUrl}/artikel/${post.slug}</guid>
      <pubDate>${new Date(post.published_at || Date.now()).toUTCString()}</pubDate>
      <description><![CDATA[${post.excerpt || post.title}]]></description>
      <author><![CDATA[${authorName}]]></author>
    </item>`;
        })
        .join('');
    }
  } catch (err) {
    console.warn('RSS feed fetch error:', err);
  }

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Media Karya Mahasiswa UNTAG Banyuwangi &amp; UKM Pilar Bangsa</title>
    <link>${baseUrl}</link>
    <description>Portal warta, opini kritis, reportase, sastra, dan karya kreatif mahasiswa Universitas 17 Agustus 1945 Banyuwangi.</description>
    <language>id</language>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${itemsXml}
  </channel>
</rss>`;

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
