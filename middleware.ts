import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith('/api/auth/')) {
    return NextResponse.next();
  }

  const token = request.headers.get('authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ message: 'Token de autenticação não fornecido' }, { status: 401 });
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

    const { payload } = await jwtVerify(token, secret);

    const requestHeaders = new Headers(request.headers);

    requestHeaders.set('x-user-id', payload.id as string);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

  } catch (error) {
    return NextResponse.json({ message: 'Token inválido ou expirado' }, { status: 401 });
  }
}

export const config = {
  matcher: '/api/:path*',
};