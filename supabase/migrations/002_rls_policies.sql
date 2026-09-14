-- =================================================================
-- 002_rls_policies.sql
-- Row Level Security (RLS) Policies untuk Keamanan Database
-- =================================================================

-- 1. Enable RLS pada seluruh tabel
ALTER TABLE public.profiles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_tags          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_revisions     ENABLE ROW LEVEL SECURITY;

-- ─── PROFILES ───────────────────────────────────────────────────
DROP POLICY IF EXISTS "profiles_select_all" ON public.profiles;
CREATE POLICY "profiles_select_all"
  ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_insert_trigger" ON public.profiles;
CREATE POLICY "profiles_insert_trigger"
  ON public.profiles FOR INSERT WITH CHECK (true);

-- ─── POSTS ──────────────────────────────────────────────────────
-- Publik hanya membaca yang status published. Penulis membaca miliknya. Admin membaca semua.
DROP POLICY IF EXISTS "posts_select" ON public.posts;
CREATE POLICY "posts_select"
  ON public.posts FOR SELECT USING (
    status = 'published'
    OR auth.uid() = author_id
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Penulis memasukkan naskah baru
DROP POLICY IF EXISTS "posts_insert_author" ON public.posts;
CREATE POLICY "posts_insert_author"
  ON public.posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- Penulis mengedit naskah HANYA jika statusnya masih 'draft'
DROP POLICY IF EXISTS "posts_update_author_draft" ON public.posts;
CREATE POLICY "posts_update_author_draft"
  ON public.posts FOR UPDATE
  USING (auth.uid() = author_id AND status = 'draft')
  WITH CHECK (auth.uid() = author_id);

-- Admin dapat memperbarui semua naskah (approve, reject, edit)
DROP POLICY IF EXISTS "posts_update_admin" ON public.posts;
CREATE POLICY "posts_update_admin"
  ON public.posts FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admin dapat menghapus naskah
DROP POLICY IF EXISTS "posts_delete_admin" ON public.posts;
CREATE POLICY "posts_delete_admin"
  ON public.posts FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ─── COMMENTS ───────────────────────────────────────────────────
-- Publik hanya membaca komentar yang berstatus 'visible'. Admin membaca semua.
DROP POLICY IF EXISTS "comments_select" ON public.comments;
CREATE POLICY "comments_select"
  ON public.comments FOR SELECT USING (
    status = 'visible'
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Pengguna yang telah login dapat menulis komentar
DROP POLICY IF EXISTS "comments_insert_auth" ON public.comments;
CREATE POLICY "comments_insert_auth"
  ON public.comments FOR INSERT
  WITH CHECK (auth.uid() = user_id AND auth.uid() IS NOT NULL);

-- Admin memoderasi/mengubah komentar
DROP POLICY IF EXISTS "comments_update_admin" ON public.comments;
CREATE POLICY "comments_update_admin"
  ON public.comments FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admin menghapus komentar
DROP POLICY IF EXISTS "comments_delete_admin" ON public.comments;
CREATE POLICY "comments_delete_admin"
  ON public.comments FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ─── CATEGORIES, TAGS, POST_TAGS ────────────────────────────────
DROP POLICY IF EXISTS "categories_select" ON public.categories;
CREATE POLICY "categories_select" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "tags_select" ON public.tags;
CREATE POLICY "tags_select" ON public.tags FOR SELECT USING (true);

DROP POLICY IF EXISTS "post_tags_select" ON public.post_tags;
CREATE POLICY "post_tags_select" ON public.post_tags FOR SELECT USING (true);

-- Admin mengelola kategori & tags
DROP POLICY IF EXISTS "categories_admin" ON public.categories;
CREATE POLICY "categories_admin"
  ON public.categories FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "tags_admin" ON public.tags;
CREATE POLICY "tags_admin"
  ON public.tags FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "post_tags_author_or_admin" ON public.post_tags;
CREATE POLICY "post_tags_author_or_admin"
  ON public.post_tags FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.posts
      WHERE id = post_id AND (author_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
      ))
    )
  );

-- ─── POST_STATUS_HISTORY ────────────────────────────────────────
DROP POLICY IF EXISTS "history_select" ON public.post_status_history;
CREATE POLICY "history_select"
  ON public.post_status_history FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    OR EXISTS (SELECT 1 FROM public.posts WHERE id = post_id AND author_id = auth.uid())
  );

DROP POLICY IF EXISTS "history_insert" ON public.post_status_history;
CREATE POLICY "history_insert"
  ON public.post_status_history FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    OR EXISTS (SELECT 1 FROM public.posts WHERE id = post_id AND author_id = auth.uid())
  );
