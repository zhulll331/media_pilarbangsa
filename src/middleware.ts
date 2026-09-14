import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Graceful fallback: Jika Environment Variables belum disetel di Vercel Dashboard,
  // jangan biarkan middleware crash 500. Biarkan halaman publik tetap dapat dibuka.
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next();
  }

  try {
    let supabaseResponse = NextResponse.next({
      request,
    });

    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;
    const code = request.nextUrl.searchParams.get('code');

    // Jika Supabase redirect kembali ke root /?code=... (karena Redirect URL belum di-whitelist di Dashboard),
    // tangkap dan teruskan ke /auth/callback agar ditukarkan menjadi sesi login resmi.
    if (code && !pathname.startsWith('/auth/callback')) {
      const callbackUrl = new URL('/auth/callback', request.url);
      callbackUrl.searchParams.set('code', code);
      const next = request.nextUrl.searchParams.get('next');
      if (next) callbackUrl.searchParams.set('next', next);
      return NextResponse.redirect(callbackUrl);
    }

    // 1. Proteksi Route /admin (kecuali /admin/login)
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
      if (!user) {
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('redirectTo', pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Periksa role admin di tabel profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile || profile.role !== 'admin') {
        // Tolak akses jika bukan admin, redirect ke beranda
        return NextResponse.redirect(new URL('/?error=unauthorized', request.url));
      }
    }

    // 2. Proteksi Route /author
    if (pathname.startsWith('/author')) {
      if (!user) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirectTo', pathname);
        return NextResponse.redirect(loginUrl);
      }
    }

    // 3. Jika sudah login dan mengunjungi /login umum
    if (pathname === '/login' && user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role === 'admin') {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.redirect(new URL('/author', request.url));
    }

    // 4. Jika sudah login sebagai admin dan mengunjungi /admin/login
    if (pathname === '/admin/login' && user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role === 'admin') {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
    }

    return supabaseResponse;
  } catch (error) {
    // Tangani error jaringan atau Supabase agar tidak memicu 500 error di Vercel
    console.error('Middleware error caught:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images, fonts, icons (public static assets)
     */
    '/((?!_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
