// app/api/auth/callback/google/route.ts
import { oauth2Client } from '@/lib/google';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    
    if (!code) {
      return NextResponse.json(
        { error: 'Código de autorización no proporcionado' },
        { status: 400 }
      );
    }

    const { tokens } = await oauth2Client.getToken(code);
    
    // Guarda el token de manera segura (en cookies HTTP-only)
    const cookieStore = await cookies();
    cookieStore.set('google_token', JSON.stringify(tokens), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return NextResponse.redirect(new URL('/dashboard/sessions', request.url));

  } catch (error) {
    console.error('Error en el callback de Google:', error);
    return NextResponse.redirect(new URL('/auth/error', request.url));
  }
}
