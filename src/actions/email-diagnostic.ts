'use server';

import { createClient } from '@/lib/supabase/server';
import { getResendClient, checkEmailConfiguration, FROM_EMAIL, ADMIN_EMAIL, SITE_URL } from '@/lib/email/resend';

/**
 * Memeriksa status kesiapan konfigurasi email server (khusus admin).
 */
export async function checkEmailConfigAction() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Harap masuk terlebih dahulu.' };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return { error: 'Akses terbatas untuk Redaksi/Admin.' };
  }

  const config = checkEmailConfiguration();
  return { config };
}

/**
 * Mengirim email uji coba langsung dari panel admin untuk verifikasi pengiriman.
 */
export async function sendTestEmailAction(targetEmail: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Harap masuk terlebih dahulu.' };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return { error: 'Hanya Redaksi yang dapat menjalankan uji kirim email.' };
  }

  const destination = (targetEmail || '').trim();
  if (!destination || !destination.includes('@')) {
    return { error: 'Alamat email tujuan tidak valid.' };
  }

  const resend = getResendClient();
  if (!resend) {
    return {
      error:
        'RESEND_API_KEY belum disetel di Environment Variables server (Vercel). Harap tambahkan RESEND_API_KEY di dashboard Vercel.',
    };
  }

  try {
    const timestamp = new Date().toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta',
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    const res = await resend.emails.send({
      from: FROM_EMAIL,
      to: destination,
      subject: `[Uji Coba] Tes Pengiriman Email Portal Pilar Bangsa (${timestamp})`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <div style="border-bottom: 2px solid #005AE0; padding-bottom: 12px; margin-bottom: 20px;">
            <h3 style="color: #005AE0; margin: 0; font-size: 18px; font-weight: 800;">PORTAL MEDIA UKM PILAR BANGSA</h3>
            <p style="margin: 4px 0 0 0; color: #64748b; font-size: 12px;">Pusat Diagnostik Sistem Notifikasi</p>
          </div>
          <h2 style="color: #059669; margin-top: 0; font-size: 18px;">✅ Konfigurasi Email Berfungsi Sempurna!</h2>
          <p>Halo Administrator / Penguji,</p>
          <p>Pesan ini mengonfirmasi bahwa <strong>Resend Email Service</strong> dan domain <strong>mediapilarbangsa.web.id</strong> telah terhubung dengan baik di lingkungan server.</p>
          <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0; border: 1px solid #e2e8f0; font-size: 13px;">
            <p style="margin: 0 0 6px 0;"><strong>Pengirim Resmi:</strong> ${FROM_EMAIL}</p>
            <p style="margin: 0 0 6px 0;"><strong>Tujuan Uji:</strong> ${destination}</p>
            <p style="margin: 0 0 6px 0;"><strong>Email Admin:</strong> ${ADMIN_EMAIL}</p>
            <p style="margin: 0 0 6px 0;"><strong>Waktu Pengiriman:</strong> ${timestamp} WIB</p>
            <p style="margin: 0;"><strong>URL Publik:</strong> ${SITE_URL}</p>
          </div>
          <p style="font-size: 13px; color: #475569;">
            Seluruh alur notifikasi otomatis (sambutan akun Google baru, konfirmasi submit naskah, notifikasi persetujuan/terbit, dan revisi naskah) siap melayani mahasiswa dan redaksi.
          </p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 11px; color: #94a3b8; margin: 0;">Media Karya Mahasiswa UNTAG Banyuwangi & UKM Pilar Bangsa</p>
        </div>
      `,
    });

    if (res?.error) {
      console.error('[DIAGNOSTIK] Resend API error:', res.error);
      return {
        error: `Gagal dari Resend: ${res.error.message} (Nama error: ${res.error.name})`,
      };
    }

    return {
      success: true,
      messageId: res?.data?.id,
      message: `Email uji coba berhasil dikirim ke ${destination}! Resend ID: ${res?.data?.id}`,
    };
  } catch (error: any) {
    console.error('[DIAGNOSTIK] Exception:', error);
    return {
      error: error?.message || 'Terjadi kesalahan sistem saat mengirim email uji coba.',
    };
  }
}
