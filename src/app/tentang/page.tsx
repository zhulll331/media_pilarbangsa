import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { TopUtilityBar } from "@/components/public/top-utility-bar";
import { Header } from "@/components/public/header";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import {
  ChevronRight,
  Milestone,
  CheckCircle2,
  Shield,
  BookOpen,
  Anchor,
  Users,
  Search,
  Heart,
  TrendingUp,
  Award,
  Globe,
  Newspaper,
  Mail,
  MapPin,
  ArrowUpRight,
  Calendar,
  Sparkles,
} from "lucide-react";
import { InstagramIcon } from "@/components/ui/social-icons";

export const metadata: Metadata = {
  title: "Tentang UKM Pilar Bangsa — Media Karya Mahasiswa UNTAG Banyuwangi",
  description:
    "Mengenal profil, sejarah berdiri sejak 20 April 2021, transformasi digital, serta filosofi logo UKM Pilar Bangsa Universitas 17 Agustus 1945 Banyuwangi.",
};

export default function AboutPage() {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F8FAFC]">
      <TopUtilityBar />
      <Header />
      <Navbar />

      <main className="flex-1 py-10 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-16">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#6B7280]">
            <Link href="/" className="hover:text-[#005AE0] transition-colors">
              Beranda
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="font-semibold text-[#111827]">Tentang Pilar Bangsa</span>
          </nav>

          {/* Hero Banner */}
          <section className="bg-gradient-to-br from-[#0B172A] via-[#0D254C] to-[#0B172A] text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#E31837] via-[#005AE0] to-[#FFD700]" />
            <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-[#005AE0]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-3xl relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-blue-200 border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Profil & Arah Juang Lembaga</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
                Mengenal Lebih Dekat UKM Pilar Bangsa
              </h1>

              <p className="text-base sm:text-xl text-gray-300 leading-relaxed">
                Unit Kegiatan Mahasiswa Universitas 17 Agustus 1945 Banyuwangi sebagai wadah pembinaan kepemimpinan, nalar kritis, jurnalisme pers mahasiswa, dan keterbukaan karya berlandaskan semangat kebangsaan.
              </p>

              {/* Quick Highlight Pills */}
              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold">
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 text-white border border-white/10">
                  <Calendar className="w-4 h-4 text-[#38BDF8]" />
                  <span>Berdiri: 20 April 2021</span>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 text-white border border-white/10">
                  <Globe className="w-4 h-4 text-[#38BDF8]" />
                  <span>Transformasi Digital: 2026/2027</span>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 text-white border border-white/10">
                  <Newspaper className="w-4 h-4 text-[#38BDF8]" />
                  <span>Kampus UNTAG Banyuwangi</span>
                </div>
              </div>
            </div>
          </section>

          {/* Sejarah & Transformasi Digital */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-[#005AE0] text-xs font-bold tracking-wider uppercase border border-blue-100">
                <Milestone className="w-4 h-4" />
                <span>Titik Mula Sejarah</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-snug">
                Berdiri Sejak 20 April 2021, Bertransformasi Digital pada Periode 2026/2027
              </h2>

              <p className="text-gray-700 leading-relaxed text-base">
                UKM Pilar Bangsa lahir dari sebuah refleksi mendalam para aktivis mahasiswa Universitas 17 Agustus 1945 Banyuwangi pada tanggal <strong className="text-gray-900 font-bold">20 April 2021</strong>. Berangkat dari semangat juang untuk menghadirkan wadah organisasi kemahasiswaan yang progresif, independen, dan berakar pada nilai-nilai luhur kebangsaan.
              </p>

              <div className="bg-white p-6 rounded-2xl border-l-4 border-[#005AE0] shadow-xs space-y-2">
                <strong className="text-gray-900 block font-bold text-sm">
                  Lompatan Digitalisasi Tata Kelola & Literasi Kampus
                </strong>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Pada periode 2026/2027, UKM Pilar Bangsa merealisasikan Misi ke-2 Kepengurusan dengan membangun ekosistem digital terpadu: platform <strong className="text-gray-900">Pilar Digital Office</strong> untuk tata kelola administrasi transparan, serta <strong className="text-gray-900">Portal Media Pilar Bangsa</strong> sebagai etalase publikasi warta independen dan karya kreatif mahasiswa terbuka.
                </p>
              </div>
            </div>

            {/* 3 Tonggak Komitmen */}
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-200 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">
                Tonggak Komitmen Organisasi
              </h3>

              <ul className="space-y-5">
                <li className="flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-blue-50 text-[#005AE0] shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-gray-900 block text-sm font-bold">Digitalisasi Tata Kelola</strong>
                    <span className="text-gray-600 text-sm leading-relaxed">
                      Mengembangkan sistem berbasis teknologi modern untuk memastikan efektivitas kepengurusan dan kemudahan arsip.
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-gray-900 block text-sm font-bold">Transparansi Nyata</strong>
                    <span className="text-gray-600 text-sm leading-relaxed">
                      Masyarakat kampus dapat memantau secara terbuka pelaksanaan program kerja dan akuntabilitas kelembagaan.
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-600 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-gray-900 block text-sm font-bold">Pengkaderan & Literasi Kritis</strong>
                    <span className="text-gray-600 text-sm leading-relaxed">
                      Mencetak calon pemimpin masa depan yang literat, berintegritas moral tinggi, dan berdaya saing global.
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* Filosofi Logo Section */}
          <section className="bg-white rounded-3xl p-8 sm:p-14 border border-gray-200 shadow-sm space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-3xl bg-[#0B172A] shadow-xl">
                  <img
                    src="/images/logo_pilar.svg"
                    alt="Logo UKM Pilar Bangsa"
                    className="w-24 h-24 sm:w-28 sm:h-28 object-contain brightness-125"
                  />
                </div>
              </div>

              <div className="inline-block px-4 py-1.5 rounded-full text-xs font-extrabold tracking-widest uppercase bg-[#005AE0] text-white shadow-xs">
                Makna Simbolis
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                Filosofi Logo UKM Pilar Bangsa
              </h2>

              <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                Logo UKM Pilar Bangsa menggambarkan fondasi kebangsaan yang kokoh, semangat Tri Dharma Perguruan Tinggi, serta cita-cita luhur Trisakti Bung Karno untuk mewujudkan bangsa yang berdaulat, berdikari, dan berkepribadian.
              </p>
            </div>

            {/* 3 Pillars of Philosophy */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* 01: 4 Pondasi Kebangsaan */}
              <div className="bg-[#F8FAFC] rounded-3xl border border-gray-200 p-7 flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-[#005AE0] transition-colors">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 border-b border-gray-200 pb-5">
                    <div className="w-12 h-12 rounded-2xl bg-[#005AE0] text-white flex items-center justify-center font-black text-xl shadow-md">
                      01
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-gray-900 tracking-tight">4 PONDASI</h3>
                      <p className="text-[#005AE0] font-bold text-xs uppercase tracking-wider">Fondasi Kebangsaan</p>
                    </div>
                  </div>

                  <div className="space-y-4 text-sm">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-[#005AE0] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-gray-900 block font-bold">Pancasila</strong>
                        <span className="text-gray-600 text-xs leading-relaxed">Dasar negara dan ideologi luhur bangsa Indonesia.</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <BookOpen className="w-5 h-5 text-[#005AE0] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-gray-900 block font-bold">UUD 1945</strong>
                        <span className="text-gray-600 text-xs leading-relaxed">Konstitusi negara sebagai pedoman kehidupan berbangsa.</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Anchor className="w-5 h-5 text-[#005AE0] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-gray-900 block font-bold">NKRI</strong>
                        <span className="text-gray-600 text-xs leading-relaxed">Bentuk negara kesatuan yang menyatukan seluruh rakyat.</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-[#005AE0] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-gray-900 block font-bold">Bhinneka Tunggal Ika</strong>
                        <span className="text-gray-600 text-xs leading-relaxed">Semboyan persatuan dalam keberagaman suku, ras, dan agama.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 02: 3 Pilar Tri Dharma */}
              <div className="bg-[#F8FAFC] rounded-3xl border border-gray-200 p-7 flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-[#F59E0B] transition-colors">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 border-b border-gray-200 pb-5">
                    <div className="w-12 h-12 rounded-2xl bg-[#F59E0B] text-white flex items-center justify-center font-black text-xl shadow-md">
                      02
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-gray-900 tracking-tight">3 PILAR</h3>
                      <p className="text-amber-600 font-bold text-xs uppercase tracking-wider">Tri Dharma Perguruan Tinggi</p>
                    </div>
                  </div>

                  <div className="space-y-4 text-sm">
                    <div className="flex items-start gap-3">
                      <BookOpen className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-gray-900 block font-bold">Pembelajaran (Pendidikan)</strong>
                        <span className="text-gray-600 text-xs leading-relaxed">Proses edukasi intensif guna mengembangkan intelektual dan integritas.</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Search className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-gray-900 block font-bold">Penelitian (Riset & Nalar)</strong>
                        <span className="text-gray-600 text-xs leading-relaxed">Aktivitas riset ilmiah guna menemukan inovasi dan verifikasi fakta.</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Heart className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-gray-900 block font-bold">Pengabdian Masyarakat</strong>
                        <span className="text-gray-600 text-xs leading-relaxed">Aksi nyata mahasiswa menghadirkan kontribusi sosial di Banyuwangi.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 03: Atap Segitiga Trisakti */}
              <div className="bg-[#F8FAFC] rounded-3xl border border-gray-200 p-7 flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-[#10B981] transition-colors">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 border-b border-gray-200 pb-5">
                    <div className="w-12 h-12 rounded-2xl bg-[#10B981] text-white flex items-center justify-center font-black text-xl shadow-md">
                      03
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-gray-900 tracking-tight">ATAP SEGITIGA</h3>
                      <p className="text-emerald-600 font-bold text-xs uppercase tracking-wider">Trisakti Sukarno</p>
                    </div>
                  </div>

                  <div className="space-y-4 text-sm">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-gray-900 block font-bold">Berdaulat dalam Politik</strong>
                        <span className="text-gray-600 text-xs leading-relaxed">Menjadi agen kontrol sosial yang kritis, berani, dan independen.</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-gray-900 block font-bold">Berdikari dalam Ekonomi</strong>
                        <span className="text-gray-600 text-xs leading-relaxed">Kemandirian pengelolaan karya, produktivitas, dan etos kerja luhur.</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-gray-900 block font-bold">Berkepribadian dalam Budaya</strong>
                        <span className="text-gray-600 text-xs leading-relaxed">Merawat kearifan lokal sastra & budaya khas Nusantara dan Banyuwangi.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Kesatuan Makna */}
            <div className="border-t border-gray-200 pt-8 text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#005AE0]">
                Satu Kesatuan Harmonis
              </span>
              <p className="text-gray-800 text-base sm:text-lg font-medium leading-relaxed italic">
                &ldquo;Empat pondasi kebangsaan menjadi dasar yang kokoh, tiga pilar Tri Dharma menjadi gerakan, dan Trisakti Sukarno menjadi cita luhur yang menaungi setiap langkah juang UKM Pilar Bangsa.&rdquo;
              </p>
            </div>
          </section>

          {/* Dua Portal Resmi UKM Pilar Bangsa */}
          <section className="space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Ekosistem Digital UKM Pilar Bangsa
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Dua platform resmi yang saling terintegrasi dalam menunjang transparansi serta publikasi karya mahasiswa:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Platform 1: Digital Office */}
              <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xs flex flex-col justify-between space-y-6 hover:shadow-md transition-shadow">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center font-bold">
                    🏛️
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Pilar Digital Office</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Situs resmi profil organisasi, transparansi program kerja, arsip kelembagaan, serta portal administrasi pengurus UKM Pilar Bangsa.
                  </p>
                </div>
                <div>
                  <a
                    href="https://pilarbangsa.my.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#005AE0] hover:underline"
                  >
                    <span>Kunjungi pilarbangsa.my.id</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Platform 2: Portal Media Karya */}
              <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xs flex flex-col justify-between space-y-6 hover:shadow-md transition-shadow">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#005AE0] text-white flex items-center justify-center font-bold">
                    📰
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Portal Media Mahasiswa</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Media publikasi karya terbuka civitas akademika UNTAG Banyuwangi: berita kampus, opini mahasiswa, sastra, cerpen, puisi, dan galeri visual.
                  </p>
                </div>
                <div>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#005AE0] hover:underline"
                  >
                    <span>Jelajahi Beranda Media</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Sekretariat & Kontak */}
          <section className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-200 shadow-xs space-y-6">
            <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">
              Sekretariat & Saluran Komunikasi
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#005AE0] shrink-0 mt-1" />
                <div>
                  <strong className="text-gray-900 block font-bold mb-1">Sekretariat UKM Pilar Bangsa</strong>
                  <p className="text-gray-600 leading-relaxed">
                    Gedung UKM Universitas 17 Agustus 1945 Banyuwangi<br />
                    Jalan Laksda Adi Sucipto, Taman Baru, Kec. Banyuwangi, Kabupaten Banyuwangi, Jawa Timur 68416
                  </p>
                  <a
                    href="https://maps.app.goo.gl/Kqw7VtiUXvSuqFFS6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-xs font-semibold text-[#005AE0] hover:underline"
                  >
                    📍 Buka Petunjuk Arah di Google Maps &raquo;
                  </a>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#005AE0] shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900 block font-bold mb-0.5">Surat Elektronik (Email)</strong>
                    <a href="mailto:ukmpilarbangsa@gmail.com" className="text-[#005AE0] hover:underline">
                      ukmpilarbangsa@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <InstagramIcon className="w-5 h-5 text-[#E1306C] shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900 block font-bold mb-0.5">Instagram Resmi</strong>
                    <a
                      href="https://www.instagram.com/ukmpilarbangsa?igsh=MWxtOHlhaGlrczNl"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-[#E1306C]"
                    >
                      @ukmpilarbangsa
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
