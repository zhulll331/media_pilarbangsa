import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

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
          await supabase.from('profiles').insert({
            id: user.id,
            full_name:
              user.user_metadata?.full_name ||
              user.user_metadata?.name ||
              user.email?.split('@')[0] ||
              'Penulis Mahasiswa',
            avatar_url: user.user_metadata?.avatar_url || null,
            role: 'author',
          });
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
