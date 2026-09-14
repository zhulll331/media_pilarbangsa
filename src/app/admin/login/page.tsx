'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Lock, Mail, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMessage(error.message || 'Email atau kata sandi tidak sesuai.');
        setIsLoading(false);
        return;
      }

      if (!data.user) {
        setErrorMessage('Gagal memverifikasi akun.');
        setIsLoading(false);
        return;
      }

      // Verifikasi apakah user memiliki role 'admin'
      const { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profileErr || profile?.role !== 'admin') {
        // Bukan admin, paksa sign out
        await supabase.auth.signOut();
        setErrorMessage('Akses Ditolak: Akun Anda tidak memiliki hak administrator redaksi.');
        setIsLoading(false);
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Terjadi kesalahan sistem saat masuk.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors mb-6 px-4 sm:px-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda Publik</span>
        </Link>

        {/* Brand Header */}
        <div className="text-center px-4 sm:px-0">
          <div className="inline-flex items-center justify-center p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 mb-4">
            <ShieldCheck className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Panel Dewan Redaksi
          </h1>
          <p className="text-xs text-gray-400 mt-1.5">
            Media Karya Mahasiswa UNTAG Banyuwangi & UKM Pilar Bangsa
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-[#1E293B] py-8 px-6 shadow-xl rounded-2xl sm:px-10 border border-slate-700/60">
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/80 border border-red-700/60 flex items-start gap-2.5 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleAdminLogin}>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Email Administrator Redaksi
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ukmpilarbangsa@gmail.com"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900 text-sm text-white rounded-lg border border-slate-700 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all placeholder:text-gray-500"
                />
                <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-gray-300">
                  Kata Sandi
                </label>
                <Link
                  href="/auth/reset-password"
                  className="text-xs text-red-400 hover:text-red-300 hover:underline"
                >
                  Lupa sandi?
                </Link>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900 text-sm text-white rounded-lg border border-slate-700 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all placeholder:text-gray-500"
                />
                <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-lg transition-colors cursor-pointer"
            >
              {isLoading ? 'Memverifikasi...' : 'Masuk ke Dashboard Redaksi'}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-700/60 text-center">
            <p className="text-xs text-gray-400">
              Bukan pengelola redaksi?{' '}
              <Link href="/login" className="text-blue-400 hover:underline font-semibold">
                Masuk sebagai Penulis Mahasiswa
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
