-- =================================================================
-- SCHEMA FULL: PORTAL MEDIA KARYA MAHASISWA UNTAG BANYUWANGI & UKM PILAR BANGSA
-- Salin dan jalankan seluruh isi file ini di Supabase SQL Editor:
-- Dashboard Supabase -> Project -> SQL Editor -> New Query -> Run
-- =================================================================

-- 1. TABEL PROFILES (ekstensi auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'author'
    CHECK (role IN ('author', 'admin')),
  last_comment_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. TABEL KATEGORI
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 3. TABEL TAGS
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

-- 4. TABEL POSTS
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image_url TEXT,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'pending_review', 'published', 'rejected')),
  published_at TIMESTAMPTZ,
  view_count INTEGER DEFAULT 0 NOT NULL,
  rejection_note TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 5. TABEL POST_TAGS
CREATE TABLE IF NOT EXISTS public.post_tags (
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  tag_id  UUID REFERENCES public.tags(id)  ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- 6. TABEL COMMENTS
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id   UUID REFERENCES public.posts(id)    ON DELETE CASCADE NOT NULL,
  user_id   UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'visible'
    CHECK (status IN ('visible', 'hidden')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 7. TABEL POST_STATUS_HISTORY
CREATE TABLE IF NOT EXISTS public.post_status_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id    UUID REFERENCES public.posts(id)    ON DELETE CASCADE NOT NULL,
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 8. TABEL POST_REVISIONS
CREATE TABLE IF NOT EXISTS public.post_revisions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id          UUID REFERENCES public.posts(id)    ON DELETE CASCADE NOT NULL,
  content_snapshot TEXT NOT NULL,
  edited_by        UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- INDEXES
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(excerpt, ''))
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_posts_search ON public.posts USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_posts_status ON public.posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_published ON public.posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_author ON public.posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_category ON public.posts(category_id);
CREATE INDEX IF NOT EXISTS idx_comments_post ON public.comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON public.comments(parent_id);

-- TRIGGER NEW USER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    NEW.raw_user_meta_data->>'avatar_url',
    'author'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- TRIGGER UPDATED_AT
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_posts_updated_at ON public.posts;
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_tags          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_revisions     ENABLE ROW LEVEL SECURITY;

-- Profiles
DROP POLICY IF EXISTS "profiles_select_all" ON public.profiles;
CREATE POLICY "profiles_select_all" ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "profiles_insert_trigger" ON public.profiles;
CREATE POLICY "profiles_insert_trigger" ON public.profiles FOR INSERT WITH CHECK (true);

-- Posts
DROP POLICY IF EXISTS "posts_select" ON public.posts;
CREATE POLICY "posts_select" ON public.posts FOR SELECT USING (
  status = 'published'
  OR auth.uid() = author_id
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
DROP POLICY IF EXISTS "posts_insert_author" ON public.posts;
CREATE POLICY "posts_insert_author" ON public.posts FOR INSERT WITH CHECK (auth.uid() = author_id);
DROP POLICY IF EXISTS "posts_update_author_draft" ON public.posts;
CREATE POLICY "posts_update_author_draft" ON public.posts FOR UPDATE USING (auth.uid() = author_id AND status = 'draft') WITH CHECK (auth.uid() = author_id);
DROP POLICY IF EXISTS "posts_update_admin" ON public.posts;
CREATE POLICY "posts_update_admin" ON public.posts FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
DROP POLICY IF EXISTS "posts_delete_admin" ON public.posts;
CREATE POLICY "posts_delete_admin" ON public.posts FOR DELETE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Comments
DROP POLICY IF EXISTS "comments_select" ON public.comments;
CREATE POLICY "comments_select" ON public.comments FOR SELECT USING (status = 'visible' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
DROP POLICY IF EXISTS "comments_insert_auth" ON public.comments;
CREATE POLICY "comments_insert_auth" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id AND auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "comments_update_admin" ON public.comments;
CREATE POLICY "comments_update_admin" ON public.comments FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
DROP POLICY IF EXISTS "comments_delete_admin" ON public.comments;
CREATE POLICY "comments_delete_admin" ON public.comments FOR DELETE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Taxonomy
DROP POLICY IF EXISTS "categories_select" ON public.categories;
CREATE POLICY "categories_select" ON public.categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "tags_select" ON public.tags;
CREATE POLICY "tags_select" ON public.tags FOR SELECT USING (true);
DROP POLICY IF EXISTS "post_tags_select" ON public.post_tags;
CREATE POLICY "post_tags_select" ON public.post_tags FOR SELECT USING (true);
DROP POLICY IF EXISTS "categories_admin" ON public.categories;
CREATE POLICY "categories_admin" ON public.categories FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
DROP POLICY IF EXISTS "tags_admin" ON public.tags;
CREATE POLICY "tags_admin" ON public.tags FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
DROP POLICY IF EXISTS "post_tags_author_or_admin" ON public.post_tags;
CREATE POLICY "post_tags_author_or_admin" ON public.post_tags FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.posts
    WHERE id = post_id AND (author_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    ))
  )
);

-- History
DROP POLICY IF EXISTS "history_select" ON public.post_status_history;
CREATE POLICY "history_select" ON public.post_status_history FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  OR EXISTS (SELECT 1 FROM public.posts WHERE id = post_id AND author_id = auth.uid())
);
DROP POLICY IF EXISTS "history_insert" ON public.post_status_history;
CREATE POLICY "history_insert" ON public.post_status_history FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  OR EXISTS (SELECT 1 FROM public.posts WHERE id = post_id AND author_id = auth.uid())
);

-- SEED DATA
INSERT INTO public.categories (name, slug, description) VALUES
  ('Berita Kampus',    'berita-kampus',    'Warta dan informasi seputar kegiatan kampus UNTAG Banyuwangi'),
  ('Opini & Gagasan',  'opini',            'Kolom opini, esai argumentatif, dan gagasan kritis mahasiswa'),
  ('Sastra & Budaya',  'sastra',           'Puisi, cerpen, dan esai sastra budaya Banyuwangi'),
  ('Reportase',        'reportase',        'Liputan mendalam dan jurnalisme mahasiswa'),
  ('Ilmu Pengetahuan', 'ilmu-pengetahuan', 'Artikel sains, teknologi, dan riset akademik'),
  ('Galeri Karya',     'galeri',           'Dokumentasi karya seni visual, fotografi, dan desain mahasiswa')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.tags (name, slug) VALUES
  ('UNTAG Banyuwangi',   'untag-banyuwangi'),
  ('Kampus',             'kampus'),
  ('Literasi',           'literasi'),
  ('Prestasi',           'prestasi'),
  ('Esai',               'esai'),
  ('Cerpen',             'cerpen'),
  ('Puisi',              'puisi'),
  ('Riset',              'riset'),
  ('Teknologi',          'teknologi'),
  ('Budaya Banyuwangi',  'budaya-banyuwangi')
ON CONFLICT (slug) DO NOTHING;

-- =================================================================
-- CARA SETTING ADMIN EMAIL:
-- Setelah Anda membuat user email ukmpilarbangsa@gmail.com di Auth -> Users,
-- jalankan baris di bawah ini:
--
-- UPDATE public.profiles
-- SET role = 'admin'
-- WHERE id = (
--   SELECT id FROM auth.users
--   WHERE email = 'ukmpilarbangsa@gmail.com'
-- );
-- =================================================================
