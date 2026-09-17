'use client';

import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle2, AlertTriangle, Send, Loader2, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { checkEmailConfigAction, sendTestEmailAction } from '@/actions/email-diagnostic';
import { usePortal } from '@/context/portal-context';

export function EmailDiagnosticCard() {
  const { showToast } = usePortal();
  const [config, setConfig] = useState<{
    isConfigured: boolean;
    apiKeyPreview: string | null;
    fromEmail: string;
    adminEmail: string;
    siteUrl: string;
  } | null>(null);

  const [loadingConfig, setLoadingConfig] = useState(true);
  const [targetEmail, setTargetEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message?: string;
    error?: string;
  } | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await checkEmailConfigAction();
        if (res?.config) {
          setConfig(res.config);
          setTargetEmail(res.config.adminEmail || 'ukmpilarbangsa@gmail.com');
        }
      } catch (err) {
        console.error('Failed to load email config:', err);
      } finally {
        setLoadingConfig(false);
      }
    }
    loadConfig();
  }, []);

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetEmail.trim()) {
      showToast('Masukkan alamat email tujuan uji coba.', 'warning');
      return;
    }

    setIsSending(true);
    setTestResult(null);

    try {
      const res = await sendTestEmailAction(targetEmail.trim());
      if (res?.error) {
        setTestResult({ success: false, error: res.error });
        showToast(res.error, 'error');
      } else if (res?.success) {
        setTestResult({ success: true, message: res.message });
        showToast('Email tes berhasil dikirim!', 'success');
      }
    } catch (err: any) {
      const msg = err?.message || 'Gagal mengirim email uji coba.';
      setTestResult({ success: false, error: msg });
      showToast(msg, 'error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs p-5 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-[#005AE0] border border-blue-100">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#111827]">
              Diagnostik & Uji Notifikasi Email (Resend)
            </h2>
            <p className="text-xs text-[#6B7280]">
              Verifikasi pengiriman email otomatis untuk registrasi Google, pengajuan naskah, dan kurasi redaksi.
            </p>
          </div>
        </div>

        {/* Status Badge */}
        {loadingConfig ? (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Memeriksa server...</span>
          </div>
        ) : config?.isConfigured ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Resend Siap ({config.apiKeyPreview})</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Kunci API Belum Disetel di Vercel</span>
          </span>
        )}
      </div>

      {/* Configuration Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-[#F8FAFC] p-3.5 rounded-xl border border-gray-200">
        <div>
          <span className="text-gray-500 block text-[11px]">Pengirim Resmi:</span>
          <span className="font-semibold text-gray-900 truncate block">
            {config?.fromEmail || 'Redaksi Pilar Bangsa <redaksi@mediapilarbangsa.web.id>'}
          </span>
        </div>
        <div>
          <span className="text-gray-500 block text-[11px]">Email Redaksi / Admin:</span>
          <span className="font-semibold text-gray-900 truncate block">
            {config?.adminEmail || 'ukmpilarbangsa@gmail.com'}
          </span>
        </div>
        <div>
          <span className="text-gray-500 block text-[11px]">Domain Website:</span>
          <span className="font-semibold text-gray-900 truncate block">
            {config?.siteUrl || 'https://www.mediapilarbangsa.web.id'}
          </span>
        </div>
      </div>

      {/* Test Form */}
      <form onSubmit={handleSendTest} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
        <div className="flex-1 relative">
          <input
            type="email"
            value={targetEmail}
            onChange={(e) => setTargetEmail(e.target.value)}
            placeholder="Masukkan email tujuan uji coba..."
            required
            className="w-full px-3.5 py-2 text-xs bg-white text-[#111827] rounded-xl border border-[#E5E7EB] focus:border-[#005AE0] focus:ring-1 focus:ring-[#005AE0] outline-none transition-all placeholder:text-gray-400"
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={isSending}
          className="gap-1.5 shrink-0"
        >
          {isSending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          <span>Kirim Email Tes</span>
        </Button>
      </form>

      {/* Test Result Message */}
      {testResult && (
        <div
          className={`p-3 rounded-xl border text-xs leading-relaxed ${
            testResult.success
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-red-50 border-red-200 text-red-900'
          }`}
        >
          <div className="flex items-start gap-2">
            {testResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <span className="font-bold block">
                {testResult.success ? 'Pengiriman Berhasil!' : 'Pengiriman Gagal!'}
              </span>
              <p>{testResult.message || testResult.error}</p>
              {testResult.success && (
                <p className="text-[11px] text-emerald-700 italic">
                  💡 Catatan: Jika email belum muncul di Inbox utama Gmail, harap periksa folder <strong>Spam</strong> atau tab <strong>Promotions</strong> dan klik &quot;Bukan Spam&quot;.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Collapsible Vercel Environment Variables Guide */}
      <div className="pt-2 border-t border-gray-100">
        <button
          type="button"
          onClick={() => setShowGuide(!showGuide)}
          className="text-xs font-semibold text-[#005AE0] hover:underline inline-flex items-center gap-1 cursor-pointer"
        >
          <Info className="w-3.5 h-3.5" />
          <span>Petunjuk Menyetel Environment Variables di Vercel Dashboard</span>
          {showGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showGuide && (
          <div className="mt-2.5 p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700 space-y-2.5">
            <p className="font-semibold text-gray-900">
              Langkah agar website live di Vercel dapat mengirim email:
            </p>
            <ol className="list-decimal pl-4 space-y-1.5 text-gray-600">
              <li>Buka dashboard Vercel Anda di <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-blue-600 underline font-medium">vercel.com</a>.</li>
              <li>Pilih project <strong>portalweb_pilarbangsa</strong> &gt; masuk tab <strong>Settings</strong> &gt; menu <strong>Environment Variables</strong>.</li>
              <li>Tambahkan 3 variabel berikut:
                <ul className="list-disc pl-4 mt-1 font-mono text-[11px] text-gray-800 space-y-0.5">
                  <li><strong className="text-blue-700">RESEND_API_KEY</strong> = <code className="bg-gray-200 px-1 rounded">re_xxxxxxxxxxxx (Salin dari akun resend.com Anda)</code></li>
                  <li><strong className="text-blue-700">RESEND_FROM_EMAIL</strong> = <code className="bg-gray-200 px-1 rounded">Redaksi Pilar Bangsa &lt;redaksi@mediapilarbangsa.web.id&gt;</code></li>
                  <li><strong className="text-blue-700">ADMIN_EMAIL</strong> = <code className="bg-gray-200 px-1 rounded">ukmpilarbangsa@gmail.com</code></li>
                </ul>
              </li>
              <li>Setelah menyimpan di Vercel, lakukan <strong>Redeploy</strong> (atau push commit baru) agar variabel aktif.</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
