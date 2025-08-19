import { getGoogleAuthUrl } from '@/lib/google';
import { NextResponse } from 'next/server';
import { auth as adminAuth } from 'firebase-admin';
import { initializeApp, getApps } from 'firebase-admin/app';

if (!getApps().length) {
  initializeApp();
}

export async function GET(request: Request) {
  console.log('API route /api/auth/google called');
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'User not authenticated, no token provided' }, { status: 401 });
  }

  const idToken = authHeader.split('Bearer ')[1];

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
