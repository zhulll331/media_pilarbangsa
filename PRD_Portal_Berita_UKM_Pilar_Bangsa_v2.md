# Product Requirements Document (PRD) v2
# Portal Berita & Karya Tulis — UKM Pilar Bangsa

**Status:** Revisi dari PRD awal — disempurnakan untuk penggunaan jangka panjang, minim biaya, dan dirawat oleh tim developer yang bergantian (rotasi kepengurusan UKM).

---

## 1. Pendahuluan & Prinsip Desain

Portal ini dibangun dengan tiga prinsip utama:

1. **Zero-cost sampai skala kecil-menengah tercapai** — semua di free tier, dengan titik peringatan jelas kapan harus upgrade.
2. **Maintainable oleh tim yang berganti-ganti** — karena pengurus UKM rotasi tiap periode, arsitektur harus sederhana, terdokumentasi, dan tidak bergantung pada satu orang.
3. **Siap dipakai jangka panjang** — struktur data dan keamanan dirancang agar tidak perlu migrasi besar saat anggota/traffic bertambah dari puluhan ke ratusan/ribuan.

**Skala target:** puluhan anggota aktif, ratusan pembaca/bulan (comfortably di dalam free tier semua layanan).

---

## 2. Tech Stack (tetap, dengan tambahan)

| Layer | Teknologi | Catatan |
|---|---|---|
| Frontend | Next.js (App Router) | Gunakan **ISR** (`revalidate`), bukan SSR murni di semua halaman — lebih hemat compute Vercel |
| Styling | Tailwind CSS | — |
| Backend/DB/Auth | Supabase (PostgreSQL) | Free tier: 500MB DB, 1GB storage, 50K MAU — sangat cukup untuk skala target |
| Hosting | Vercel | Free tier: 100GB bandwidth/bulan |
| Editor | TipTap (disarankan dibanding React Quill — lebih aktif dikembangkan, ekosistem plugin lebih luas) | Output harus **disanitasi** (lihat §6.2) |
| Email transaksional | **Resend** (baru) | Free tier 3.000 email/bulan — untuk notifikasi status naskah |
| Error monitoring | **Sentry** (baru) | Free tier cukup untuk proyek kecil |
| Analytics | **Vercel Analytics** atau **Plausible** (baru) | Ringan, tanpa cookie consent ribet |

---

## 3. Core Features (Diperluas)

### 3.1 Hak Akses Publik (Pembaca)
- Beranda dengan artikel terbaru, terpopuler, dan per kategori
- Search (lihat §6.4 untuk strategi teknis)
- Filter kategori & **tag**
- Halaman detail artikel dengan typography nyaman baca
- **[BARU] Komentar pembaca** — lihat §3.4
- **[BARU] Tombol share** (WhatsApp, Facebook, X, Copy Link) — lihat §3.5
- **[BARU] Halaman profil penulis** (bio singkat + daftar karya penulis tsb.)
- **[BARU] Related articles** di akhir artikel (berdasarkan kategori/tag)
- RSS feed (`/feed.xml`)

### 3.2 Hak Akses Author (Anggota UKM)
- Registrasi & login (email/password) + **verifikasi email**
- Dashboard personal: statistik (views per artikel), riwayat status naskah
- Editor WYSIWYG (draft otomatis tersimpan)
- Submit for Review
- **[BARU] Notifikasi email** saat naskah di-publish/reject (via Resend)
- **[BARU] Lihat catatan revisi/alasan reject** dari admin

### 3.3 Hak Akses Admin/Editor (Pengurus Inti)
- Semua hak Author
- Antrean Pending Review
- Kurasi & edit naskah
- Approve/Reject dengan **kolom catatan wajib diisi** saat reject
- Manajemen kategori & tag
- **[BARU] Moderasi komentar** (approve/delete/flag spam)
- **[BARU] Lihat riwayat perubahan status tiap naskah** (audit trail)

### 3.4 Sistem Komentar (Prioritas Baru)
- Pembaca **wajib login** untuk komentar (pakai akun yang sama dengan sistem author — cegah spam anonim tanpa perlu captcha kompleks)
- Nested reply 1 level (komentar → balasan), tidak perlu threading dalam
- Admin bisa hapus/moderasi komentar melanggar
- Rate limit: maksimal contoh 5 komentar/menit per user (dicegah di level API)

