// app/api/calendar/events/route.ts
import { oauth2Client } from '@/lib/google';
import { calendar_v3, google } from 'googleapis';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('google_token');
    
    if (!tokenCookie?.value) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const tokens = JSON.parse(tokenCookie.value);
    oauth2Client.setCredentials(tokens);
    
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const body = await request.json();
    
    const event: calendar_v3.Schema$Event = {
      summary: body.summary,
      description: body.description,
      start: {
        dateTime: body.startDateTime,
        timeZone: 'America/Santiago', // Ajusta según tu zona horaria
      },
      end: {
        dateTime: body.endDateTime,
        timeZone: 'America/Santiago',
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });

    return NextResponse.json({ event: response.data });
  } catch (error) {
    console.error('Error al crear el evento:', error);
    return NextResponse.json(
      { error: 'Error al crear el evento' },
      { status: 500 }
    );
  }
}