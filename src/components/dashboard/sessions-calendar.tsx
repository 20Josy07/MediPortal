
"use client";

import * as React from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
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
  setMonth,
  addMonths,
  subMonths,
  getHours,
  getMinutes,
  isSameWeek,
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  areIntervalsOverlapping,
  addMinutes,
} from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Clock, User, Tag, CheckCircle, HelpCircle, XCircle, Loader2 } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [view, setView] = React.useState<"month" | "week" | "day">("month");

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
            date: data.date ? (data.date as any).toDate() : new Date(),
            endDate: data.endDate ? (data.endDate as any).toDate() : new Date(),
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

    const sessionData = { ...data };

    try {
      const sessionsCollection = collection(db, `users/${user.uid}/sessions`);
      if (selectedSession) {
        // Update logic here if needed
        const sessionDoc = doc(db, `users/${user.uid}/sessions`, selectedSession.id);
        await updateDoc(sessionDoc, sessionData);
        setSessions(sessions.map(s => s.id === selectedSession.id ? { id: s.id, ...sessionData } : s));
        toast({ title: "Sesión actualizada exitosamente." });
      } else {
        const docRef = await addDoc(sessionsCollection, sessionData);
        const newSession = { id: docRef.id, ...sessionData };
        setSessions([...sessions, newSession]);
        toast({ title: "Sesión agendada exitosamente." });
      }

      setIsFormOpen(false);
      setSelectedSession(null);
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

  const handleAddNewSession = (date?: Date) => {
    setSelectedSession(null);
    setSelectedDate(date || new Date());
    setIsFormOpen(true);
  };
  
  const handleEditSession = () => {
    if(selectedSession) {
      setIsDetailOpen(false);
      setIsFormOpen(true);
    }
  }
  
  const handleDeleteSession = async () => {
    if (!user || !selectedSession || !db) return;
    try {
      const sessionDoc = doc(db, `users/${user.uid}/sessions`, selectedSession.id);
      await deleteDoc(sessionDoc);
      setSessions(sessions.filter(s => s.id !== selectedSession.id));
      toast({ title: "Sesión eliminada exitosamente." });
      setIsDetailOpen(false);
      setSelectedSession(null);
    } catch (error) {
      console.error("Error deleting session:", error);
      toast({ variant: "destructive", title: "Error al eliminar la sesión." });
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

  const months = Array.from({ length: 12 }, (_, i) => 
    format(new Date(currentDate.getFullYear(), i), "MMMM", { locale: es })
  );

  const getStatusColor = (status: Session['status']) => {
    switch (status) {
      case "Confirmada":
        return "bg-green-500/80 hover:bg-green-500";
      case "Pendiente":
        return "bg-yellow-500 text-white hover:bg-yellow-500/90";
      case "Cancelada":
        return "bg-red-500/80 hover:bg-red-500";
      case "No asistió":
        return "bg-purple-500/80 hover:bg-purple-500";
      default:
        return "bg-gray-400/80 hover:bg-gray-400";
    }
  };
  
  const statusDetails: { [key in Session['status']]: { icon: React.ElementType, color: string, text: string } } = {
    Confirmada: { icon: CheckCircle, color: "text-green-500", text: "Confirmada" },
    Pendiente: { icon: HelpCircle, color: "text-yellow-500", text: "Pendiente" },
    Cancelada: { icon: XCircle, color: "text-red-500", text: "Cancelada" },
    "No asistió": { icon: XCircle, color: "text-purple-500", text: "No asistió"}
  };

  const IconComponent = selectedSession ? statusDetails[selectedSession.status]?.icon || HelpCircle : HelpCircle;
  
  const changeDate = (amount: number) => {
    if (view === "month") {
      setCurrentDate(prev => amount > 0 ? addMonths(prev, 1) : subMonths(prev, 1));
    } else if (view === "week") {
      setCurrentDate(prev => amount > 0 ? addWeeks(prev, 1) : subWeeks(prev, 1));
    } else {
      setCurrentDate(prev => amount > 0 ? addDays(prev, 1) : subDays(prev, 1));
    }
  };
  
  const formatHeader = () => {
      if (view === 'month') {
          return format(currentDate, "MMMM yyyy", { locale: es });
      }
      if (view === 'week') {
          const start = startOfWeek(currentDate, { locale: es });
          const end = endOfWeek(currentDate, { locale: es });
          if (isSameMonth(start, end)) {
              return `${format(start, 'd')} - ${format(end, 'd')} de ${format(end, 'MMMM, yyyy', { locale: es })}`;
          }
          return `${format(start, "d 'de' MMMM", { locale: es })} - ${format(end, "d 'de' MMMM, yyyy", { locale: es })}`;
      }
      return format(currentDate, "eeee, d 'de' MMMM, yyyy", { locale: es });
  };


  const renderMonthView = () => (
    <>
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
                    onClick={(e) => { e.stopPropagation(); handleSessionClick(session); }}
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
  );

  const renderWeekView = () => {
    const weekDays = eachDayOfInterval({
      start: startOfWeek(currentDate, { locale: es }),
      end: endOfWeek(currentDate, { locale: es }),
    });

    const timeSlots = Array.from({ length: 16 }, (_, i) => i + 7); // 7 AM to 10 PM

    const weekSessions = sessions.filter(session => isSameWeek(session.date, currentDate, { locale: es }));
  
    return (
      <div className="grid grid-cols-[auto,1fr] h-full overflow-y-auto">
        {/* Time column */}
        <div className="grid-rows-[auto,1fr]">
            <div className="h-10"></div> {/* Spacer for header */}
            <div className="relative">
                {timeSlots.map((hour) => (
                    <div key={hour} className="h-16 flex items-start justify-end pr-2 text-xs text-muted-foreground relative -top-2">
                        <span>{format(new Date(0,0,0,hour), 'h a')}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Days columns */}
        <div className="grid grid-cols-7">
          {weekDays.map((day, dayIndex) => (
            <div key={day.toString()} className="border-l border-border relative">
              <div className="sticky top-0 bg-background z-10 h-10 flex flex-col items-center justify-center border-b border-border">
                <span className="text-xs text-muted-foreground uppercase">{format(day, 'E', { locale: es })}</span>
                <span className={cn("text-lg font-bold", isSameDay(day, new Date()) && "text-primary")}>{format(day, 'd')}</span>
              </div>
              <div className="relative">
                {/* Grid lines */}
                {timeSlots.map((hour) => (
                  <div key={hour} className="h-16 border-b border-border"></div>
                ))}

                {/* Sessions */}
                {weekSessions
                  .filter(session => isSameDay(session.date, day))
                  .map(session => {
                      const startHour = getHours(session.date);
                      const startMinute = getMinutes(session.date);
                      const top = ((startHour - 7) * 64) + (startMinute / 60 * 64);
                      const height = (session.duration / 60) * 64; // Duration in hours * height per hour
                      const isShortSession = session.duration <= 45;

                      return (
                          <div
                            key={session.id}
                            onClick={() => handleSessionClick(session)}
                            className={cn(
                                "absolute w-[calc(100%-4px)] left-[2px] rounded-lg p-2 text-white text-xs cursor-pointer z-20 flex overflow-hidden",
                                getStatusColor(session.status),
                                isShortSession ? "flex-row items-center gap-2" : "flex-col"
                            )}
                            style={{ top: `${top}px`, height: `${height}px` }}
                          >
                            <span className="font-bold truncate">{session.patientName}</span>
                            <span className="truncate">{session.type}</span>
                          </div>
                      )
                  })
                }
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  

  const renderDayView = () => {
    const timeSlots = Array.from({ length: 16 }, (_, i) => i + 7); // 7 AM to 10 PM
    const daySessions = sessions.filter(session => isSameDay(session.date, currentDate));

    return (
      <div className="grid grid-cols-[auto,1fr] h-full overflow-y-auto">
        <div className="grid-rows-[auto,1fr]">
            <div className="h-10"></div>
            <div className="relative">
                {timeSlots.map((hour) => (
                    <div key={hour} className="h-16 flex items-start justify-end pr-2 text-xs text-muted-foreground relative -top-2">
                        <span>{format(new Date(0,0,0,hour), 'h a')}</span>
                    </div>
                ))}
            </div>
        </div>

        <div className="border-l border-border relative">
          <div className="sticky top-0 bg-background z-10 h-10 flex flex-col items-center justify-center border-b border-border">
            <span className={cn("text-lg font-bold", isSameDay(currentDate, new Date()) && "text-primary")}>{format(currentDate, 'd')}</span>
          </div>
          <div className="relative">
            {timeSlots.map((hour) => (
              <div key={hour} className="h-16 border-b border-border"></div>
            ))}
            {daySessions.map(session => {
              const startHour = getHours(session.date);
              const startMinute = getMinutes(session.date);
              const top = ((startHour - 7) * 64) + (startMinute / 60 * 64);
              const height = (session.duration / 60) * 64;
              const isShortSession = session.duration <= 45;

              return (
                  <div
                    key={session.id}
                    onClick={() => handleSessionClick(session)}
                    className={cn(
                        "absolute w-[calc(100%-8px)] left-[4px] rounded-lg p-2 text-white text-xs cursor-pointer z-20 flex",
                        getStatusColor(session.status),
                        isShortSession ? "flex-row items-center gap-2" : "flex-col items-start",
                        session.duration >= 90 && "justify-center"
                    )}
                    style={{ top: `${top}px`, height: `${height}px` }}
                  >
                    <span className="font-bold truncate">{session.patientName}</span>
                    <span className="truncate">{session.type} ({format(session.date, 'p', { locale: es })} - {format(session.endDate, 'p', { locale: es })})</span>
                  </div>
              )
            })}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <>
      <div className="flex justify-between items-center mb-4">
         <div className="flex items-center gap-4">
             <span className="text-xl font-bold capitalize">
                 {formatHeader()}
             </span>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => changeDate(-1)}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => changeDate(1)}>
                    <ChevronRight className="h-4 w-4" />
                </Button>
                 <Button variant="outline" className="h-8 px-3" onClick={() => setCurrentDate(new Date())}>
                    Hoy
                </Button>
              </div>
         </div>
         <div className="flex items-center gap-4">
            <Tabs defaultValue="month" onValueChange={(value) => setView(value as any)} className="w-auto">
                <TabsList className="h-8">
                <TabsTrigger value="month" className="h-6 px-2 text-xs">Mes</TabsTrigger>
                <TabsTrigger value="week" className="h-6 px-2 text-xs">Semana</TabsTrigger>
                <TabsTrigger value="day" className="h-6 px-2 text-xs">Día</TabsTrigger>
                </TabsList>
            </Tabs>
            <Button
                onClick={() => handleAddNewSession()}
                className="h-9 text-sm"
            >
                Agendar
            </Button>
         </div>
      </div>

      <Card className="h-full flex-grow overflow-hidden">
        <CardContent className="p-0 h-full">
            {isLoading ? (
              <div className="flex justify-center items-center h-[560px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
                <>
                  {view === 'month' && (
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
                        </div>
                        <div className="col-span-9 lg:col-span-10 p-4">
                            <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground mb-4">
                                {weekdays.map((day) => (
                                <div key={day} className="font-medium capitalize">
                                    {day}
                                </div>
                                ))}
                            </div>
                            {renderMonthView()}
                        </div>
                    </div>
                  )}
                  {view === 'week' && renderWeekView()}
                  {view === 'day' && renderDayView()}
                </>
            )}
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedSession ? 'Editar Sesión' : 'Agendar Nueva Sesión'}</DialogTitle>
            <DialogDescription>
              Completa los detalles para agendar una nueva cita.
            </DialogDescription>
          </DialogHeader>
          <SessionForm
            session={selectedSession}
            patients={patients}
            sessions={sessions}
            onSubmit={handleFormSubmit}
            onCancel={() => { setIsFormOpen(false); setSelectedSession(null); }}
            initialDate={selectedDate}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent>
          {selectedSession && (
            <AlertDialog>
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
                  <span>{format(selectedSession.date, "p", { locale: es })} - {format(selectedSession.endDate, "p", { locale: es })} ({selectedSession.duration} min)</span>
                </div>
                <div className="flex items-center gap-4">
                  <Tag className="w-5 h-5 text-muted-foreground" />
                  <Badge variant="outline">{selectedSession.type}</Badge>
                </div>
                <div className="flex items-center gap-4">
                  <IconComponent className={cn("w-5 h-5", statusDetails[selectedSession.status]?.color)} />
                  <span className={cn("font-semibold", statusDetails[selectedSession.status]?.color)}>
                    {statusDetails[selectedSession.status]?.text}
                  </span>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDetailOpen(false)}>Cerrar</Button>
                
                <AlertDialogTrigger asChild>
                    <Button variant="destructive">Eliminar</Button>
                </AlertDialogTrigger>
                
                <Button onClick={handleEditSession}>Editar</Button>
              </div>

               <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. Se eliminará permanentemente la sesión.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteSession}>Continuar</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>

            </AlertDialog>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
