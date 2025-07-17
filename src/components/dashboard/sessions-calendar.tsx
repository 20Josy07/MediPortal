"use client";

import * as React from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Session } from "@/lib/types";

const mockSessions: Session[] = [
  { id: '1', patientName: 'Juan Pérez', date: new Date('2024-07-22T09:00:00'), status: 'Confirmada' },
  { id: '2', patientName: 'Carlos Rivas', date: new Date('2024-07-24T11:00:00'), status: 'Confirmada' },
  { id: '3', patientName: 'Isabella Rossi', date: new Date('2024-07-26T15:00:00'), status: 'Confirmada' },
  { id: '4', patientName: 'Isabella Rossi', date: new Date('2024-07-28T10:00:00'), status: 'Pendiente' },
  { id: '5', patientName: 'Sofía Hernández', date: new Date('2024-07-29T14:00:00'), status: 'Confirmada' },
  { id: '6', patientName: 'Isabella Rossi', date: new Date('2024-08-04T10:00:00'), status: 'Confirmada' },
];

export function SessionsCalendar() {
  const [currentDate, setCurrentDate] = React.useState(new Date(2024, 6, 25));
  const [selectedDate, setSelectedDate] = React.useState(new Date(2024, 6, 25));
  const [sessions, setSessions] = React.useState<Session[]>(mockSessions);

  const start = startOfWeek(startOfMonth(currentDate), { locale: es });
  const end = endOfWeek(endOfMonth(currentDate), { locale: es });
  const days = eachDayOfInterval({ start, end });
  const weekdays = ["lu", "ma", "mi", "ju", "vi", "sá", "do"];

  const sessionsByDay = React.useMemo(() => {
    return sessions.reduce((acc, session) => {
      const dayKey = format(session.date, "yyyy-MM-dd");
      if (!acc[dayKey]) {
        acc[dayKey] = [];
      }
      acc[dayKey].push(session);
      return acc;
    }, {} as Record<string, Session[]>);
  }, [sessions]);
  
  const selectedDaySessions = sessionsByDay[format(selectedDate, "yyyy-MM-dd")] || [];

  return (
    <div>
       <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Mi Agenda</h2>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-lg font-semibold w-32 text-center">
              {format(currentDate, "MMMM yyyy", { locale: es })}
            </span>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" onClick={() => setCurrentDate(new Date())}>Hoy</Button>
          <Button>Agendar Nueva Sesión</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardContent className="p-4">
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
              {weekdays.map((day) => (
                <div key={day} className="font-medium capitalize">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 grid-rows-5 gap-1 mt-2">
              {days.map((day) => (
                <div
                  key={day.toString()}
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    "relative p-2 h-28 rounded-md cursor-pointer transition-colors",
                    !isSameMonth(day, currentDate) && "text-muted-foreground/50 bg-card/50",
                    isSameMonth(day, currentDate) && "bg-card hover:bg-accent/10",
                    isSameDay(day, selectedDate) && "bg-primary/20 border border-primary",
                  )}
                >
                  <span className={cn("absolute top-2 left-2 text-xs font-semibold",
                    isSameDay(day, new Date()) && "text-primary font-bold"
                  )}>
                    {format(day, "d")}
                  </span>
                  <div className="absolute bottom-2 left-2 right-2 space-y-1">
                    {(sessionsByDay[format(day, "yyyy-MM-dd")] || []).slice(0, 2).map(session => (
                       <div key={session.id} className="bg-primary/80 text-primary-foreground text-[10px] rounded-sm px-1 py-0.5 truncate">
                         {format(session.date, 'HH:mm')} - {session.patientName}
                       </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              Sesiones del {format(selectedDate, "d 'de' MMMM", { locale: es })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDaySessions.length > 0 ? (
              <div className="space-y-4">
                {selectedDaySessions.map(session => (
                  <div key={session.id} className="bg-card p-4 rounded-lg border border-border">
                    <p className="font-semibold">{session.patientName}</p>
                    <p className="text-sm text-muted-foreground">{format(session.date, "p", { locale: es })}</p>
                    <p className="text-sm capitalize mt-1"><span className="text-muted-foreground">Estado: </span>{session.status}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No hay sesiones para este día.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
