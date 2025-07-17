
"use client";

import * as React from "react";
import {
  collection,
  getDocs,
  addDoc,
} from "firebase/firestore";
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
  setMonth
} from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { Session, Patient } from "@/lib/types";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { SessionForm } from "./session-form";

export function SessionsCalendar() {
  const { user, db, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [sessions, setSessions] = React.useState<Session[]>([]);
  const [patients, setPatients] = React.useState<Patient[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      if (authLoading || !user || !db) {
        if (!authLoading) setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const patientsCollection = collection(db, `users/${user.uid}/patients`);
        const patientSnapshot = await getDocs(patientsCollection);
        const patientList = patientSnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Patient)
        );
        setPatients(patientList);

        const sessionsCollection = collection(db, `users/${user.uid}/sessions`);
        const sessionSnapshot = await getDocs(sessionsCollection);
        const sessionList = sessionSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            date: (data.date as any).toDate(),
          } as Session;
        });
        setSessions(sessionList);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          variant: "destructive",
          title: "Error al cargar los datos.",
          description: "No se pudieron cargar las sesiones o pacientes.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, db, authLoading, toast]);

  const handleFormSubmit = async (data: Omit<Session, "id" | "patientName">) => {
    if (!user || !db) {
      toast({
        variant: "destructive",
        title: "Error de autenticación. Intenta de nuevo.",
      });
      return;
    }
    const selectedPatient = patients.find(p => p.id === data.patientId);
    if (!selectedPatient) {
        toast({ variant: "destructive", title: "Paciente no encontrado."});
        return;
    }

    const sessionData = {
        ...data,
        patientName: selectedPatient.name,
    };

    try {
      const sessionsCollection = collection(db, `users/${user.uid}/sessions`);
      const docRef = await addDoc(sessionsCollection, sessionData);
      const newSession = { id: docRef.id, ...sessionData };
      setSessions([...sessions, newSession]);
      toast({ title: "Sesión agendada exitosamente." });
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error saving session:", error);
      toast({
        variant: "destructive",
        title: "Error al guardar la sesión.",
      });
    }
  };

  const start = startOfWeek(startOfMonth(currentDate), { locale: es });
  const end = endOfWeek(endOfMonth(currentDate), { locale: es });
  const days = eachDayOfInterval({ start, end });
  const weekdays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

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

  const selectedDaySessions = React.useMemo(() => {
    const dayKey = format(selectedDate, "yyyy-MM-dd");
    return (sessionsByDay[dayKey] || []).sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
  }, [selectedDate, sessionsByDay]);

  const months = Array.from({ length: 12 }, (_, i) => 
    format(new Date(currentDate.getFullYear(), i), "MMMM", { locale: es })
  );

  const getStatusColor = (status: "Confirmada" | "Pendiente" | "Cancelada") => {
    switch (status) {
      case "Confirmada":
        return "bg-green-500/80";
      case "Pendiente":
        return "bg-yellow-400/80";
      case "Cancelada":
        return "bg-red-500/80";
      default:
        return "bg-gray-400/80";
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <Card className="lg:col-span-9 h-full">
          <div className="grid grid-cols-12 h-full">
            <div className="col-span-3 lg:col-span-2 p-2 border-r flex flex-col">
              <CardHeader className="p-2">
                  <CardTitle className="text-center text-lg">{currentDate.getFullYear()}</CardTitle>
              </CardHeader>
              <CardContent className="p-2 flex-grow">
                  <div className="flex flex-col gap-1">
                      {months.map((month, index) => (
                          <Button 
                              key={month}
                              variant={format(currentDate, 'M') === String(index + 1) ? "default" : "ghost"}
                              className="capitalize w-full justify-start text-sm h-8"
                              onClick={() => setCurrentDate(setMonth(currentDate, index))}
                          >
                              {month}
                          </Button>
                      ))}
                  </div>
              </CardContent>
              <div className="p-2 mt-auto text-center">
                <Button
                  onClick={() => setIsFormOpen(true)}
                  className="h-9 text-sm w-full"
                >
                  Agendar
                </Button>
              </div>
            </div>
            <div className="col-span-9 lg:col-span-10 p-4">
              {isLoading ? (
                <div className="flex justify-center items-center h-[560px]">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
                    {weekdays.map((day) => (
                      <div key={day} className="font-medium capitalize">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 grid-rows-5 gap-1 mt-2">
                    {days.map((day) => (
                      <div
                        key={day.toString()}
                        onClick={() => setSelectedDate(day)}
                        className={cn(
                          "relative p-2 h-28 rounded-md cursor-pointer transition-colors overflow-hidden",
                          !isSameMonth(day, currentDate) &&
                            "text-muted-foreground/50 bg-card/50",
                          isSameMonth(day, currentDate) &&
                            "bg-card hover:bg-accent/10",
                          isSameDay(day, selectedDate) &&
                            "bg-primary/20 border border-primary"
                        )}
                      >
                        <span
                          className={cn(
                            "absolute top-2 left-2 text-xs font-semibold",
                            isSameDay(day, new Date()) && "text-primary font-bold"
                          )}
                        >
                          {format(day, "d")}
                        </span>
                        <div className="absolute top-8 left-1 right-1 flex flex-col gap-1">
                          {(sessionsByDay[format(day, "yyyy-MM-dd")] || []).slice(0, 3).map((session) => (
                              <div
                                key={session.id}
                                className={cn(
                                  "text-xs leading-tight rounded-md px-2 py-1 text-white",
                                  getStatusColor(session.status)
                                )}
                                title={session.patientName}
                              >
                                {session.patientName}
                              </div>
                            ))}
                           {(sessionsByDay[format(day, "yyyy-MM-dd")] || []).length > 3 && (
                              <div className="text-primary/80 text-xs font-bold px-1 py-0.5 mt-1">
                                ...y {(sessionsByDay[format(day, "yyyy-MM-dd")] || []).length - 3} más
                              </div>
                           )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </Card>

        <div className="lg:col-span-3 ml-6">
          <Card>
            <CardHeader>
              <CardTitle>
                Sesiones del{" "}
                {format(selectedDate, "d 'de' MMMM", { locale: es })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                 <div className="flex justify-center items-center h-48">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : selectedDaySessions.length > 0 ? (
                <div className="space-y-4">
                  {selectedDaySessions.map((session) => (
                    <div
                      key={session.id}
                      className="bg-card p-4 rounded-lg border border-border"
                    >
                      <p className="font-semibold">{session.patientName}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(session.date, "p", { locale: es })}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No hay sesiones para este día.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agendar Nueva Sesión</DialogTitle>
            <DialogDescription>
              Completa los detalles para agendar una nueva cita.
            </DialogDescription>
          </DialogHeader>
          <SessionForm
            patients={patients}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
            initialDate={selectedDate}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