### 3.5 Fitur Share (Prioritas Baru)
- Tombol share native (`navigator.share` di mobile) + fallback tombol WhatsApp/FB/X/Copy Link di desktop
- **Open Graph meta tags** wajib di setiap halaman artikel (judul, cover image, deskripsi) — supaya preview di WhatsApp/media sosial tampil bagus. Ini murah dibuat tapi sering terlewat, jadi ditegaskan di sini.

---

## 4. Skema Database (Supabase PostgreSQL) — Diperluas

| Tabel | Kolom Utama | Keterangan |
|---|---|---|
| **users** | id, email, role, full_name, bio, avatar_url, created_at | + `bio`/`avatar_url` untuk halaman profil penulis |
| **posts** | id, title, slug, content, excerpt, cover_image, author_id (FK), category_id (FK), status, published_at, view_count, created_at, updated_at | + `excerpt` (untuk SEO meta desc & preview), `view_count` |
| **categories** | id, name, slug, description | — |
| **[BARU] tags** | id, name, slug | Many-to-many dengan posts via `post_tags` |
| **[BARU] post_tags** | post_id (FK), tag_id (FK) | Tabel penghubung |
| **[BARU] comments** | id, post_id (FK), user_id (FK), parent_id (FK, nullable), content, status ('visible'/'hidden'), created_at | `parent_id` untuk 1-level reply |
| **[BARU] post_status_history** | id, post_id (FK), old_status, new_status, changed_by (FK), note, created_at | Audit trail — wajib untuk transparansi ke author |
| **[BARU] post_revisions** | id, post_id (FK), content_snapshot, edited_by (FK), created_at | Simpan snapshot sebelum admin edit naskah orang lain |

**Indexing yang wajib ada sejak awal** (murah untuk dibuat sekarang, mahal untuk ditambah nanti saat data besar):
- Full-text search index (`tsvector`) di `posts.title` + `posts.content`
- Index di `posts.status`, `posts.published_at`, `posts.author_id`
- Index di `comments.post_id`

---

## 5. Alur Kerja & Logika (Diperluas)

### 5.1 State Machine Publikasi (tetap + audit trail)
Sama seperti PRD asli, dengan tambahan: **setiap perubahan status wajib menulis satu baris ke `post_status_history`**, termasuk siapa yang mengubah dan catatannya. Ini yang membuat sistem "auditable" tanpa biaya tambahan — hanya butuh 1 insert tambahan di API.

### 5.2 Algoritma Proteksi Keamanan (Diperkuat)

```
// Frontend (Next.js Middleware) — TETAP seperti PRD asli, tambahan:
JIKA alamat_url adalah "/admin/*" ATAU "/author/*":
    Cek session masih valid (Supabase session refresh)
    JIKA session expired: redirect ke login dengan pesan jelas

// Backend (Supabase RLS) — diperluas:
KEBIJAKAN tabel "posts":
  - PUBLIK HANYA BISA MELIHAT naskah status = 'published'
  - AUTHOR BISA MELIHAT & MENGEDIT naskah miliknya HANYA JIKA status = 'draft'
    (Jika status = 'pending_review' atau 'published', hanya READ, tidak bisa EDIT)
  - ADMIN BISA MELIHAT & MENGEDIT semua naskah

KEBIJAKAN tabel "comments":
  - PUBLIK HANYA BISA MELIHAT komentar status = 'visible'
  - USER LOGIN BISA INSERT komentar (dengan rate limit di level API/Edge Function)
  - USER HANYA BISA EDIT/DELETE komentar miliknya sendiri
  - ADMIN BISA MELIHAT & MENGUBAH SEMUA status komentar
```

**Sanitasi konten (§6.2 detail):** semua HTML output dari rich-text editor **wajib** melewati sanitizer (misal `DOMPurify` di server) sebelum disimpan — mencegah stored XSS. Ini bukan opsional, ini wajib ditulis eksplisit di implementasi.

### 5.3 Logika Upload Gambar (tetap + limit tegas)
- Kompresi + convert WebP (tetap seperti PRD asli)
- **Limit ukuran file: maksimal 2MB per upload sebelum kompresi, ditolak di frontend**
- **Limit dimensi maksimal: contoh 1920px sisi terpanjang**
- Alasan: mencegah storage 1GB Supabase penuh cepat oleh 1-2 anggota yang upload gambar besar berulang

---

