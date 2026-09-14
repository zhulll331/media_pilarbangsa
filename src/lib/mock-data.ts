export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "author" | "reader";
  avatar: string;
  bio?: string;
  joinedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  count: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  status: "visible" | "hidden" | "flagged";
  parentId?: string | null;
  replies?: Comment[];
}

export interface StatusHistory {
  id: string;
  postId: string;
  oldStatus: string;
  newStatus: string;
  changedBy: string;
  changedByName: string;
  note?: string;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  authorId: string;
  author: User;
  categoryId: string;
  category: Category;
  tags: Tag[];
  status: "draft" | "pending" | "published" | "rejected";
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  readTime: string;
  isFeatured?: boolean;
  isEditorChoice?: boolean;
  rejectionNote?: string;
}

export const MOCK_USERS: User[] = [
  {
    id: "user-admin",
    name: "Siti Rahma",
    email: "ukmpilarbangsa@gmail.com",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    bio: "Pemimpin Redaksi UKM Pilar Bangsa • Media Karya Mahasiswa UNTAG Banyuwangi. Mengawal kurasi karya dan ruang ekspresi kreatif mahasiswa.",
    joinedAt: "2023-09-01",
  },
  {
    id: "user-author-1",
    name: "Budi Santoso",
    email: "budi.santoso@student.untag-bwi.ac.id",
    role: "author",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    bio: "Penulis Mahasiswa UNTAG Banyuwangi & Anggota UKM Pilar Bangsa. Mahasiswa Teknik Informatika yang gemar mengulas teknologi dan ekosistem kampus.",
    joinedAt: "2024-02-15",
  },
  {
    id: "user-author-2",
    name: "Aisyah Maharani",
    email: "aisyah.m@student.untag-bwi.ac.id",
    role: "author",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
    bio: "Kurator Sastra & Penulis Mahasiswa UNTAG Banyuwangi. Penulis cerpen, puisi, dan esai budaya Banyuwangi.",
    joinedAt: "2024-01-10",
  },
  {
    id: "user-reader",
    name: "Farhan Nurhadi",
    email: "farhan.n@gmail.com",
    role: "reader",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
    bio: "Pembaca setia portal dan mahasiswa semester 4 Fakultas Hukum UNTAG Banyuwangi.",
    joinedAt: "2025-01-20",
  },
];

export const MOCK_CATEGORIES: Category[] = [
  {
    id: "cat-berita",
    name: "Berita Kampus",
    slug: "berita-kampus",
    description: "Kabar terkini seputar dinamika, kebijakan, dan prestasi civitas akademika Universitas 17 Agustus 1945 Banyuwangi.",
    count: 14,
  },
  {
    id: "cat-opini",
    name: "Opini",
    slug: "opini",
    description: "Ruang gagasan, pemikiran kritis, dan dialektika mahasiswa terhadap isu sosial & kampus.",
    count: 9,
  },
  {
    id: "cat-sastra",
    name: "Sastra",
    slug: "sastra",
    description: "Esai sastra, telaah karya, kritik seni, dan ulasan kebudayaan.",
    count: 7,
  },
  {
    id: "cat-cerpen",
    name: "Cerpen",
    slug: "cerpen",
    description: "Kumpulan cerita pendek fiksi dan narasi kehidupan karya anggota UKM.",
    count: 8,
  },
  {
    id: "cat-puisi",
    name: "Puisi",
    slug: "puisi",
    description: "Larik bait puitis, curahan rasa, dan antologi sajak mahasiswa.",
    count: 11,
  },
  {
    id: "cat-galeri",
    name: "Galeri",
    slug: "galeri",
    description: "Warta visual, esai foto jurnalistik, dan rekaman peristiwa kampus.",
    count: 5,
  },
];

export const MOCK_TAGS: Tag[] = [
  { id: "tag-1", name: "#kampus", slug: "kampus", count: 18 },
  { id: "tag-2", name: "#prestasi", slug: "prestasi", count: 8 },
  { id: "tag-3", name: "#literasi", slug: "literasi", count: 12 },
  { id: "tag-4", name: "#untag", slug: "untag", count: 20 },
  { id: "tag-5", name: "#esai", slug: "esai", count: 6 },
  { id: "tag-6", name: "#kebebasanberpikir", slug: "kebebasanberpikir", count: 5 },
  { id: "tag-7", name: "#senbud", slug: "senbud", count: 7 },
  { id: "tag-8", name: "#antologi", slug: "antologi", count: 4 },
];

