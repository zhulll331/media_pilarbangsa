import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { TopUtilityBar } from "@/components/public/top-utility-bar";
import { Header } from "@/components/public/header";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { ChevronRight, Users, Shield, Award, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Susunan Redaksi — Pilar Bangsa UNTAG Banyuwangi",
  description:
    "Struktur pengurus, dewan pertimbangan redaksi, dan tim kurator naskah media online UKM Pilar Bangsa Universitas 17 Agustus 1945 Banyuwangi.",
};

export default function EditorialBoardPage() {
  const editorialTeam = [
    {
      group: "Dewan Pelindung & Pembina",
      members: [
        { role: "Pelindung", name: "Rektor Universitas 17 Agustus 1945 Banyuwangi" },
        { role: "Penasihat Kelembagaan", name: "Wakil Rektor III Bidang Kemahasiswaan UNTAG Banyuwangi" },
        { role: "Pembina Teknis UKM", name: "Pembina UKM Pilar Bangsa" },
      ],
    },
    {
      group: "Pimpinan Redaksi & Manajemen",
      members: [
        { role: "Pemimpin Umum", name: "Ketua Umum UKM Pilar Bangsa" },
        { role: "Pemimpin Redaksi", name: "M. Firdaus Zulfa (Redaktur Utama)" },
        { role: "Sekretaris Redaksi", name: "Tim Sekretariat UKM Pilar Bangsa" },
        { role: "Bendahara & Sirkulasi", name: "Divisi Keuangan & Sponsorship" },
      ],
    },
    {
      group: "Redaktur Rubrikasi & Kurator",
      members: [
        { role: "Redaktur Berita & Warta UKM", name: "Divisi Liputan & Jurnalistik Kampus" },
        { role: "Redaktur Opini & Riset", name: "Divisi Nalar Kritis & Kajian Mahasiswa" },
        { role: "Redaktur Sastra, Cerpen & Puisi", name: "Divisi Literasi & Kebudayaan" },
        { role: "Redaktur Multimedia & Galeri", name: "Divisi Fotografi & Desain Grafis" },
      ],
    },
    {
      group: "Teknologi Informasi & Distribusi",
      members: [
        { role: "Arsitek Web & Infrastruktur", name: "Tim IT & Pengembang Portal Pilar Bangsa" },
        { role: "Media Sosial & Komunikasi", name: "Humas & Publikasi Digital" },
      ],
    },
  ];

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
            <span className="font-semibold text-[#111827]">Susunan Redaksi</span>
          </nav>

          {/* Banner */}
          <div className="bg-[#F0F4F8] border border-[#E5E7EB] rounded-2xl p-6 sm:p-10 mb-10">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#005AE0] mb-3">
              <Users className="w-4 h-4" />
              <span>Struktur Redaksi 2026</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#111827] tracking-tight mb-4">
              Dewan & Pengelola Redaksi
            </h1>
            <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed">
              Kolektivitas pengelola media pers mahasiswa Universitas 17 Agustus 1945 Banyuwangi yang berdedikasi menjaga integritas jurnalisme dan mutu literasi kampus.
            </p>
          </div>

          {/* Editorial Structure List */}
          <div className="space-y-8">
            {editorialTeam.map((section, idx) => (
              <div key={idx} className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-2xs">
                <h2 className="text-lg font-bold text-[#111827] pb-4 border-b border-gray-100 mb-6 flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#005AE0]" />
                  <span>{section.group}</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {section.members.map((member, mIdx) => (
                    <div key={mIdx} className="p-4 rounded-xl bg-gray-50/70 border border-gray-100">
                      <span className="text-xs font-semibold text-[#005AE0] uppercase tracking-wider block mb-1">
                        {member.role}
                      </span>
                      <span className="text-sm font-bold text-[#111827] block">
                        {member.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Disclaimer & Notice */}
          <div className="mt-10 p-6 bg-blue-50/60 border border-blue-100 rounded-2xl text-sm text-gray-700 leading-relaxed">
            <div className="flex items-center gap-2 font-bold text-[#005AE0] mb-2">
              <Shield className="w-4 h-4" />
              <span>Etika & Transparansi Redaksi</span>
            </div>
            <p>
              Wartawan dan kontributor Pilar Bangsa selalu dibekali tanda pengenal pers mahasiswa resmi saat bertugas. Seluruh tim dilarang menerima gratifikasi dalam bentuk apa pun yang dapat memengaruhi objektivitas pemberitaan.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