## 6. Hal Teknis yang Wajib Ada (Bagian Baru — Sering Terlewat di PRD Awal)

### 6.1 SEO Dasar
- `sitemap.xml` dinamis (generate dari daftar artikel published)
- `robots.txt` (blokir `/admin`, `/author` dari indexing)
- JSON-LD structured data schema `NewsArticle` di setiap halaman artikel
- Open Graph & Twitter Card meta tags (lihat §3.5)

### 6.2 Keamanan Tambahan
- Sanitasi HTML dari rich-text editor (`DOMPurify` server-side)
- Rate limiting di endpoint publik: register, submit naskah, komentar (gunakan Supabase Edge Function + Upstash Redis free tier, atau sederhana pakai kolom `last_action_at` di DB kalau mau tanpa dependency tambahan)
- Password reset flow (Supabase Auth sudah sediakan built-in)

### 6.3 Dokumentasi untuk Tim yang Bergantian (PENTING untuk kasus UKM ini)
Karena developer akan rotasi, wajib disiapkan sejak Tahap 1:
- `README.md` lengkap: cara setup lokal, environment variables, cara jalankan migrasi database
- Dokumen `ARCHITECTURE.md` singkat: kenapa keputusan teknis diambil (misal kenapa ISR bukan SSR)
- Supabase migration files disimpan di repo (folder `supabase/migrations/`), **jangan** ubah skema langsung dari dashboard tanpa dicatat — supaya developer baru bisa `supabase db reset` dan dapat skema identik
- Template `.env.example` (tanpa secret asli)
- Panduan singkat alur kerja Git (branch naming, PR review minimal 1 orang sebelum merge ke `main`)

### 6.4 Strategi Search
Untuk skala puluhan-ratusan artikel, **cukup pakai PostgreSQL full-text search bawaan** (`tsvector` + `to_tsquery`) — jangan langsung pakai Algolia/Meilisearch (biaya/kompleksitas tidak sepadan di skala ini). Baru pertimbangkan search engine eksternal kalau artikel sudah di atas ~5.000 dan pencarian jadi lambat.

### 6.5 Monitoring Biaya (Zero-Cost Watchdog)
- Set alert manual bulanan (cek dashboard Supabase & Vercel usage) — di skala target (puluhan anggota, ratusan pembaca), kemungkinan besar **tidak akan pernah** menyentuh limit free tier, tapi baik untuk dicek tiap 2-3 bulan sebagai kebiasaan tim
- Titik upgrade yang perlu diketahui tim: storage Supabase >1GB → pertimbangkan hapus gambar draft lama yang tidak jadi publish

---

## 7. Roadmap Pengembangan (Direvisi)

| Tahap | Fokus | Tambahan dari PRD v1 |
|---|---|---|
| **Tahap 1: Setup & Schema** | Inisialisasi Next.js, Tailwind, Supabase, RLS, migration files di repo | + `README.md`, `.env.example`, `ARCHITECTURE.md` sejak awal |
| **Tahap 2: Dashboard & Auth** | Login/Register, verifikasi email, layout Dashboard Admin/Author | + password reset flow |
| **Tahap 3: CMS & Editor** | TipTap, CRUD artikel, upload gambar (dengan limit & sanitasi) | + sanitasi HTML, limit upload |
| **Tahap 4: Halaman Publik** | Beranda, detail artikel, kategori/tag, SEO | + sitemap, JSON-LD, OG tags, RSS |
| **[BARU] Tahap 5: Interaksi** | Komentar pembaca + moderasi, tombol share | — |
| **Tahap 6: Deployment** | GitHub → Vercel, testing menyeluruh | + setup Sentry, Analytics |

---

## 8. Ringkasan Perubahan dari PRD v1

- ✅ Ditambahkan: sistem komentar, fitur share, SEO teknis (sitemap/OG/JSON-LD), audit trail status naskah, revision history, tags
- ✅ Diperkuat: RLS policy (author tidak bisa edit setelah submit), sanitasi HTML, rate limiting
- ✅ Ditambahkan bagian dokumentasi khusus untuk tim developer yang bergantian
- ✅ Strategi search & monitoring biaya disesuaikan untuk skala kecil (tidak over-engineered)
- ❌ Tidak ditambahkan: newsletter/email digest (di luar prioritas yang dipilih), multi-language, sistem monetisasi — bisa jadi fase berikutnya kalau skala bertambah besar
