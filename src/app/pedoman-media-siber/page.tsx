import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { TopUtilityBar } from "@/components/public/top-utility-bar";
import { Header } from "@/components/public/header";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { ChevronRight, FileText, Scale, CheckCircle2, AlertCircle, RefreshCw, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Pedoman Pemberitaan Media Siber — Pilar Bangsa UNTAG Banyuwangi",
  description:
    "Pedoman pemberitaan media siber, kode etik jurnalistik mahasiswa, serta mekanisme hak jawab dan ralat pada portal media Pilar Bangsa.",
};

export default function CyberMediaGuidelinesPage() {
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
            <span className="font-semibold text-[#111827]">Pedoman Media Siber</span>
          </nav>

          {/* Banner */}
          <div className="bg-[#F0F4F8] border border-[#E5E7EB] rounded-2xl p-6 sm:p-10 mb-10">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#005AE0] mb-3">
              <Scale className="w-4 h-4" />
              <span>Standar Etika & Regulasi</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#111827] tracking-tight mb-4">
              Pedoman Pemberitaan Media Siber
            </h1>
            <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed">
              Komitmen integritas portal media Pilar Bangsa UNTAG Banyuwangi dalam menjalankan jurnalisme kampus yang akurat, berimbang, bertanggung jawab, dan patuh pada kaidah Dewan Pers.
            </p>
          </div>

          {/* Guidelines Body */}
          <div className="space-y-8 text-[#374151] leading-relaxed text-sm sm:text-base">
            <section className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8">
              <h2 className="text-lg font-bold text-[#111827] mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#005AE0]" />
                <span>1. Ruang Lingkup & Kemerdekaan Pers Mahasiswa</span>
              </h2>
              <p className="mb-3 text-gray-600">
                Media Siber Pilar Bangsa adalah wadah publikasi pers mahasiswa dan karya civitas akademika UNTAG Banyuwangi yang beroperasi dengan menjunjung tinggi asas praduga tak bersalah, kebebasan berekspresi secara ilmiah, serta nilai-nilai demokrasi kebangsaan.
              </p>
            </section>

            <section className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8">
              <h2 className="text-lg font-bold text-[#111827] mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#005AE0]" />
                <span>2. Verifikasi dan Keberimbangan Berita</span>
              </h2>
              <ul className="space-y-2 text-gray-600 list-disc list-inside">
                <li>Setiap naskah berita wajib melalui tahap verifikasi fakta dan konfirmasi dari pihak terkait (*cover both sides*).</li>
                <li>Pernyataan yang bersifat menghakimi (*trial by the press*) atau tuduhan tanpa dasar dilarang dimuat.</li>
                <li>Penulisan opini mahasiswa mencerminkan pandangan pribadi penulis dengan argumentasi ilmiah dan data yang dapat dipertanggungjawabkan.</li>
              </ul>
            </section>

            <section className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8">
              <h2 className="text-lg font-bold text-[#111827] mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#005AE0]" />
                <span>3. Konten Buatan Pengguna (Kirim Naskah Mahasiswa)</span>
              </h2>
              <p className="mb-3 text-gray-600">
                Pilar Bangsa menyediakan ruang kirim tulisan bagi mahasiswa. Redaksi berhak menyunting judul, tata bahasa, dan memvalidasi keaslian naskah tanpa mengubah substansi pokok gagasan. Naskah yang mengandung plagiarisme, ujaran kebencian (SARA), fitnah, atau pornografi akan ditolak secara mutlak.
              </p>
            </section>

            <section className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8">
              <h2 className="text-lg font-bold text-[#111827] mb-3 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-[#005AE0]" />
                <span>4. Hak Jawab, Hak Koreksi, dan Ralat</span>
              </h2>
              <p className="mb-3 text-gray-600">
                Pihak yang merasa dirugikan oleh suatu pemberitaan berhak mengajukan Hak Jawab atau Hak Koreksi. Redaksi akan segera menindaklanjuti permohonan tersebut secara proporsional dengan menyematkan catatan koreksi pada artikel terkait dalam kurun waktu 1x24 jam setelah verifikasi.
              </p>
            </section>

            <section className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8">
              <h2 className="text-lg font-bold text-[#111827] mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-[#005AE0]" />
                <span>5. Saluran Aduan Redaksi</span>
              </h2>
              <p className="text-gray-600 mb-4">
                Segala bentuk pengaduan mengenai konten, pelanggaran hak cipta foto/karya, atau klarifikasi fakta dapat disampaikan secara resmi kepada dewan redaksi:
              </p>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 inline-flex items-center gap-2 text-sm text-[#111827]">
                <Mail className="w-4 h-4 text-[#005AE0]" />
                <span className="font-semibold">Email Pengaduan:</span>
                <a href="mailto:ukmpilarbangsa@gmail.com" className="text-[#005AE0] hover:underline font-medium">
                  ukmpilarbangsa@gmail.com
                </a>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
