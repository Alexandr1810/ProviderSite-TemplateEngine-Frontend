import { NextResponse } from 'next/server';
import { server_config } from '@/app/utils/server_config.js'

export async function middleware(request) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const cookie = request.headers.get('cookie') || '';

    let res;
    try {
      res = await fetch(
        `${server_config.api_protocol}://${server_config.site_folder}/auth/me/${server_config.site_key}`,
        {
          headers: {
            cookie,
          },
        }
      );
    } catch {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (!res.ok) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'], //'/admin/:path*'
};