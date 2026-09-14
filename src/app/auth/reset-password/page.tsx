'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, AlertCircle, CheckCircle } from 'lucide-react';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('idle');

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (error) {
        setStatus('error');
        setMessage(error.message);
      } else {
        setStatus('success');
        setMessage('Tautan pemulihan kata sandi telah dikirim ke email Anda. Silakan periksa kotak masuk atau spam.');
      }
    } catch (err: any) {
      setStatus('error');
      setMessage(err?.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link
          href="/admin/login"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#005AE0] hover:underline mb-6 px-4 sm:px-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Login Redaksi</span>
        </Link>

        <div className="text-center px-4 sm:px-0">
          <h1 className="text-2xl font-black tracking-tight text-[#0F172A]">
            Atur Ulang Kata Sandi
          </h1>
          <p className="text-xs text-[#64748B] mt-1.5">
            Masukkan email akun administrator redaksi Anda
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-sm rounded-2xl sm:px-10 border border-[#E2E8F0]">
          {status === 'error' && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{message}</span>
            </div>
          )}

          {status === 'success' ? (
            <div className="text-center space-y-4 py-3">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
              <p className="text-sm font-medium text-gray-800">{message}</p>
              <Link
                href="/admin/login"
                className="inline-block mt-2 text-xs font-bold text-[#005AE0] hover:underline"
              >
                Kembali ke Halaman Masuk
              </Link>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Akun Redaksi
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ukmpilarbangsa@gmail.com"
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-white text-sm text-[#0F172A] rounded-lg border border-[#CBD5E1] focus:border-[#005AE0] focus:outline-none focus:ring-2 focus:ring-[#005AE0]/20"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 bg-[#005AE0] hover:bg-[#0047b3] text-white font-bold py-2.5 rounded-lg transition-colors cursor-pointer"
              >
                {isLoading ? 'Mengirim...' : 'Kirim Tautan Pemulihan'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
