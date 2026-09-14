-- =================================================================
-- 003_seed_data.sql
-- Kategori & Tag Awal Portal Media Mahasiswa UNTAG Banyuwangi
-- =================================================================

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
