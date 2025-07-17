
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
  setMonth
} from "date-fns";
import { es } from "date-fns/locale";
import { Clock, User, Tag, CheckCircle, HelpCircle, XCircle, Loader2 } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
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
  const [selectedSession, setSelectedSession] = React.useState<Session | null>(null);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);

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
  
  const handleSessionClick = (session: Session) => {
    setSelectedSession(session);
    setIsDetailOpen(true);
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
  
  const statusDetails: { [key in Session['status']]: { icon: React.ElementType, color: string, text: string } } = {
    Confirmada: { icon: CheckCircle, color: "text-green-500", text: "Confirmada" },
    Pendiente: { icon: HelpCircle, color: "text-yellow-500", text: "Pendiente" },
    Cancelada: { icon: XCircle, color: "text-red-500", text: "Cancelada" },
  };

  const IconComponent = selectedSession ? statusDetails[selectedSession.status].icon : null;

  return (
    <>
      <div className="grid grid-cols-1">
        <Card className="h-full">
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
                                onClick={() => handleSessionClick(session)}
                                className={cn(
                                  "text-xs leading-tight rounded-md px-2 py-1 text-white truncate cursor-pointer",
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
      
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent>
          {selectedSession && (
            <>
              <DialogHeader>
                <DialogTitle>Detalles de la Sesión</DialogTitle>
                <DialogDescription>
                   {format(selectedSession.date, "eeee, d 'de' MMMM, yyyy", { locale: es })}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-4">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">{selectedSession.patientName}</span>
                </div>
                <div className="flex items-center gap-4">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <span>{format(selectedSession.date, "p", { locale: es })}</span>
                </div>
                <div className="flex items-center gap-4">
                  <Tag className="w-5 h-5 text-muted-foreground" />
                  <Badge variant="outline">{selectedSession.type}</Badge>
                </div>
                <div className="flex items-center gap-4">
                  {IconComponent && (
                     <IconComponent className={cn("w-5 h-5", statusDetails[selectedSession.status].color)} />
                  )}
                  <span className={cn("font-semibold", statusDetails[selectedSession.status].color)}>
                    {statusDetails[selectedSession.status].text}
                  </span>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