export const INITIAL_POSTS: Post[] = [
  {
    id: "post-1",
    title: "Pelantikan Pengurus Baru UKM Pilar Bangsa 2026: Komitmen Merawat Nalar Kritis dan Integritas Jurnalisme Kampus",
    slug: "pelantikan-pengurus-baru-pilar-bangsa-2026",
    excerpt: "Musyawarah Anggota menetapkan kepengurusan baru UKM Pilar Bangsa dengan agenda utama penguatan literasi digital, keterbukaan informasi publik kampus, dan independensi pers mahasiswa.",
    content: `Musyawarah Tahunan UKM Pilar Bangsa resmi menetapkan susunan pengurus baru untuk masa bakti 2026/2027 pada Sabtu kemarin di Gedung Student Center UNTAG. Momentum ini menandai babak baru bagi pers mahasiswa dalam menghadapi tantangan era kecerdasan buatan dan disrupsi informasi.

Ketua Umum terpilih dalam pidato perdananya menegaskan bahwa fungsi pers mahasiswa bukan sekadar mading informasi seremonial, melainkan pilar keempat demokrasi kampus yang mengawal kebijakan, menyuarakan aspirasi civitas akademika, dan menjadi laboratorium intelektual bagi para penulis muda.

"Kita hidup di era di mana informasi berhamburan begitu cepat, tetapi kejernihan berpikir sering kali tenggelam dalam algoritma sensasional. Pilar Bangsa harus teguh memegang kode etik jurnalistik, mengedepankan verifikasi mendalam, dan menjadi rumah hangat bagi karya sastra yang bernas," tegasnya disambut riuh tepuk tangan peserta musyawarah.

Acara yang dihadiri oleh para pembina UKM, perwakilan dekanat, serta alumni lintas angkatan ini juga meluncurkan peta jalan portal berita baru. Melalui arsitektur portal mandiri yang responsif dan dirancang untuk keberlanjutan lintas periode kepengurusan, Pilar Bangsa bertekad memperluas jangkauan pembaca hingga ke tingkat regional dan nasional.

Dalam sesi dialog terbuka, para redaktur divisi berita, opini, dan sastra memaparkan program unggulan seperti Sekolah Jurnalisme Investigasi, Antologi Puisi Dua Semester, dan Klinik Penulisan Esai Populer yang dapat diakses cuma-cuma oleh seluruh mahasiswa aktif.`,
    coverImage: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1200&auto=format&fit=crop&q=80",
    authorId: "user-author-1",
    author: MOCK_USERS[1],
    categoryId: "cat-berita",
    category: MOCK_CATEGORIES[0],
    tags: [MOCK_TAGS[0], MOCK_TAGS[2], MOCK_TAGS[3]],
    status: "published",
    publishedAt: "2026-09-10T09:00:00Z",
    createdAt: "2026-09-08T14:20:00Z",
    updatedAt: "2026-09-10T09:00:00Z",
    viewCount: 1650,
    readTime: "4 menit baca",
    isFeatured: true,
  },
  {
    id: "post-2",
    title: "Refleksi Mahasiswa di Tengah Ledakan AI Generatif: Ancaman Plagiasi atau Katalisator Berpikir Kritis?",
    slug: "refleksi-mahasiswa-di-tengah-ledakan-ai",
    excerpt: "Apakah kehadiran kecerdasan buatan mematikan orisinalitas tulisan mahasiswa, atau justru menjadi pemicu untuk melompat lebih jauh dalam olah gagasan filosofis?",
    content: `Kehadiran model bahasa besar seperti ChatGPT dan Gemini telah merombak lanskap akademik secara radikal. Di ruang-ruang kuliah, perdebatan bukan lagi tentang apakah AI boleh digunakan, melainkan sejauh mana batas etis antara bantuan asistensi dan pengikisan kemampuan bernalar mandiri.

Sebagai mahasiswa, kita sering kali tergoda dengan kepraktisan sintesis instan. Namun, tulisan yang berbobot tidak semata-mata diukur dari kerapian tata bahasa, melainkan kejujuran emosi, kedalaman pengalaman empiris, dan keberanian mengambil posisi argumentatif yang belum terdata di korpus pelatihan mesin.

Menulis adalah proses berpikir yang melatih ketahanan mental. Ketika kita menyerahkan seluruh proses perumusan argumen ke algoritma, kita sedang melucuti otot intelektual kita sendiri. Pilar Bangsa mengajak mahasiswa untuk memandang AI sebagai instrumen dialektika, bukan pengganti kesadaran kritis.`,
    coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80",
    authorId: "user-admin",
    author: MOCK_USERS[0],
    categoryId: "cat-opini",
    category: MOCK_CATEGORIES[1],
    tags: [MOCK_TAGS[1], MOCK_TAGS[4], MOCK_TAGS[5]],
    status: "published",
    publishedAt: "2026-09-12T13:30:00Z",
    createdAt: "2026-09-11T10:00:00Z",
    updatedAt: "2026-09-12T13:30:00Z",
    viewCount: 1420,
    readTime: "5 menit baca",
    isEditorChoice: true,
  },
  {
    id: "post-3",
    title: "UNTAG Banyuwangi Raih Penghargaan Kampus Inovatif: Menguji Dampak Nyata Riset Pengabdian",
    slug: "untag-banyuwangi-raih-penghargaan-kampus-inovatif",
    excerpt: "Capaian prestasi akademik terbaru di bidang pengabdian masyarakat diapresiasi, namun mahasiswa menyoroti transparansi hilirisasi riset bagi warga sekitar.",
    content: `Universitas 17 Agustus 1945 Banyuwangi kembali menorehkan prestasi membanggakan dengan dinobatkan sebagai salah satu perguruan tinggi paling inovatif dalam ajang Anugerah Riset Terapan se-Jawa Timur. Berbagai program pemberdayaan UMKM dan teknologi tepat guna di Banyuwangi menjadi poin penilaian utama dewan juri.

Di balik euforia piagam dan plakat seremonial, suara kritis dari kalangan mahasiswa tetap bergulir. Sejumlah aktivis kampus mengingatkan bahwa tolok ukur kesuksesan sejati dari sebuah inovasi bukanlah banyaknya sertifikat, melainkan seberapa besar perubahan konkret yang dirasakan langsung oleh masyarakat marjinal di lingkar kampus Banyuwangi.`,
    coverImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80",
    authorId: "user-author-1",
    author: MOCK_USERS[1],
    categoryId: "cat-berita",
    category: MOCK_CATEGORIES[0],
    tags: [MOCK_TAGS[1], MOCK_TAGS[3]],
    status: "published",
    publishedAt: "2026-09-11T15:00:00Z",
    createdAt: "2026-09-10T11:00:00Z",
    updatedAt: "2026-09-11T15:00:00Z",
    viewCount: 980,
    readTime: "3 menit baca",
  },
  {
    id: "post-4",
    title: "Cerpen: Senja Merah di Sudut Lorong Kampus UNTAG Banyuwangi",
    slug: "cerpen-senja-merah-di-sudut-lorong",
    excerpt: "Di antara tumpukan diktat kuliah yang menguning dan hembusan angin petang, dua kawan lama menuntaskan janji yang tertunda sejak semester tiga.",
    content: `Langkah sepatu Rani terdengar berirama lambat memantul di lantai keramik lorong lantai dua kampus UNTAG Banyuwangi. Jarum jam dinding di atas pintu sekretariat ormawa baru saja berdentang lima kali. Mahasiswa lain sudah lama beranjak meninggalkan area kampus, memburu angkutan kota atau sekadar berkumpul di warung kopi seberang gerbang.

Hanya Aris yang masih bertahan, duduk di bangku kayu panjang sembari memangku map cokelat bertali biru. Matanya menerawang ke arah ufuk barat di mana mentari Banyuwangi mulai tenggelam di balik megahnya panorama Gunung Ijen, membakar langit dengan gradasi jingga tembaga yang menghipnotis.

"Kupikir kau sudah lupa jalan kembali ke lorong ini," sapa Aris lirih tanpa menoleh, mengenali aroma parfum melati yang khas dari arah belakangnya.`,
    coverImage: "https://images.unsplash.com/photo-1507842229451-79b1be886a20?w=1200&auto=format&fit=crop&q=80",
    authorId: "user-author-2",
    author: MOCK_USERS[2],
    categoryId: "cat-cerpen",
    category: MOCK_CATEGORIES[3],
    tags: [MOCK_TAGS[2], MOCK_TAGS[6], MOCK_TAGS[7]],
    status: "published",
    publishedAt: "2026-09-09T17:30:00Z",
    createdAt: "2026-09-07T08:00:00Z",
    updatedAt: "2026-09-09T17:30:00Z",
    viewCount: 845,
    readTime: "6 menit baca",
    isEditorChoice: true,
  },
  {
    id: "post-5",
    title: "Puisi: Catatan Pinggir Mahasiswa Semester Akhir",
    slug: "puisi-catatan-pinggir-mahasiswa-semester-akhir",
    excerpt: "Tentang revisi tak berujung, lampu meja yang tak pernah lelap, dan harapan orang tua di kampung halaman yang menjadi kompas perjalanan.",
    content: `Di atas meja persegi beralas kertas buram,
huruf-huruf berbaris menuntut pertanggungjawaban.
Dosen pembimbing mencoret baris ketiga,
memberi tanda tanya merah pada premis yang rapuh.

Malam telah menelan kebisingan jalanan kota,
namun dengung kipas laptop masih setia berbisik.
Kita bukan sedang mengejar selembar ijazah semata,
tetapi memvalidasi doa-doa panjang yang dihantarkan ibu di sepertiga malam.`,
    coverImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&auto=format&fit=crop&q=80",
    authorId: "user-author-2",
    author: MOCK_USERS[2],
    categoryId: "cat-puisi",
    category: MOCK_CATEGORIES[4],
    tags: [MOCK_TAGS[2], MOCK_TAGS[7]],
    status: "published",
    publishedAt: "2026-09-08T20:00:00Z",
    createdAt: "2026-09-06T19:00:00Z",
    updatedAt: "2026-09-08T20:00:00Z",
    viewCount: 720,
    readTime: "2 menit baca",
  },
  {
    id: "post-6",
    title: "Polemik Penataan Parkir dan Kenyamanan Fasilitas Pejalan Kaki di Lingkungan Kampus",
    slug: "polemik-penataan-parkir-dan-fasilitas-pejalan-kaki",
    excerpt: "Pertumbuhan kendaraan bermotor mahasiswa yang melesat tidak diimbangi kantong parkir memadai, mengorbankan trotoar dan jalur hijau kampus.",
    content: `Setiap pagi antara pukul 07.30 hingga 08.15 WIB, pemandangan kemacetan padat merayap di depan gerbang masuk utama kampus telah menjadi rutinitas yang menjemukan. Mahasiswa mengeluhkan antrean karcis yang memakan waktu belasan menit hingga kerap terlambat masuk kelas kuliah jam pertama.

Lebih dari itu, trotoar pejalan kaki yang semestinya menjadi hak privat pejalan kaki kini kerap diokupasi oleh barisan motor yang meluber. Hasil investigasi tim Pilar Bangsa menemukan bahwa kapasitas parkir resmi baru menampung 60% dari estimasi volume kendaraan harian. Diperlukan penataan zonasi terpadu dan insentif bagi pengguna transportasi umum kampus.`,
    coverImage: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=1200&auto=format&fit=crop&q=80",
    authorId: "user-author-1",
    author: MOCK_USERS[1],
    categoryId: "cat-opini",
    category: MOCK_CATEGORIES[1],
    tags: [MOCK_TAGS[0], MOCK_TAGS[4]],
    status: "published",
    publishedAt: "2026-09-07T11:00:00Z",
    createdAt: "2026-09-05T09:00:00Z",
    updatedAt: "2026-09-07T11:00:00Z",
    viewCount: 680,
    readTime: "4 menit baca",
  },
  {
    id: "post-7",
    title: "Esai Foto: Potret Semarak Panggung Budaya Nusantara di Halaman Rektorat UNTAG",
    slug: "potret-semarak-panggung-budaya-nusantara",
    excerpt: "Gema gamelan, kibasan selendang tari daerah, dan antusiasme mahasiswa dari Sabang sampai Merauke menyatu dalam festival budaya tahunan.",
    content: `Warna-warni busana adat nusantara menghiasi pelataran depan Gedung Rektorat dalam perhelatan akbar Gebyar Budaya Mahasiswa UNTAG 2026. Dari Tari Saman Aceh yang ritmis hingga Tari Jaipong Jawa Barat yang dinamis, seluruhnya dibawakan penuh penghayatan oleh ormawa daerah.

Festival tahunan ini membuktikan bahwa keragaman etnis dan latar belakang budaya adalah kekayaan terbesar yang merajut persatuan di kampus nasionalis. Melalui lensa fotografer jurnalistik Pilar Bangsa, setiap gerak dan senyum terekam abadi sebagai wujud rasa bangga terhadap warisan leluhur nusantara.`,
    coverImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80",
    authorId: "user-author-2",
    author: MOCK_USERS[2],
    categoryId: "cat-galeri",
    category: MOCK_CATEGORIES[5],
    tags: [MOCK_TAGS[3], MOCK_TAGS[6]],
    status: "published",
    publishedAt: "2026-09-06T16:00:00Z",
    createdAt: "2026-09-04T12:00:00Z",
    updatedAt: "2026-09-06T16:00:00Z",
    viewCount: 590,
    readTime: "3 menit baca",
    isEditorChoice: true,
  },
  // Naskah dalam antrean review (untuk Admin Dashboard & Author Dashboard)
  {
    id: "post-pending-1",
    title: "Liputan Khusus: Mengawal Alokasi Dana Riset Mahasiswa dan Pengadaan Buku Perpustakaan",
    slug: "mengawal-alokasi-dana-riset-mahasiswa",
    excerpt: "Sebuah tinjauan terhadap efektivitas anggaran perpustakaan pusat dan keluhan mahasiswa terkait keterbatasan akses jurnal internasional berbayar.",
    content: `Perpustakaan adalah jantung peradaban sebuah universitas. Namun, dalam jajak pendapat yang dilakukan terhadap 200 mahasiswa dari berbagai fakultas, lebih dari 70% responden menyatakan kesulitan mengakses literatur ilmiah mutakhir karena minimnya langganan database bereputasi seperti Scopus dan ScienceDirect.

Investigasi ini menelusuri proporsi realisasi anggaran akademik tahun anggaran 2025/2026 serta menagih komitmen pimpinan universitas untuk memprioritaskan belanja pengetahuan dibanding infrastruktur fisik semata.`,
    coverImage: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&auto=format&fit=crop&q=80",
    authorId: "user-author-1",
    author: MOCK_USERS[1],
    categoryId: "cat-berita",
    category: MOCK_CATEGORIES[0],
    tags: [MOCK_TAGS[0], MOCK_TAGS[2], MOCK_TAGS[3]],
    status: "pending",
    createdAt: "2026-09-13T08:30:00Z",
    updatedAt: "2026-09-13T08:30:00Z",
    viewCount: 0,
    readTime: "5 menit baca",
  },
  {
    id: "post-pending-2",
    title: "Cerpen: Memoar Secangkir Kopi Pahit di Bawah Pohon Beringin Kampus",
    slug: "cerpen-memoar-secangkir-kopi-pahit",
    excerpt: "Kisah tentang persahabatan, ideologi masa muda, dan surat perpisahan yang tak sempat terkirim menjelang wisuda sarjana.",
    content: `Di bawah bayangan rindang pohon beringin tua dekat kantin barat, aroma sangrai kopi tubruk menyatu dengan harum rumput basah sisa hujan tengah hari. Gilang memutar-mutar sendok aluminiumnya tanpa berniat meminum kopi yang sudah mulai mendingin.

"Dua pekan lagi kita melangkah keluar gerbang ini dengan toga hitam, Lang. Apa kau yakin jalan yang kau pilih tak akan membuatmu berpaling dari apa yang kita perjuangkan di ruang-ruang rapat sekretariat?" tanya Danu memecah keheningan.`,
    coverImage: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&auto=format&fit=crop&q=80",
    authorId: "user-author-2",
    author: MOCK_USERS[2],
    categoryId: "cat-cerpen",
    category: MOCK_CATEGORIES[3],
    tags: [MOCK_TAGS[2], MOCK_TAGS[6]],
    status: "pending",
    createdAt: "2026-09-13T10:15:00Z",
    updatedAt: "2026-09-13T10:15:00Z",
    viewCount: 0,
    readTime: "4 menit baca",
  },
  // Naskah Draft milik Author Budi Santoso
  {
    id: "post-draft-1",
    title: "Draf Esai: Literasi Digital vs Wabah Judol di Kalangan Remaja Urban",
    slug: "draf-esai-literasi-digital-vs-judol",
    excerpt: "Analisis sosiologis fenomena penetrasi judi online yang menyasar mahasiswa dengan kedok game edukasi dan pinjol instan.",
    content: `Draft awal mengenai fenomena maraknya promosi terselubung di platform media sosial yang menyasar kalangan usia 18-24 tahun. Perlu melengkapi data statistik korban di wilayah Banyuwangi dan tanggapan dari pakar hukum siber.`,
    coverImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80",
    authorId: "user-author-1",
    author: MOCK_USERS[1],
    categoryId: "cat-opini",
    category: MOCK_CATEGORIES[1],
    tags: [MOCK_TAGS[2], MOCK_TAGS[4]],
    status: "draft",
    createdAt: "2026-09-12T16:00:00Z",
    updatedAt: "2026-09-13T11:00:00Z",
    viewCount: 0,
    readTime: "3 menit baca",
  },
  // Naskah Ditolak (Rejected) dengan Catatan Revisi Admin
  {
    id: "post-rejected-1",
    title: "Review Buku Sastra Klasik: Melacak Pesan Emansipasi Kartini di Era Modern",
    slug: "review-buku-sastra-kartini",
    excerpt: "Ulasan ringkas buku kumpulan surat Kartini dan relevansinya bagi kepemimpinan perempuan di organisasi mahasiswa.",
    content: `Surat-surat Kartini yang terhimpun dalam 'Habis Gelap Terbitlah Terang' bukan sekadar ratapan melankolis seorang putri bupati, melainkan cetak biru pemikiran kritis mengenai dekonstruksi feodalisme dan pentingnya hak pendidikan bagi kaum perempuan bumiputera.`,
    coverImage: "https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=1200&auto=format&fit=crop&q=80",
    authorId: "user-author-1",
    author: MOCK_USERS[1],
    categoryId: "cat-sastra",
    category: MOCK_CATEGORIES[2],
    tags: [MOCK_TAGS[2], MOCK_TAGS[6]],
    status: "rejected",
    createdAt: "2026-09-09T14:00:00Z",
    updatedAt: "2026-09-10T16:30:00Z",
    viewCount: 0,
    readTime: "3 menit baca",
    rejectionNote: "Naskah ulasan masih terlalu deskriptif dan belum memuat tinjauan kontekstual dengan isu perempuan di lingkungan kampus saat ini. Mohon perdalam bagian bab analisis dan tambahkan kutipan pembanding dari buku referensi lain sebelum mengirim ulang.",
  },
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: "comm-1",
    postId: "post-1",
    userId: "user-reader",
    userName: "Farhan Nurhadi",
    userAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
    content: "Selamat atas pelantikan pengurus baru UKM Pilar Bangsa! Semoga independensi jurnalisme kampus terus terjaga dan konsisten mengangkat isu-isu fasilitas mahasiswa yang jarang disorot dekanat.",
    createdAt: "2026-09-10T11:15:00Z",
    status: "visible",
    replies: [
      {
        id: "comm-1-reply-1",
        postId: "post-1",
        userId: "user-author-1",
        userName: "Budi Santoso",
        userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        content: "Terima kasih banyak Mas Farhan! Kami sangat terbuka jika rekan-rekan mahasiswa memiliki laporan awal atau informasi investigatif yang layak diangkat ke meja redaksi.",
        createdAt: "2026-09-10T13:40:00Z",
        status: "visible",
        parentId: "comm-1",
      },
    ],
  },
  {
    id: "comm-2",
    postId: "post-2",
    userId: "user-author-1",
    userName: "Budi Santoso",
    userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    content: "Poin mengenai 'melucuti otot intelektual' sangat mengena. Selama ini kita terlalu fokus pada hasil akhir makalah, padahal proses bergumul dengan literatur itulah esensi pendidikan tinggi yang sebenarnya.",
    createdAt: "2026-09-12T15:20:00Z",
    status: "visible",
    replies: [],
  },
];
