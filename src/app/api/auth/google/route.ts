import { getGoogleAuthUrl } from '@/lib/google';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { auth as adminAuth } from 'firebase-admin';
import { initializeApp, getApps } from 'firebase-admin/app';

if (!getApps().length) {
  initializeApp();
}

export async function GET(request: Request) {
  const cookieStore = cookies();
  const idToken = cookieStore.get('idToken')?.value;
  console.log('API route /api/auth/google called');

  if (!idToken) {
    // Si no hay token, el usuario no está logueado en el cliente.
    // Redirigir a login, idealmente con un 'next' para volver aquí.
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }

  try {
    // Verificar el token para asegurarse de que es válido
    await adminAuth().verifyIdToken(idToken);
    
    // Obtener la URL de origen desde los headers
    const referer = request.headers.get('referer');
    const fromPath = referer ? new URL(referer).pathname : '/dashboard/sessions';

    const authUrl = getGoogleAuthUrl(fromPath);
    return NextResponse.json({ url: authUrl });
    
  } catch (error) {
    console.error('Error verifying token or generating auth URL', error);
    return NextResponse.json({ error: 'Authentication error' }, { status: 500 });
  }
}
