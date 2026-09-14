'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Sparkles, Shield, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const supabase = createClient();
      const redirectUrl = `${window.location.origin}/auth/callback`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setIsLoading(false);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Terjadi kesalahan saat menghubungkan ke Google.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#005AE0] hover:underline mb-6 px-4 sm:px-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Portal Berita</span>
        </Link>

        {/* Brand Header */}
        <div className="text-center px-4 sm:px-0">
          <div className="inline-flex items-center justify-center p-3.5 rounded-2xl bg-white shadow-xs border border-[#E2E8F0] mb-4">
            <img
              src="/images/logo_pilar.svg"
              alt="Logo Pilar Bangsa"
              className="w-12 h-12 object-contain"
            />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[#0F172A]">
            Ruang Penulis Mahasiswa
          </h1>
          <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed max-w-sm mx-auto">
            Media Karya Mahasiswa UNTAG Banyuwangi & UKM Pilar Bangsa
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-sm rounded-2xl sm:px-10 border border-[#E2E8F0]">
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="space-y-4 text-center">
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-left">
              <div className="flex items-center gap-2 text-xs font-bold text-[#005AE0] mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Masuk Cepat 1-Klik</span>
              </div>
              <p className="text-xs text-[#475569] leading-relaxed">
                Kirim opini, reportase, cerpen, puisi, atau esai Anda. Cukup gunakan akun Google Anda tanpa perlu mengingat kata sandi.
              </p>
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-gray-50 text-[#0F172A] text-sm font-bold rounded-xl border border-[#CBD5E1] shadow-2xs hover:shadow-xs transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isLoading ? 'Menghubungkan...' : 'Lanjutkan dengan Google'}</span>
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-[#F1F5F9] text-center space-y-3">
            <p className="text-xs text-[#94A3B8]">
              Profil penulis akan otomatis dibuat setelah Anda masuk untuk pertama kali.
            </p>
            <div>
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#0F172A] transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-gray-400" />
                <span>Panel Pengelola Redaksi &raquo;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
