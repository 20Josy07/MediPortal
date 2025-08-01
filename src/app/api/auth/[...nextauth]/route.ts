// app/api/auth/[...nextauth]/route.ts
import { getAuthURL } from '@/lib/google';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const authUrl = getAuthURL();
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Error en la autenticación:', error);
    return NextResponse.json(
      { error: 'Error en la autenticación' },
      { status: 500 }
    );
  }
}