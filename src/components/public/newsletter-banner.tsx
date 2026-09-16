"use client";

import React, { useState } from "react";
import { Mail, CheckCircle, ArrowRight } from "lucide-react";
import { usePortal } from "@/context/portal-context";
import { Button } from "@/components/ui/button";

export function NewsletterBanner() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { showToast } = usePortal();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      showToast("Mohon masukkan alamat email yang valid", "warning");
      return;
    }
    setSubscribed(true);
    showToast("Terima kasih! Anda telah terdaftar di buletin mingguan Pilar Bangsa.", "success");
    setEmail("");
  };

  return (
    <section id="newsletter" className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-[#F0F4F8] border border-[#E5E7EB] rounded-2xl sm:rounded-3xl p-6 sm:p-12 lg:p-16 relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl pointer-events-none opacity-60" />

          <div className="relative z-10 max-w-2xl mx-auto text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-[#005AE0] text-white flex items-center justify-center mb-4 shadow-md">
              <Mail className="w-6 h-6" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight mb-3">
              Jangan Lewatkan Warta Kritis Kampus
            </h2>

            <p className="text-sm sm:text-base text-[#6B7280] leading-relaxed mb-8 max-w-lg">
              Dapatkan rangkuman laporan investigasi terbaik, opini tajam mahasiswa, dan karya sastra pilihan langsung di kotak masuk Anda setiap akhir pekan.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 text-[#059669] bg-emerald-50 px-5 py-3 rounded-full border border-emerald-200">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-semibold">Anda telah berhasil berlangganan buletin Pilar Bangsa!</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col sm:flex-row gap-2.5">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan email universitas / pribadi..."
                  className="flex-1 px-4 py-3 bg-white text-sm text-[#111827] rounded-full border border-[#E5E7EB] focus:border-[#005AE0] focus:outline-none focus:ring-2 focus:ring-[#005AE0]/20 transition-all placeholder:text-[#6B7280]"
                  required
                />
                <Button variant="primary" size="md" type="submit" className="gap-2 shrink-0">
                  <span>Berlangganan</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </form>
            )}

            <p className="text-[11px] text-[#6B7280] mt-3">
              Bebas spam. Anda dapat berhenti berlangganan kapan saja dengan satu klik.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
