
"use client";

import * as React from "react";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
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
} from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
        // Fetch Patients
        const patientsCollection = collection(db, `users/${user.uid}/patients`);
        const patientSnapshot = await getDocs(patientsCollection);
        const patientList = patientSnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Patient)
        );
        setPatients(patientList);

        // Fetch Sessions
        const sessionsCollection = collection(db, `users/${user.uid}/sessions`);
        const sessionSnapshot = await getDocs(sessionsCollection);
        const sessionList = sessionSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            date: (data.date as any).toDate(), // Convert Firestore Timestamp to Date
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

  const handleFormSubmit = async (data: Omit<Session, "id">) => {
    if (!user || !db) {
      toast({
        variant: "destructive",
        title: "Error de autenticación. Intenta de nuevo.",
      });
      return;
    }
    try {
      const sessionsCollection = collection(db, `users/${user.uid}/sessions`);
      const docRef = await addDoc(sessionsCollection, data);
      const newSession = { id: docRef.id, ...data };
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

  const selectedDaySessions = React.useMemo(() => {
    const dayKey = format(selectedDate, "yyyy-MM-dd");
    return (sessionsByDay[dayKey] || []).sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
  }, [selectedDate, sessionsByDay]);
  
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Mi Agenda</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-lg font-semibold w-32 text-center capitalize">
              {format(currentDate, "MMMM yyyy", { locale: es })}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" onClick={() => setCurrentDate(new Date())}>
            Hoy
          </Button>
          <Button onClick={() => setIsFormOpen(true)}>Agendar Nueva Sesión</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardContent className="p-4">
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
                        "relative p-2 h-28 rounded-md cursor-pointer transition-colors",
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
                      <div className="absolute bottom-2 left-2 right-2 space-y-1">
                        {(sessionsByDay[format(day, "yyyy-MM-dd")] || [])
                          .slice(0, 2)
                          .map((session) => (
                            <div
                              key={session.id}
                              className="bg-primary/80 text-primary-foreground text-[10px] rounded-sm px-1 py-0.5 truncate"
                            >
                              {format(session.date, "HH:mm")} -{" "}
                              {session.patientName}
                            </div>
                          ))}
                         {(sessionsByDay[format(day, "yyyy-MM-dd")] || []).length > 2 && (
                            <div className="text-primary/80 text-[10px] font-bold px-1 py-0.5 truncate">
                              ...y {(sessionsByDay[format(day, "yyyy-MM-dd")] || []).length - 2} más
                            </div>
                         )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
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
                    <div className="flex justify-between items-center mt-1">
                       <p className="text-sm capitalize">
                        <span className="text-muted-foreground">Tipo: </span>
                        {session.type}
                      </p>
                      <p className="text-sm capitalize">
                        <span className="text-muted-foreground">Estado: </span>
                        {session.status}
                      </p>
                    </div>
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
