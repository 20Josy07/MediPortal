

export interface CalendarEvent {
  summary: string;
  description: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees?: Array<{ email: string }>;
  reminders?: {
    useDefault: boolean;
    overrides?: Array<{ method: 'email' | 'popup'; minutes: number }>;
  };
}

export const createCalendarEvent = async (accessToken: string, event: CalendarEvent) => {
  try {
    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?sendUpdates=all', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event)
    });

    if (!response.ok) {
      const errorData = await response.json();
      // Si el token expiró, el error suele ser 401.
      if (response.status === 401) {
          console.error('El token de acceso de Google ha expirado o es inválido.');
          // Aquí se podría iniciar un flujo para refrescar el token.
      }
      throw new Error(errorData.error?.message || 'Error al crear el evento en Google Calendar');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en createCalendarEvent:', error);
    throw error;
  }
};
