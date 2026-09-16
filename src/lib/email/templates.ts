import { resend, FROM_EMAIL, ADMIN_EMAIL, SITE_URL } from './resend';

/**
 * Notifikasi ke Redaksi UKM Pilar Bangsa saat ada naskah baru yang diajukan.
 */
export async function sendNewSubmissionEmailToAdmin(params: {
  postTitle: string;
  authorName: string;
  categoryName?: string;
  postId: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[EMAIL] RESEND_API_KEY belum disetel, lewati pengiriman email.');
    return;
  }

  try {
    const adminUrl = `${SITE_URL}/admin`;
    const res = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `[Pilar Bangsa] Naskah Baru Masuk: "${params.postTitle}"`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #dc2626; margin-top: 0;">Portal Media Mahasiswa UNTAG Banyuwangi & UKM Pilar Bangsa</h2>
          <p>Halo <strong>Tim Redaksi</strong>,</p>
          <p>Penulis <strong>${params.authorName}</strong> baru saja mengirimkan naskah untuk ditinjau:</p>
          <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; border-left: 4px solid #dc2626; margin: 16px 0;">
            <p style="margin: 0; font-size: 16px; font-weight: bold;">${params.postTitle}</p>
            <p style="margin: 6px 0 0 0; color: #64748b; font-size: 14px;">Kategori: ${params.categoryName || 'Umum'}</p>
          </div>
          <p>Silakan tinjau dan putuskan naskah ini melalui Panel Redaksi:</p>
          <a href="${adminUrl}" style="display: inline-block; background-color: #dc2626; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; margin-top: 8px;">Buka Panel Redaksi</a>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 12px; color: #94a3b8;">Email otomatis dari sistem Portal Media UKM Pilar Bangsa.</p>
        </div>
      `,
    });
    if (res?.error) {
      console.error('[EMAIL] Resend error pengiriman ke admin:', res.error);
    } else {
      console.log('[EMAIL] Sukses kirim notifikasi naskah baru ke admin:', res?.data?.id);
    }
  } catch (error) {
    console.error('[EMAIL] Gagal mengirim email naskah baru ke admin:', error);
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
}) {
  if (!process.env.RESEND_API_KEY || !params.authorEmail) return;

  try {
    const editUrl = `${SITE_URL}/author/tulisan`;
    const res = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.authorEmail,
      subject: `[Pilar Bangsa] Naskah Anda Berhasil Diajukan: "${params.postTitle}"`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #005AE0; margin-top: 0;">Naskah Anda Telah Masuk ke Meja Redaksi ✍️</h2>
          <p>Halo <strong>${params.authorName}</strong>,</p>
          <p>Terima kasih telah berkontribusi dan berkarya di <strong>Portal Media Karya Mahasiswa UNTAG Banyuwangi & UKM Pilar Bangsa</strong>.</p>
          <p>Naskah karya Anda telah berhasil kami terima dan saat ini sedang menunggu antrean kurasi Tim Redaksi:</p>
          <div style="background-color: #f0f4f8; padding: 16px; border-radius: 8px; border-left: 4px solid #005AE0; margin: 16px 0;">
            <p style="margin: 0; font-size: 16px; font-weight: bold; color: #0f172a;">${params.postTitle}</p>
            <p style="margin: 6px 0 0 0; color: #64748b; font-size: 14px;">Rubrik: ${params.categoryName || 'Umum'}</p>
            <p style="margin: 4px 0 0 0; color: #059669; font-size: 12px; font-weight: 600;">Status: Menunggu Kurasi Redaksi (Pending Review)</p>
          </div>
          <p>Anda akan menerima email pemberitahuan otomatis segera setelah naskah Anda disetujui terbit atau jika memerlukan sedikit perbaikan.</p>
          <div style="margin: 20px 0;">
            <a href="${editUrl}" style="display: inline-block; background-color: #005AE0; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">Lihat Status di Studio Penulis</a>
          </div>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 12px; color: #94a3b8;">Media Karya Mahasiswa UNTAG Banyuwangi & UKM Pilar Bangsa • Jl. Adi Sucipto No. 26, Banyuwangi</p>
        </div>
      `,
    });
    if (res?.error) {
      console.error('[EMAIL] Resend error pengiriman ke penulis:', res.error);
    } else {
      console.log('[EMAIL] Sukses kirim tanda terima naskah ke penulis:', res?.data?.id);
    }
  } catch (error) {
    console.error('[EMAIL] Gagal mengirim email konfirmasi pengajuan ke penulis:', error);
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
}) {
  if (!process.env.RESEND_API_KEY || !params.authorEmail) return;

  try {
    const articleUrl = `${SITE_URL}/artikel/${params.postSlug}`;
    const res = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.authorEmail,
      subject: `Selamat! Naskah Anda Telah Terbit di Portal Pilar Bangsa: "${params.postTitle}"`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #16a34a; margin-top: 0;">Karya Anda Resmi Diterbitkan! 🎉</h2>
          <p>Halo <strong>${params.authorName}</strong>,</p>
          <p>Selamat! Naskah Anda yang berjudul <strong>"${params.postTitle}"</strong> telah selesai ditinjau oleh Dewan Redaksi dan kini telah resmi tayang di Portal Media Karya Mahasiswa UNTAG Banyuwangi & UKM Pilar Bangsa.</p>
          <div style="margin: 20px 0;">
            <a href="${articleUrl}" style="display: inline-block; background-color: #16a34a; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">Baca Karya Anda Sekarang</a>
          </div>
          <p>Terima kasih telah berkontribusi dan memperkaya literasi kampus kita tercinta.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 12px; color: #94a3b8;">Media Karya Mahasiswa UNTAG Banyuwangi & UKM Pilar Bangsa</p>
        </div>
      `,
    });
    if (res?.error) {
      console.error('[EMAIL] Resend error pengiriman persetujuan ke penulis:', res.error);
    } else {
      console.log('[EMAIL] Sukses kirim notifikasi persetujuan naskah ke penulis:', res?.data?.id);
    }
  } catch (error) {
    console.error('[EMAIL] Gagal mengirim email persetujuan naskah:', error);
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
}) {
  if (!process.env.RESEND_API_KEY || !params.authorEmail) return;

  try {
    const editUrl = `${SITE_URL}/author/tulis?id=${params.postId}`;
    const res = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.authorEmail,
      subject: `[Pilar Bangsa] Catatan Redaksi untuk Naskah: "${params.postTitle}"`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #ea580c; margin-top: 0;">Naskah Memerlukan Penyesuaian</h2>
          <p>Halo <strong>${params.authorName}</strong>,</p>
          <p>Terima kasih atas kiriman naskah Anda yang berjudul <strong>"${params.postTitle}"</strong>.</p>
          <p>Setelah ditinjau, Redaksi memberikan catatan masukan sebagai berikut:</p>
          <div style="background-color: #fff7ed; padding: 16px; border-radius: 8px; border-left: 4px solid #ea580c; margin: 16px 0;">
            <p style="margin: 0; color: #9a3412; white-space: pre-line;">${params.note || 'Mohon disesuaikan kembali dengan pedoman penulisan redaksi.'}</p>
          </div>
          <p>Silakan lakukan perbaikan naskah Anda dan kirimkan kembali untuk peninjauan ulang:</p>
          <div style="margin: 20px 0;">
            <a href="${editUrl}" style="display: inline-block; background-color: #ea580c; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">Perbaiki Naskah</a>
          </div>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 12px; color: #94a3b8;">Media Karya Mahasiswa UNTAG Banyuwangi & UKM Pilar Bangsa</p>
        </div>
      `,
    });
    if (res?.error) {
      console.error('[EMAIL] Resend error pengiriman revisi ke penulis:', res.error);
    } else {
      console.log('[EMAIL] Sukses kirim catatan revisi ke penulis:', res?.data?.id);
    }
  } catch (error) {
    console.error('[EMAIL] Gagal mengirim email revisi naskah:', error);
  }
}
