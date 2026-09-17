import { getResendClient, FROM_EMAIL, ADMIN_EMAIL, SITE_URL } from './resend';

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Notifikasi ke Redaksi UKM Pilar Bangsa saat ada naskah baru yang diajukan.
 */
export async function sendNewSubmissionEmailToAdmin(params: {
  postTitle: string;
  authorName: string;
  categoryName?: string;
  postId: string;
}): Promise<EmailResult> {
  const resend = getResendClient();
  if (!resend) {
    console.warn('[EMAIL] RESEND_API_KEY belum disetel di server, pengiriman email ke redaksi dilewati.');
    return { success: false, error: 'RESEND_API_KEY belum disetel di Environment Variables server.' };
  }

  try {
    const adminUrl = `${SITE_URL}/admin`;
    const res = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `[Pilar Bangsa] Naskah Baru Masuk: "${params.postTitle}"`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <div style="border-bottom: 2px solid #005AE0; padding-bottom: 12px; margin-bottom: 20px;">
            <h3 style="color: #005AE0; margin: 0; font-size: 18px; font-weight: 800; letter-spacing: -0.02em;">PORTAL MEDIA UKM PILAR BANGSA</h3>
            <p style="margin: 4px 0 0 0; color: #64748b; font-size: 12px;">Media Karya Mahasiswa UNTAG Banyuwangi</p>
          </div>
          <p>Halo <strong>Tim Redaksi</strong>,</p>
          <p>Penulis <strong>${params.authorName}</strong> baru saja mengirimkan naskah karya baru untuk ditinjau:</p>
          <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; border-left: 4px solid #005AE0; margin: 16px 0;">
            <p style="margin: 0; font-size: 16px; font-weight: bold; color: #0f172a;">${params.postTitle}</p>
            <p style="margin: 6px 0 0 0; color: #64748b; font-size: 14px;">Rubrik: <strong>${params.categoryName || 'Umum'}</strong></p>
          </div>
          <p>Silakan tinjau dan kurasi naskah ini melalui Panel Redaksi:</p>
          <div style="margin: 20px 0;">
            <a href="${adminUrl}" style="display: inline-block; background-color: #005AE0; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">Buka Panel Redaksi & Kurasi</a>
          </div>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 12px; color: #94a3b8; margin: 0;">Email otomatis dari sistem Portal Media UKM Pilar Bangsa • UNTAG Banyuwangi</p>
        </div>
      `,
    });

    if (res?.error) {
      console.error('[EMAIL] Resend error pengiriman naskah baru ke admin:', res.error);
      return { success: false, error: res.error.message || 'Gagal mengirim email ke admin.' };
    }

    console.log('[EMAIL] Sukses kirim notifikasi naskah baru ke admin:', res?.data?.id);
    return { success: true, messageId: res?.data?.id };
  } catch (error: any) {
    console.error('[EMAIL] Exception mengirim email naskah baru ke admin:', error);
    return { success: false, error: error?.message || 'Terjadi kesalahan sistem pengiriman email.' };
  }
}

/**
 * Notifikasi konfirmasi ke Penulis saat naskah berhasil dikirim ke meja redaksi.
 */
export async function sendSubmissionReceivedEmailToAuthor(params: {
  authorEmail: string;
  authorName: string;
  postTitle: string;
  postId: string;
  categoryName?: string;
}): Promise<EmailResult> {
  const resend = getResendClient();
  if (!resend || !params.authorEmail) {
    return { success: false, error: 'Klien email tidak tersedia atau email tujuan kosong.' };
  }

  try {
    const editUrl = `${SITE_URL}/author/tulisan`;
    const res = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.authorEmail,
      subject: `[Pilar Bangsa] Naskah Anda Berhasil Diajukan: "${params.postTitle}"`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <div style="border-bottom: 2px solid #005AE0; padding-bottom: 12px; margin-bottom: 20px;">
            <h3 style="color: #005AE0; margin: 0; font-size: 18px; font-weight: 800; letter-spacing: -0.02em;">PORTAL MEDIA UKM PILAR BANGSA</h3>
            <p style="margin: 4px 0 0 0; color: #64748b; font-size: 12px;">Media Karya Mahasiswa UNTAG Banyuwangi</p>
          </div>
          <h2 style="color: #0f172a; margin-top: 0; font-size: 20px;">Naskah Anda Telah Masuk ke Meja Redaksi ✍️</h2>
          <p>Halo <strong>${params.authorName}</strong>,</p>
          <p>Terima kasih telah berkontribusi dan berkarya di <strong>Portal Media Karya Mahasiswa UNTAG Banyuwangi & UKM Pilar Bangsa</strong>.</p>
          <p>Naskah karya Anda telah berhasil kami terima dan saat ini sedang menunggu antrean kurasi Tim Redaksi:</p>
          <div style="background-color: #f0f4f8; padding: 16px; border-radius: 8px; border-left: 4px solid #005AE0; margin: 16px 0;">
            <p style="margin: 0; font-size: 16px; font-weight: bold; color: #0f172a;">${params.postTitle}</p>
            <p style="margin: 6px 0 0 0; color: #64748b; font-size: 14px;">Rubrik: <strong>${params.categoryName || 'Umum'}</strong></p>
            <p style="margin: 4px 0 0 0; color: #059669; font-size: 12px; font-weight: 600;">Status: Menunggu Kurasi Redaksi (Pending Review)</p>
          </div>
          <p>Anda akan menerima email pemberitahuan otomatis segera setelah naskah Anda disetujui terbit atau jika memerlukan penyesuaian/revisi.</p>
          <div style="margin: 20px 0;">
            <a href="${editUrl}" style="display: inline-block; background-color: #005AE0; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">Lihat Status di Studio Penulis</a>
          </div>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 12px; color: #94a3b8; margin: 0;">Media Karya Mahasiswa UNTAG Banyuwangi & UKM Pilar Bangsa • Jl. Adi Sucipto No. 26, Banyuwangi</p>
        </div>
      `,
    });

    if (res?.error) {
      console.error('[EMAIL] Resend error pengiriman ke penulis:', res.error);
      return { success: false, error: res.error.message || 'Gagal mengirim email konfirmasi pengajuan ke penulis.' };
    }

    console.log('[EMAIL] Sukses kirim tanda terima naskah ke penulis:', res?.data?.id);
    return { success: true, messageId: res?.data?.id };
  } catch (error: any) {
    console.error('[EMAIL] Exception mengirim email tanda terima ke penulis:', error);
    return { success: false, error: error?.message || 'Terjadi kesalahan sistem pengiriman email.' };
  }
}

