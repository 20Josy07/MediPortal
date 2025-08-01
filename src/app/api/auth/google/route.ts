import { oauth2Client } from '@/lib/google';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Generate the authorization URL
    const authorizationUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ],
      include_granted_scopes: true,
      prompt: 'consent',
    });

    return NextResponse.json({ url: authorizationUrl });
  } catch (error) {
    console.error('Error generating auth URL:', error);
    return NextResponse.json(
      { error: 'Error al generar la URL de autorización' },
      { status: 500 }
    );
  }
}
