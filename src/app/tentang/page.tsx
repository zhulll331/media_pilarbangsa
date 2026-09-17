import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { TopUtilityBar } from "@/components/public/top-utility-bar";
import { Header } from "@/components/public/header";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { ChevronRight, Newspaper, Target, HeartHandshake, ShieldCheck, Mail, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Tentang Pilar Bangsa — Media Karya Mahasiswa UNTAG Banyuwangi",
  description:
    "Mengenal lebih dekat UKM Pilar Bangsa, wadah literasi, pers mahasiswa, dan publikasi karya civitas akademika Universitas 17 Agustus 1945 Banyuwangi.",
};

export default function AboutPage() {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-white">
      <TopUtilityBar />
      <Header />
      <Navbar />

      <main className="flex-1 py-10 sm:py-14">
        <div className="max-w-4xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-[#6B7280]">
            <Link href="/" className="hover:text-[#005AE0] transition-colors">Beranda</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="font-semibold text-[#111827]">Tentang Kami</span>
          </nav>

          {/* Header Banner */}
          <div className="bg-[#F0F4F8] border border-[#E5E7EB] rounded-2xl p-6 sm:p-10 mb-10">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#005AE0] mb-3">
              <Newspaper className="w-4 h-4" />
              <span>Profil Lembaga</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#111827] tracking-tight mb-4">
              Tentang Media Pilar Bangsa
            </h1>
            <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed">
              Unit Kegiatan Mahasiswa (UKM) Pilar Bangsa adalah wahana kreasi jurnalistik, nalar kritis, dan publikasi karya literasi terbuka seluruh mahasiswa Universitas 17 Agustus 1945 Banyuwangi.
            </p>
          </div>

          {/* Article / Narrative Content */}
          <article className="prose prose-slate max-w-none space-y-8 text-[#374151] leading-relaxed">
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-[#111827] mb-3">
                Latar Belakang & Filosofi
              </h2>
              <p className="mb-4">
                Didirikan di lingkungan kampus merah-putih Universitas 17 Agustus 1945 Banyuwangi, Pilar Bangsa lahir dari kesadaran bahwa mahasiswa bukan sekadar penikmat ilmu, melainkan produsen gagasan. Nama <strong>Pilar Bangsa</strong> menyimbolkan peran strategis pemuda dan kaum intelektual sebagai tiang penyangga kemajuan peradaban, kemerdekaan berpikir, dan integritas sosial.
              </p>
              <p>
                Melalui platform portal web ini, kami menghadirkan ruang yang setara bagi setiap mahasiswa untuk mempublikasikan berita independen seputar dinamika kampus, opini bernas, karya sastra (puisi, cerpen, esai), hingga dokumentasi visual.
              </p>
            </section>

            {/* Visi & Misi Card */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
              <div className="p-6 bg-blue-50/60 border border-blue-100 rounded-xl">
                <div className="flex items-center gap-2 font-bold text-[#005AE0] text-base mb-2">
                  <Target className="w-5 h-5" />
                  <span>Visi Kami</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Menjadi pilar media kampus yang independen, kritis, berakar pada kearifan lokal Banyuwangi, serta menjadi rujukan utama literasi mahasiswa yang bermartabat dan berwawasan kebangsaan.
                </p>
              </div>

              <div className="p-6 bg-emerald-50/60 border border-emerald-100 rounded-xl">
                <div className="flex items-center gap-2 font-bold text-emerald-700 text-base mb-2">
                  <ShieldCheck className="w-5 h-5" />
                  <span>Misi Kami</span>
                </div>
                <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside leading-relaxed">
                  <li>Menegakkan independensi dan etika jurnalisme pers mahasiswa.</li>
                  <li>Memfasilitasi publikasi karya tulis ilmiah populer, sastra, dan seni mahasiswa UNTAG Banyuwangi.</li>
                  <li>Membangun ekosistem literasi digital kampus yang produktif dan inklusif.</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-[#111827] mb-3">
                Rubrikasi & Platform Terbuka
              </h2>
              <p className="mb-4">
                Portal Pilar Bangsa mengusung konsep <em>open collaboration publishing</em>. Setiap civitas akademika UNTAG Banyuwangi dapat mendaftarkan diri menjadi kontributor naskah melalui fitur <strong>Author Studio</strong>. Redaksi bertindak sebagai kurator untuk menjamin akurasi data, keberimbangan perspektif, dan kesesuaian dengan Pedoman Pemberitaan Media Siber.
              </p>
            </section>

            {/* Hubungi Kami */}
            <section className="mt-12 p-6 sm:p-8 bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl">
              <h3 className="text-lg font-bold text-[#111827] mb-4 flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-[#005AE0]" />
                <span>Sekretariat & Alamat Redaksi</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-[#4B5563]">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#005AE0] shrink-0 mt-1" />
                  <div>
                    <span className="font-semibold text-[#111827] block mb-0.5">Gedung UKM Pilar Bangsa</span>
                    <span>Universitas 17 Agustus 1945 Banyuwangi<br />Jl. Adi Sucipto No. 26, Banyuwangi, Jawa Timur</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-[#005AE0] shrink-0 mt-1" />
                  <div>
                    <span className="font-semibold text-[#111827] block mb-0.5">Surat Elektronik (Email)</span>
                    <a href="mailto:ukmpilarbangsa@gmail.com" className="text-[#005AE0] hover:underline">
                      ukmpilarbangsa@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
