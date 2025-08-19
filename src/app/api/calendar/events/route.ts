
import { NextResponse } from 'next/server';
import { getCalendarService } from '@/lib/google';
import { auth as adminAuth } from 'firebase-admin';
import { initializeApp, getApps } from 'firebase-admin/app';

// Initialize Firebase Admin SDK if not already initialized
if (!getApps().length) {
  initializeApp();
}

async function getUserIdFromToken(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await adminAuth().verifyIdToken(token);
    return decodedToken.uid;
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    return null;
  }
}

export async function POST(request: Request) {
  const userId = await getUserIdFromToken(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const calendar = await getCalendarService(userId);
    const event = await request.json();

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
      sendUpdates: 'all',
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error creating calendar event:', error);
    // Provide more specific error messages if possible
    const errorMessage = error.message || 'An unknown error occurred';
    const status = error.code || 500;
    return NextResponse.json({ error: 'Failed to create calendar event', details: errorMessage }, { status });
  }
}
