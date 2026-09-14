---
name: Portal Berita UKM Pilar Bangsa
description: Platform publikasi berita dan karya sastra mahasiswa dengan arsitektur grid asimetris (editorial / bento grid), lengkap untuk peran publik, author, dan admin sesuai PRD.
stack: "Next.js 16 (App Router) + React + Tailwind CSS v4 (CSS-first config via @theme di global.css)"
colors:
  primary: "#005AE0"
  secondary: "#1E3A8A"
  background: "#FFFFFF"
  surface-light: "#F0F4F8"
  surface-dark: "#0B172A"
  text-primary: "#111827"
  text-secondary: "#6B7280"
  border: "#E5E7EB"
  accent-red: "#DC2626"
  # [BARU] status warna — dipakai untuk status naskah (§5.1 PRD) & komentar, terpisah dari accent-red
  # supaya "LIVE/urgent" (accent-red) tidak tertukar makna dengan "ditolak/pending"
  status-draft: "#6B7280"      # sama dengan text-secondary — naskah draft netral, belum butuh perhatian
  status-pending: "#D97706"    # amber — sedang ditinjau admin
  status-published: "#059669"  # hijau — sudah tayang
  status-rejected: "#DC2626"   # sama dengan accent-red — konsisten "butuh tindakan/perhatian"
typography:
  h1:
    fontFamily: "Inter, sans-serif"
    fontSize: 2.25rem
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.02em
  h2:
    fontFamily: "Inter, sans-serif"
    fontSize: 1.25rem
    fontWeight: 700
    lineHeight: 1.3
  body-main:
    fontFamily: "Inter, sans-serif"
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.6
  body-card:
    fontFamily: "Inter, sans-serif"
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter, sans-serif"
    fontSize: 0.75rem
    fontWeight: 500
  # [BARU] dibutuhkan untuk dashboard author/admin (tabel, statistik) — §3.2 & §3.3 PRD
  data-tabular:
    fontFamily: "Inter, sans-serif"
    fontSize: 0.875rem
    fontWeight: 500
    fontFeatureSettings: "'tnum' 1"   # tabular figures — angka rata kolom di tabel admin & view count
rounded:
  sm: 4px
  md: 8px
  lg: 12px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.background}"
    rounded: "{rounded.full}"
    padding: "8px 24px"
  button-secondary:
    # [BARU] dibutuhkan untuk aksi kedua di dashboard (mis. "Simpan Draft" vs "Kirim ke Editor")
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    border: "1px solid {colors.primary}"
    rounded: "{rounded.full}"
    padding: "8px 24px"
  button-danger:
    # [BARU] untuk aksi reject/hapus di dashboard admin
    backgroundColor: "transparent"
    textColor: "{colors.accent-red}"
    border: "1px solid {colors.accent-red}"
    rounded: "{rounded.full}"
    padding: "8px 24px"
  card-image:
    rounded: "{rounded.md}"
    overflow: "hidden"
  badge:
    # kategori (Berita/Opini/Sastra/Cerpen/Puisi/Galeri) — SOLID fill, warna primary
    backgroundColor: "{colors.primary}"
    textColor: "{colors.background}"
    rounded: "{rounded.full}"
    padding: "2px 8px"
  badge-status:
    # [BARU] status naskah — solid fill mengikuti status-* token, dipakai di dashboard author/admin
    rounded: "{rounded.full}"
    padding: "2px 8px"
    variants: ["draft", "pending", "published", "rejected"]
  tag-chip:
    # [BARU] tag bebas (§4 PRD, tabel `tags`) — OUTLINE, bukan solid, supaya visual beda dari kategori
    # kategori = 1 per artikel, jelas & terkurasi → solid. tag = banyak per artikel, lebih santai → outline
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    border: "1px solid {colors.border}"
    rounded: "{rounded.full}"
    padding: "2px 10px"
  avatar:
    # [BARU] dipakai di header (user login), byline artikel, komentar, dashboard
    rounded: "{rounded.full}"
    sizes: { sm: "24px", md: "32px", lg: "48px" }
    border: "1px solid {colors.border}"
  form-input:
    # [BARU] untuk login/register/editor — §3.2 PRD
    backgroundColor: "{colors.background}"
    border: "1px solid {colors.border}"
    rounded: "{rounded.md}"
    padding: "10px 14px"
    focusRing: "2px solid {colors.primary}, offset 2px"
  comment-item:
    # [BARU] §3.4 PRD — komentar pembaca
    avatar: "{components.avatar} (sm)"
    bodyTypography: "{typography.body-card}"
    timestampTypography: "{typography.label}"
    replyIndent: "{spacing.xl}"       # balasan 1 level, indent sekali saja (tidak nested dalam)
    border: "none"
    divider: "1px solid {colors.border} (antar komentar top-level)"
  share-bar:
    # [BARU] §3.5 PRD — tombol share
    iconSize: "20px"
    gap: "{spacing.sm}"
    iconColor: "{colors.text-secondary}"
    iconColorHover: "{colors.primary}"
  toast:
    # [BARU] notifikasi aksi (mis. "Naskah dikirim ke editor", "Komentar dihapus")
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.background}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
    accentBar: "3px solid, warna mengikuti status-* (success/warning/error)"
  stat-card:
    # [BARU] dashboard author — statistik views per artikel
    backgroundColor: "{colors.surface-light}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
    numberTypography: "{typography.h2} + data-tabular"
    labelTypography: "{typography.label}"
  table-row-admin:
    # [BARU] antrean pending review admin — §3.3 PRD
    padding: "{spacing.md} {spacing.sm}"
    border-bottom: "1px solid {colors.border}"
    hoverBackground: "{colors.surface-light}"
    statusColumn: "badge-status"
  drop-cap:
    # [BARU] konten artikel §content_area di prompt tambahan
    fontSize: "3.5rem"
    lineHeight: "0.9"
    fontWeight: 700
    color: "{colors.primary}"
    float: "left"
    marginRight: "{spacing.sm}"
