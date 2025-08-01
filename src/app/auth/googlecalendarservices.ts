// Reemplaza todo el contenido de googlecalendarservices.ts con esto:

interface CalendarEvent {
    summary: string;
    description: string;
    start: {
      date: string;
      timeZone?: string;
    };
    end: {
      date: string;
      timeZone?: string;
    };
  }
  
  export const createCalendarEvent = async (accessToken: string, event: CalendarEvent) => {
    try {
      const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(event)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error al crear el evento:', errorData);
        throw new Error(errorData.error?.message || 'Error al crear el evento');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error en createCalendarEvent:', error);
      throw error;
    }
  };