/**
 * Notifikasi ke Penulis saat naskah disetujui dan diterbitkan.
 */
export async function sendPostApprovedEmailToAuthor(params: {
  authorEmail: string;
  authorName: string;
  postTitle: string;
  postSlug: string;
}): Promise<EmailResult> {
  const resend = getResendClient();
  if (!resend || !params.authorEmail) {
    return { success: false, error: 'Klien email tidak tersedia atau email tujuan kosong.' };
  }

  try {
    const articleUrl = `${SITE_URL}/artikel/${params.postSlug}`;
    const res = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.authorEmail,
      subject: `Selamat! Naskah Anda Telah Terbit di Portal Pilar Bangsa: "${params.postTitle}"`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <div style="border-bottom: 2px solid #16a34a; padding-bottom: 12px; margin-bottom: 20px;">
            <h3 style="color: #16a34a; margin: 0; font-size: 18px; font-weight: 800; letter-spacing: -0.02em;">PORTAL MEDIA UKM PILAR BANGSA</h3>
            <p style="margin: 4px 0 0 0; color: #64748b; font-size: 12px;">Media Karya Mahasiswa UNTAG Banyuwangi</p>
          </div>
          <h2 style="color: #16a34a; margin-top: 0; font-size: 20px;">Karya Anda Resmi Diterbitkan! 🎉</h2>
          <p>Halo <strong>${params.authorName}</strong>,</p>
          <p>Selamat! Naskah Anda yang berjudul <strong>"${params.postTitle}"</strong> telah selesai ditinjau oleh Dewan Redaksi dan kini telah resmi tayang di Portal Media Karya Mahasiswa UNTAG Banyuwangi & UKM Pilar Bangsa.</p>
          <div style="margin: 24px 0;">
            <a href="${articleUrl}" style="display: inline-block; background-color: #16a34a; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">Baca Karya Anda Sekarang</a>
          </div>
          <p>Karya Anda kini dapat dibaca, dibagikan, dan dinikmati oleh seluruh civitas akademika dan masyarakat luas.</p>
          <p>Terima kasih telah berkontribusi aktif dalam memperkaya literasi dan karya di kampus kita tercinta.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 12px; color: #94a3b8; margin: 0;">Media Karya Mahasiswa UNTAG Banyuwangi & UKM Pilar Bangsa</p>
        </div>
      `,
    });

    if (res?.error) {
      console.error('[EMAIL] Resend error pengiriman persetujuan ke penulis:', res.error);
      return { success: false, error: res.error.message || 'Gagal mengirim email persetujuan naskah.' };
    }

    console.log('[EMAIL] Sukses kirim notifikasi persetujuan naskah ke penulis:', res?.data?.id);
    return { success: true, messageId: res?.data?.id };
  } catch (error: any) {
    console.error('[EMAIL] Exception mengirim email persetujuan naskah:', error);
    return { success: false, error: error?.message || 'Terjadi kesalahan sistem pengiriman email.' };
  }
}

/**
 * Notifikasi ke Penulis saat naskah butuh revisi atau ditolak dengan catatan.
 */
export async function sendPostRejectedEmailToAuthor(params: {
  authorEmail: string;
  authorName: string;
  postTitle: string;
  postId: string;
  note?: string;
}): Promise<EmailResult> {
  const resend = getResendClient();
  if (!resend || !params.authorEmail) {
    return { success: false, error: 'Klien email tidak tersedia atau email tujuan kosong.' };
  }

  try {
    const editUrl = `${SITE_URL}/author/tulis?id=${params.postId}`;
    const res = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.authorEmail,
      subject: `[Pilar Bangsa] Catatan Redaksi untuk Naskah: "${params.postTitle}"`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <div style="border-bottom: 2px solid #ea580c; padding-bottom: 12px; margin-bottom: 20px;">
            <h3 style="color: #ea580c; margin: 0; font-size: 18px; font-weight: 800; letter-spacing: -0.02em;">PORTAL MEDIA UKM PILAR BANGSA</h3>
            <p style="margin: 4px 0 0 0; color: #64748b; font-size: 12px;">Media Karya Mahasiswa UNTAG Banyuwangi</p>
          </div>
          <h2 style="color: #ea580c; margin-top: 0; font-size: 20px;">Naskah Memerlukan Penyesuaian ✍️</h2>
          <p>Halo <strong>${params.authorName}</strong>,</p>
          <p>Terima kasih atas kiriman naskah Anda yang berjudul <strong>"${params.postTitle}"</strong>.</p>
          <p>Setelah ditinjau secara saksama oleh Dewan Redaksi, naskah Anda memerlukan sedikit perbaikan dengan catatan berikut:</p>
          <div style="background-color: #fff7ed; padding: 16px; border-radius: 8px; border-left: 4px solid #ea580c; margin: 16px 0;">
            <p style="margin: 0; color: #9a3412; font-size: 14px; white-space: pre-line; font-weight: 500;">${params.note || 'Mohon disesuaikan kembali dengan pedoman penulisan dan tata bahasa redaksi.'}</p>
          </div>
          <p>Silakan buka studio penulisan Anda untuk menyempurnakan naskah dan mengajukannya kembali:</p>
          <div style="margin: 24px 0;">
            <a href="${editUrl}" style="display: inline-block; background-color: #ea580c; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">Perbaiki & Buka Naskah</a>
          </div>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 12px; color: #94a3b8; margin: 0;">Media Karya Mahasiswa UNTAG Banyuwangi & UKM Pilar Bangsa</p>
        </div>
      `,
    });

    if (res?.error) {
      console.error('[EMAIL] Resend error pengiriman revisi ke penulis:', res.error);
      return { success: false, error: res.error.message || 'Gagal mengirim email revisi naskah.' };
    }

    console.log('[EMAIL] Sukses kirim catatan revisi ke penulis:', res?.data?.id);
    return { success: true, messageId: res?.data?.id };
  } catch (error: any) {
    console.error('[EMAIL] Exception mengirim email revisi naskah:', error);
    return { success: false, error: error?.message || 'Terjadi kesalahan sistem pengiriman email.' };
  }
}

