# Media Karya Mahasiswa UNTAG Banyuwangi & UKM Pilar Bangsa

Portal media digital, literasi, dan publikasi karya mahasiswa **Universitas 17 Agustus 1945 Banyuwangi (UNTAG BWI)** yang dikelola oleh dewan redaksi **UKM Pilar Bangsa**.

Mewadahi warta kampus, liputan reportase mendalam, kolom opini kritis, esai argumentatif, riset ilmiah, cerpen, puisi budaya Banyuwangi, hingga dokumentasi galeri visual mahasiswa.

---

## 🚀 Fitur Utama

- **Ruang Penulis Mahasiswa (Google OAuth 1-Klik)**: Mahasiswa dan civitas akademika dapat masuk dengan akun Google tanpa pendaftaran manual. Profil kontributor otomatis dibuat.
- **Studio Editor TipTap Modern**: Editor penulisan kaya fitur dengan formatting lengkap (Heading, bold, italic, quote, image cover, tag topik).
- **Panel Dewan Redaksi (Role-Based Guard)**: Antrean kurasi naskah (Approve/Reject dengan catatan revisi), moderasi komentar, dan manajemen taksonomi kategori/tag.
- **Sistem Email Transaksional (Resend)**:
  - Notifikasi instan ke Redaksi (`ukmpilarbangsa@gmail.com`) saat naskah baru masuk.
  - Notifikasi otomatis ke Penulis saat naskah terbit.
  - Catatan revisi redaksi terkirim langsung ke email penulis jika butuh penyesuaian.
- **Backend Supabase PostgreSQL & Row Level Security (RLS)**: Keamanan tingkat baris database untuk proteksi data publik, draft penulis, dan hak akses redaksi.
- **SEO & Syndication**: Automatic Dynamic Sitemap XML (`/sitemap.xml`), Robots.txt (`/robots.txt`), RSS 2.0 Feed (`/feed.xml`), OpenGraph WhatsApp/Facebook previews, dan JSON-LD NewsArticle schema.

---

## 🛠️ Stack Teknologi

- **Frontend**: Next.js 16 (App Router + Server Actions + Turbopack), React 19, Tailwind CSS v4
- **Editor**: TipTap 3.x
- **Backend & Database**: Supabase (PostgreSQL 15, Auth, Storage, Row Level Security)
- **Email Service**: Resend API
- **Icons**: Lucide React

---

## 📋 Panduan Setup Lokal

### 1. Kloning Repository & Install Dependensi

```bash
git clone https://github.com/zhulll331/media_pilarbangsa.git
cd media_pilarbangsa
npm install
```

### 2. Konfigurasi Environment Variables

Salin `.env.example` menjadi `.env.local`:

```bash
cp .env.example .env.local
```

Isi variabel di `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ey...
SUPABASE_SERVICE_ROLE_KEY=ey...
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=onboarding@resend.dev
ADMIN_EMAIL=ukmpilarbangsa@gmail.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Migrasi Database Supabase

1. Buka [Supabase Dashboard](https://supabase.com/dashboard) &rarr; Masuk ke project Anda.
2. Buka menu **SQL Editor** &rarr; **New Query**.
3. Salin dan jalankan seluruh isi file `supabase/schema_full.sql`.
4. Seluruh tabel (profiles, categories, tags, posts, comments, history), indexes, RLS policies, triggers, dan data awal kategori akan otomatis terpasang.

### 4. Setup Akun Admin Redaksi

1. Di Supabase Dashboard &rarr; **Authentication** &rarr; **Users** &rarr; Klik **Add User** (Create User).
2. Masukkan email: `ukmpilarbangsa@gmail.com` dan tentukan kata sandi admin yang kuat.
3. Di **SQL Editor**, jalankan:
   ```sql
   UPDATE public.profiles
   SET role = 'admin'
   WHERE id = (
     SELECT id FROM auth.users
     WHERE email = 'ukmpilarbangsa@gmail.com'
   );
   ```

### 5. Menjalankan Server Development

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## 🌐 Rute Penting

- `/` &mdash; Beranda publik portal warta & karya mahasiswa
- `/kategori/[slug]` &mdash; Arsip artikel per kategori
- `/artikel/[slug]` &mdash; Halaman baca artikel lengkap + komentar
- `/cari` &mdash; Pencarian artikel full-text
- `/login` &mdash; Masuk penulis mahasiswa (Google OAuth)
- `/admin/login` &mdash; Masuk privat dewan redaksi (Email & Password)
- `/author` &mdash; Dashboard penulis mahasiswa
- `/author/tulis` &mdash; Studio penulisan & submit naskah
- `/admin` &mdash; Antrean kurasi & publikasi dewan redaksi
- `/feed.xml` &mdash; RSS Feed sindikasi berita
- `/sitemap.xml` &mdash; Peta situs mesin pencari

---

## 📄 Lisensi & Hak Cipta

Dikelola secara resmi oleh **UKM Pilar Bangsa** &mdash; Universitas 17 Agustus 1945 Banyuwangi.
