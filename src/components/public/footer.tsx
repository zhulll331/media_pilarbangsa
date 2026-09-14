import React from "react";
import Link from "next/link";
import { Rss, Mail, MapPin, Phone, ArrowUpRight } from "lucide-react";
import { InstagramIcon, YoutubeIcon, FacebookIcon } from "@/components/ui/social-icons";

export function Footer() {
  return (
    <footer className="bg-[#0B172A] text-white pt-14 pb-8 border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Col 1 & 2: Brand Profile */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/images/logo_pilar.svg"
                alt="Logo Pilar Bangsa"
                className="w-10 h-10 object-contain brightness-125"
              />
              <span className="font-bold text-xl tracking-tight text-white">
                PILAR BANGSA
              </span>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed mb-6 max-w-sm">
              Media Karya Mahasiswa Universitas 17 Agustus 1945 Banyuwangi bersama UKM Pilar Bangsa. 
              Wadah publikasi terbuka bagi seluruh mahasiswa dalam merawat nalar kritis, 
              menyuarakan gagasan, dan mengeksplorasi karya sastra kampus.
            </p>

            <div className="space-y-2 text-xs text-gray-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#005AE0] shrink-0 mt-0.5" />
                <span>Gedung UKM Pilar Bangsa, Kampus UNTAG Banyuwangi, Jl. Adi Sucipto No. 26, Banyuwangi, Jawa Timur</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#005AE0] shrink-0" />
                <a href="mailto:ukmpilarbangsa@gmail.com" className="hover:text-white transition-colors">
                  ukmpilarbangsa@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Col 3: Rubrik Editorial */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Rubrik Portal
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li>
                <Link href="/kategori/berita-kampus" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Berita Kampus</span>
                </Link>
              </li>
              <li>
                <Link href="/kategori/opini" className="hover:text-white transition-colors">
                  Opini & Gagasan
                </Link>
              </li>
              <li>
                <Link href="/kategori/sastra" className="hover:text-white transition-colors">
                  Sastra & Budaya
                </Link>
              </li>
              <li>
                <Link href="/kategori/cerpen" className="hover:text-white transition-colors">
                  Cerita Pendek
                </Link>
              </li>
              <li>
                <Link href="/kategori/puisi" className="hover:text-white transition-colors">
                  Antologi Puisi
                </Link>
              </li>
              <li>
                <Link href="/kategori/galeri" className="hover:text-white transition-colors">
                  Esai Foto & Galeri
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Informasi & Redaksi */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Kelembagaan
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li>
                <Link href="/tentang" className="hover:text-white transition-colors">
                  Tentang Pilar Bangsa
                </Link>
              </li>
              <li>
                <Link href="/redaksi" className="hover:text-white transition-colors">
                  Susunan Redaksi 2026
                </Link>
              </li>
              <li>
                <Link href="/pedoman-media-siber" className="hover:text-white transition-colors">
                  Kode Etik & Pedoman
                </Link>
              </li>
              <li>
                <Link href="/author/tulis" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Kirim Naskah Mahasiswa</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#005AE0]" />
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Portal Author & Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Sindikasi & Afiliasi */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Sindikasi & Afiliasi
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed mb-4">
              Portal berita ini terindeks secara berkala dan menyediakan saluran sindikasi konten terbuka untuk civitas akademika.
            </p>

            <Link
              href="/feed.xml"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors mb-4"
            >
              <Rss className="w-3.5 h-3.5 text-amber-400" />
              <span>RSS Feed (/feed.xml)</span>
            </Link>

            <div className="pt-2">
              <div className="flex items-center gap-2.5 text-gray-300">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-[#005AE0] hover:text-white transition-colors" aria-label="Instagram">
                  <InstagramIcon className="w-4 h-4" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-[#005AE0] hover:text-white transition-colors" aria-label="YouTube">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-[#005AE0] hover:text-white transition-colors" aria-label="Facebook">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-300">
          <p>© 2026 Media Karya Mahasiswa UNTAG Banyuwangi & UKM Pilar Bangsa. Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-4">
            <span>Wadah karya & aspirasi terbuka seluruh mahasiswa</span>
            <span>•</span>
            <Link href="/admin" className="text-gray-300 hover:text-white underline">
              Tim Editorial & Redaksi
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
