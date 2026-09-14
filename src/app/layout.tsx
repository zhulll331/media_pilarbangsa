import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PortalProvider } from "@/context/portal-context";
import { ToastContainer } from "@/components/ui/toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pilar Bangsa — Media Karya Mahasiswa UNTAG Banyuwangi & UKM Pilar Bangsa",
  description:
    "Portal publikasi karya tulis, opini, berita, dan sastra terbuka untuk seluruh mahasiswa Universitas 17 Agustus 1945 Banyuwangi bersama UKM Pilar Bangsa.",
  keywords: [
    "Pilar Bangsa",
    "Media Karya Mahasiswa",
    "UNTAG Banyuwangi",
    "Universitas 17 Agustus 1945 Banyuwangi",
    "Opini Mahasiswa",
    "Karya Sastra",
    "Cerpen",
    "Puisi",
    "Literasi Kampus",
  ],
  authors: [{ name: "Redaksi UKM Pilar Bangsa UNTAG Banyuwangi" }],
  openGraph: {
    title: "Pilar Bangsa — Media Karya Mahasiswa UNTAG Banyuwangi & UKM Pilar Bangsa",
    description:
      "Wadah aspirasi kreatif, nalar kritis, dan publikasi karya terbuka seluruh mahasiswa Universitas 17 Agustus 1945 Banyuwangi.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-[#111827]">
        <PortalProvider>
          <div className="flex-1 flex flex-col">{children}</div>
          <ToastContainer />
        </PortalProvider>
      </body>
    </html>
  );
}