---

## Overview
Portal berita yang padat informasi (dense) namun tetap nyaman dibaca (breathable). Mengadaptasi gaya portal olahraga kelas atas menjadi platform literasi kampus yang tepercaya. Sistem desain ini mencakup **tiga permukaan** sesuai PRD: halaman publik (pembaca), dashboard Author, dan dashboard Admin/Editor — satu bahasa visual, tiga konteks penggunaan (lihat §5).

## Colors
Menggunakan warna #0B172A (Navy) sebagai pengganti hitam murni untuk panel gelap, menciptakan kontras yang sangat tinggi namun tetap ramah mata (Soft black compliance). #005AE0 digunakan secara eksklusif untuk elemen interaktif (CTA) dan indikasi brand.

**Aturan pemisahan makna warna (baru, penting untuk konsistensi di dashboard):**
- `accent-red` (#DC2626) khusus untuk **urgensi/perhatian publik**: badge "LIVE", "TRENDING", dan status "Ditolak" di dashboard author — karena keduanya sama-sama "butuh dilihat sekarang".
- `status-pending` (amber) khusus untuk **menunggu tindakan**: naskah pending review. Jangan pakai merah di sini — pending bukan error, hanya belum diproses.
- `status-published` (hijau) khusus untuk **selesai/berhasil**: dipakai juga sebagai warna toast sukses.
- `primary` tidak pernah dipakai untuk status — supaya tombol aksi (yang juga biru) tidak tertukar visual dengan indikator status.

## Spacing & Layout
Menggunakan 12-column grid dengan pembagian asimetris 8 (main) + 4 (sidebar) pada Desktop. Skala spasi mematuhi aturan kelipatan 8px murni (8, 16, 24, 32, 48) tanpa sub-pixel untuk mencegah visual yang kotor.

**Dashboard Author/Admin** memakai grid yang lebih sederhana: sidebar navigasi tetap (240px) + area konten fluid — bukan grid 8+4 editorial, karena konteks kerja (tabel, form) butuh lebar penuh, beda dengan konteks baca.

## Typography
Hierarki menggunakan *size contrast* yang sangat tegas (H1 ke H2). Jarak antar paragraf pada halaman artikel menggunakan *margin-bottom* (1.5x dari *line-height*), tidak menggunakan sistem *indentation*. Paragraf pertama artikel memakai **drop cap** (lihat token `drop-cap`) sebagai penanda editorial khas media cetak — dipakai sekali di awal artikel saja, bukan di setiap sub-bagian.

Tabel dan angka statistik (view count, jumlah komentar, di dashboard) memakai `data-tabular` — tabular figures supaya kolom angka rata, bukan `body-card` biasa.

## Screens (Publik) — dari brief

### 1. Home (`page.tsx`)
- Top utility bar: pengumuman trending + ikon sosial.
- Header: logo, search, tombol Subscribe, avatar user.
- Navigasi utama: Berita, Opini, Sastra, Cerpen, Puisi, Galeri.
- Hero 8-kolom: gambar besar + gradient overlay gelap, headline, CTA "Baca Selengkapnya".
- Sidebar 4-kolom (`surface-dark`): "Karya Terpopuler" — 5 item pakai `table-row` sederhana (rank + judul + view count dalam `data-tabular`).
- Bento grid "Don't Miss": 4–5 `card-image` ukuran campuran.
- Banner newsletter: `surface-light`, ajakan subscribe mingguan.

### 2. Detail Artikel (`app/artikel/[slug]/page.tsx`)
- Breadcrumb: Home > Kategori > Judul.
- Header artikel: H1, `avatar` + nama author + tanggal, `share-bar`.
- Konten 8-kolom center: `max-width: 65ch`, `body-main`, drop cap di paragraf pertama.
- **[BARU] Komentar** di bawah konten: daftar `comment-item`, form balas (pakai `form-input` varian textarea), tombol "Kirim Komentar" (`button-primary`, hanya aktif jika login — §3.4 PRD).
- Sidebar 4-kolom sticky: "Tulisan Terkait" — thumbnail kecil + judul.

## Screens (Author & Admin) — baru, dibutuhkan PRD §3.2 & §3.3

### 3. Dashboard Author
- Sidebar navigasi tetap kiri: Beranda Dashboard, Tulisan Saya, Tulis Baru, Profil.
- Header halaman: sapaan singkat + tombol `button-primary` "Tulis Baru".
- Grid `stat-card` (3 kolom): total tulisan, total views, tulisan pending.
- Tabel "Tulisan Saya": kolom Judul, `badge-status` (draft/pending/published/rejected), Tanggal, Aksi. Kalau status = rejected, tampilkan catatan admin (dari `post_status_history`) di bawah judul, teks kecil `text-secondary`.
- Editor tulis baru: full-width, toolbar TipTap sticky di atas, area tulis `body-main`, tombol `button-secondary` "Simpan Draft" + `button-primary` "Kirim ke Editor".

### 4. Dashboard Admin
- Sidebar navigasi tetap kiri: Antrean Review, Semua Naskah, Komentar, Kategori & Tag, Sponsor (jika fase monetisasi §6 diaktifkan).
- Antrean Review: daftar `table-row-admin`, tiap baris ada tombol cepat Approve (`button-primary`, warna diganti `status-published`) dan Reject (`button-danger`) — reject wajib isi catatan (modal kecil dengan `form-input` textarea, sesuai §5.2 PRD).
- Moderasi Komentar: daftar `comment-item` dengan tombol Hapus/Sembunyikan per baris.

## Components (ringkasan tambahan)
- **Category Badge** (solid) vs **Tag Chip** (outline): dibedakan sengaja — kategori itu kurasi editorial (1 per artikel), tag itu bebas & banyak. Jangan pakai style yang sama untuk keduanya, pembaca perlu bisa membedakan sekilas.
- **Status Badge**: 4 varian warna (`status-draft/pending/published/rejected`) — dipakai konsisten di dashboard author DAN admin, supaya kedua peran "berbicara" dalam bahasa visual yang sama.
- **Sidebar List Item**: layout tabular, nomor urut + judul + metrik, pakai `data-tabular` untuk angka.

## Interactions (dari brief)
- Hover: gambar scale 1.02 (transisi halus, bukan instan), judul tulisan berubah warna ke `primary`.
- Focus: ring 2px warna `primary`, offset 2px — berlaku di semua elemen interaktif termasuk baris tabel admin dan item komentar yang bisa di-reply.
- Toast muncul untuk konfirmasi aksi non-navigasi (kirim komentar, approve naskah, simpan draft) — auto-dismiss, warna accent bar mengikuti hasil aksi (sukses/warning/error).

## Responsive (dari brief)
Mobile-first. Desktop (lg/xl): split 8+4. Mobile/tablet (sm/md): sidebar 4-kolom pindah ke bawah hero utama. Target sentuh minimal 44×44px — berlaku juga untuk baris tabel admin dan tombol aksi cepat (approve/reject) supaya tetap dipakai dari HP saat pengurus UKM perlu approve cepat di luar laptop.

## Rules to Never Break
- Jangan gunakan #000000 murni untuk background atau teks besar.
- Jangan atur tinggi tetap (fixed height) pada kontainer teks; selalu gunakan *padding* yang konsisten dengan *height: auto*.
- Pastikan rasio kontras teks di atas bayangan/gambar (image overlay) minimal 4.5:1 (WCAG AA).
- **[BARU]** Jangan gunakan `primary` (biru) untuk indikator status naskah — biru direservasi untuk aksi/CTA, bukan status. Ini mencegah pengguna salah baca "ini bisa diklik" vs "ini cuma info status".
- **[BARU]** `badge` (kategori, solid) dan `tag-chip` (tag, outline) tidak boleh dipertukarkan — perbedaan visual ini yang membuat pembaca cepat membedakan struktur konten (editorial) vs metadata bebas.

## Tech Output Notes
Implementasi: Next.js 16 (App Router) + React + Tailwind CSS v4, konfigurasi CSS-first via `@theme` di `global.css` (bukan `tailwind.config.js`) — token warna, spacing, dan radius di atas dipetakan langsung sebagai custom properties di `@theme`. HTML semantik (`header`, `nav`, `main`, `article`, `aside`) wajib di kedua screen publik maupun dashboard. Komponen dibuat modular per token di atas, supaya satu perubahan warna/spacing di `@theme` otomatis konsisten di halaman publik dan dashboard sekaligus.