/**
 * Notifikasi sambutan (Welcome Email) ke Penulis baru yang pertama kali login via akun Google.
 */
export async function sendWelcomeEmailToNewAuthor(params: {
  authorEmail: string;
  authorName: string;
}): Promise<EmailResult> {
  const resend = getResendClient();
  if (!resend || !params.authorEmail) {
    return { success: false, error: 'Klien email tidak tersedia atau email tujuan kosong.' };
  }

  try {
    const studioUrl = `${SITE_URL}/author/tulis`;
    const res = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.authorEmail,
      subject: `Selamat Datang di Portal Media Mahasiswa UNTAG Banyuwangi & UKM Pilar Bangsa! 🎉`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <div style="border-bottom: 2px solid #005AE0; padding-bottom: 12px; margin-bottom: 20px;">
            <h3 style="color: #005AE0; margin: 0; font-size: 18px; font-weight: 800; letter-spacing: -0.02em;">PORTAL MEDIA UKM PILAR BANGSA</h3>
            <p style="margin: 4px 0 0 0; color: #64748b; font-size: 12px;">Media Karya Mahasiswa UNTAG Banyuwangi</p>
          </div>
          <h2 style="color: #005AE0; margin-top: 0; font-size: 20px;">Selamat Bergabung, ${params.authorName}! 🚀</h2>
          <p>Akun Anda telah berhasil diaktifkan sebagai <strong>Penulis Mahasiswa</strong> di Portal Media Karya Mahasiswa UNTAG Banyuwangi & UKM Pilar Bangsa.</p>
          <div style="background-color: #f0f4f8; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <h4 style="margin: 0 0 8px 0; color: #0f172a; font-size: 14px;">Ruang Berkarya Anda:</h4>
            <ul style="margin: 0; padding-left: 20px; color: #334155; font-size: 13px;">
              <li><strong>Tulis Artikel & Opini:</strong> Salurkan gagasan, analisis kritis, dan wawasan akademik Anda.</li>
              <li><strong>Publikasikan Sastra & Puisi:</strong> Bagikan karya puisi, cerpen, dan apresiasi seni.</li>
              <li><strong>Kurasi Redaksi:</strong> Naskah Anda akan ditinjau oleh Dewan Redaksi sebelum tayang di portal publik.</li>
            </ul>
          </div>
          <p>Siap untuk mempublikasikan karya pertama Anda? Mulai menulis sekarang juga:</p>
          <div style="margin: 24px 0;">
            <a href="${studioUrl}" style="display: inline-block; background-color: #005AE0; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">Mulai Tulis Naskah Pertama</a>
          </div>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 12px; color: #94a3b8; margin: 0;">UKM Pilar Bangsa • Universitas 17 Agustus 1945 Banyuwangi • Jl. Adi Sucipto No. 26</p>
        </div>
      `,
    });

    if (res?.error) {
      console.error('[EMAIL] Resend error pengiriman welcome email:', res.error);
      return { success: false, error: res.error.message || 'Gagal mengirim email sambutan ke penulis.' };
    }

    console.log('[EMAIL] Sukses kirim welcome email ke penulis baru:', res?.data?.id);
    return { success: true, messageId: res?.data?.id };
  } catch (error: any) {
    console.error('[EMAIL] Exception mengirim welcome email:', error);
    return { success: false, error: error?.message || 'Terjadi kesalahan sistem pengiriman email.' };
  }
}

/**
 * Notifikasi ke Redaksi saat ada Penulis baru yang mendaftar / login pertama kali.
 */
export async function sendNewAuthorRegisteredNotificationToAdmin(params: {
  authorEmail: string;
  authorName: string;
}): Promise<EmailResult> {
  const resend = getResendClient();
  if (!resend) {
    return { success: false, error: 'Klien email tidak tersedia di server.' };
  }

  try {
    const res = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `[Pilar Bangsa] Penulis Baru Bergabung: ${params.authorName}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <div style="border-bottom: 2px solid #005AE0; padding-bottom: 12px; margin-bottom: 20px;">
            <h3 style="color: #005AE0; margin: 0; font-size: 18px; font-weight: 800; letter-spacing: -0.02em;">PORTAL MEDIA UKM PILAR BANGSA</h3>
            <p style="margin: 4px 0 0 0; color: #64748b; font-size: 12px;">Pemberitahuan Redaksi</p>
          </div>
          <p>Halo <strong>Tim Redaksi</strong>,</p>
          <p>Ada anggota/penulis mahasiswa baru yang baru saja mengaktifkan akun di Portal Media Pilar Bangsa:</p>
          <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; border-left: 4px solid #005AE0; margin: 16px 0;">
            <p style="margin: 0; font-size: 15px; font-weight: bold; color: #0f172a;">Nama: ${params.authorName}</p>
            <p style="margin: 6px 0 0 0; color: #64748b; font-size: 14px;">Email: <strong>${params.authorEmail}</strong></p>
          </div>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 12px; color: #94a3b8; margin: 0;">Email otomatis dari sistem Portal Media UKM Pilar Bangsa.</p>
        </div>
      `,
    });

    if (res?.error) {
      console.error('[EMAIL] Resend error pengiriman notifikasi registrasi ke admin:', res.error);
      return { success: false, error: res.error.message || 'Gagal mengirim email notifikasi ke admin.' };
    }

    return { success: true, messageId: res?.data?.id };
  } catch (error: any) {
    console.error('[EMAIL] Exception mengirim notifikasi registrasi ke admin:', error);
    return { success: false, error: error?.message || 'Terjadi kesalahan sistem pengiriman email.' };
  }
}
