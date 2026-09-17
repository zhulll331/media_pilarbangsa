import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import {
  sendWelcomeEmailToNewAuthor,
  sendNewAuthorRegisteredNotificationToAdmin,
} from '@/lib/email/templates';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/author';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Cek profil pengguna atau buat jika belum ada
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        if (!profile) {
          const authorName =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split('@')[0] ||
            'Penulis Mahasiswa';
          const authorEmail = user.email || user.user_metadata?.email;

          await supabase.from('profiles').insert({
            id: user.id,
            full_name: authorName,
            avatar_url: user.user_metadata?.avatar_url || null,
            role: 'author',
          });

          // Kirim email sambutan ke penulis baru & notifikasi ke redaksi
          if (authorEmail) {
            try {
              await Promise.allSettled([
                sendWelcomeEmailToNewAuthor({
                  authorEmail,
                  authorName,
                }),
                sendNewAuthorRegisteredNotificationToAdmin({
                  authorEmail,
                  authorName,
                }),
              ]);
            } catch (emailErr) {
              console.error('[EMAIL] Gagal mengirim welcome email ke penulis baru:', emailErr);
            }
          }
        }

        if (profile?.role === 'admin') {
          return NextResponse.redirect(`${origin}/admin`);
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    } else {
      console.error('exchangeCodeForSession error:', error);
    }
  }

  // Kembali ke login jika terjadi kegagalan
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
