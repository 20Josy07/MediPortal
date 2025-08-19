import { NextResponse } from 'next/server';
import { getTokens } from '@/lib/google';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { cookies } from 'next/headers';
import { auth as adminAuth } from 'firebase-admin';
import { initializeApp, getApps, App } from 'firebase-admin/app';

// Initialize Firebase Admin SDK if not already initialized
if (!getApps().length) {
  initializeApp();
}

export async function GET(request: Request) {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('__session')?.value || '';

  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const decodedToken = await adminAuth().verifySessionCookie(sessionCookie, true);
    const userId = decodedToken.uid;
    
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const from = searchParams.get('state') || '/dashboard/sessions'; // Get redirect path from state

    if (code) {
      const tokens = await getTokens(code);
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, {
        googleTokens: tokens,
      });

      // Redirect back to the page the user came from, with a query param to force reload
      const destinationUrl = new URL(from, request.url);
      destinationUrl.searchParams.set('gcal_linked', 'true');
      
      return NextResponse.redirect(destinationUrl);

    } else {
      throw new Error('Código de autorización no encontrado.');
    }
  } catch (error) {
    console.error('Error en el callback de Google:', error);
    const errorUrl = new URL('/dashboard/sessions', request.url)
    errorUrl.searchParams.set('error', 'google_auth_failed')
    return NextResponse.redirect(errorUrl);
  }
}
