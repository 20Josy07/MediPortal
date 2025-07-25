
"use client";

import { useState, useEffect, useMemo } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Video, Loader2, Users, CalendarOff, CheckCircle, HelpCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Session, Patient } from "@/lib/types";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { format, isToday, isTomorrow, startOfDay, subDays, isPast } from "date-fns";
import { es } from "date-fns/locale";
import { DashboardAlerts } from "@/components/dashboard/dashboard-alerts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const statusDetails: { [key in Session['status']]: { icon: React.ElementType, text: string, className: string } } = {
  Confirmada: { icon: CheckCircle, text: "Confirmada", className: "text-green-600 dark:text-green-500" },
  Pendiente: { icon: HelpCircle, text: "Pendiente", className: "text-yellow-600 dark:text-yellow-500" },
  Cancelada: { icon: XCircle, text: "Cancelada", className: "text-red-600 dark:text-red-500" },
  "No asistió": { icon: XCircle, text: "No asistió", className: "text-purple-600 dark:text-purple-500" }
};

export default function DashboardPage() {
  const { user, db, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [allSessions, setAllSessions] = useState<Session[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (authLoading || !user || !db) {
        if (!authLoading) setIsLoading(false);
        return;
    }

    setIsLoading(true);

    const patientsCollection = collection(db, `users/${user.uid}/patients`);
    const unsubscribePatients = onSnapshot(patientsCollection, (patientSnapshot) => {
        const patientList = patientSnapshot.docs.map((doc) => {
            const data = doc.data();
            return { 
                id: doc.id,
                ...data,
                createdAt: data.createdAt ? (data.createdAt as any).toDate() : new Date(0), // handle legacy patients
            } as Patient;
        });
        setPatients(patientList);
    }, (error) => {
        console.error("Error fetching patients:", error);
        toast({
            variant: "destructive",
            title: "Error al cargar los pacientes.",
        });
    });


    const sessionsCollection = collection(db, `users/${user.uid}/sessions`);
    const q = query(
      sessionsCollection,
      orderBy("date")
    );

    const unsubscribeSessions = onSnapshot(q, (snapshot) => {
        const sessionList = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                date: data.date ? (data.date as any).toDate() : new Date(),
                endDate: data.endDate ? (data.endDate as any).toDate() : new Date(),
            } as Session;
        });
        setAllSessions(sessionList);
        setIsLoading(false);
    }, (error) => {
        console.error("Error fetching sessions:", error);
        toast({
          variant: "destructive",
          title: "Error al cargar las sesiones.",
          description: "Puede que necesites crear un índice en Firestore. Revisa la consola de errores para más detalles."
        });
        setIsLoading(false);
    });

    return () => {
        unsubscribePatients();
        unsubscribeSessions();
    };
  }, [user, db, authLoading, toast]);

  const upcomingSessions = useMemo(() => {
    return allSessions.filter(session => session.date >= startOfDay(new Date()));
  }, [allSessions]);
  
  const filteredSessions = useMemo(() => {
    if (filter === "today") {
      return upcomingSessions.filter(session => isToday(session.date));
    }
    if (filter === "tomorrow") {
      return upcomingSessions.filter(session => isTomorrow(session.date));
    }
    return upcomingSessions;
  }, [upcomingSessions, filter]);

  const newPatientsThisWeek = useMemo(() => {
    const oneWeekAgo = subDays(new Date(), 7);
    return patients.filter(p => p.createdAt && p.createdAt >= oneWeekAgo).length;
  }, [patients]);
  
  const canceledSessionsCount = useMemo(() => {
      return allSessions.filter(s => s.status === 'Cancelada').length;
  }, [allSessions]);

  const completedSessionsCount = useMemo(() => {
      return allSessions.filter(s => s.status === 'No asistió' || (s.status === 'Confirmada' && isPast(s.date))).length;
  }, [allSessions]);


  return (
    <div className="flex-1 space-y-6">
      <DashboardAlerts sessions={upcomingSessions} />
      
      <div>
        <h3 className="mb-4 text-xl font-semibold">Resumen de la semana</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-col items-center justify-center space-y-2 pb-2">
              <Users className="h-6 w-6 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">
                Pacientes activos
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-primary">{patients.filter(p => p.status === 'Activo').length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-col items-center justify-center space-y-2 pb-2">
               <CheckCircle className="h-6 w-6 text-muted-foreground" />
               <CardTitle className="text-sm font-medium">
                Sesiones completadas
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-primary">{completedSessionsCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-col items-center justify-center space-y-2 pb-2">
              <Users className="h-6 w-6 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">
                Nuevos pacientes
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-primary">{newPatientsThisWeek}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-col items-center justify-center space-y-2 pb-2">
              <CalendarOff className="h-6 w-6 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">
                Sesiones canceladas
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-primary">{canceledSessionsCount}</div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Próximas sesiones</h3>
            <Tabs defaultValue="all" onValueChange={setFilter} className="w-auto">
              <TabsList>
                <TabsTrigger value="all">Todas</TabsTrigger>
                <TabsTrigger value="today">Hoy</TabsTrigger>
                <TabsTrigger value="tomorrow">Mañana</TabsTrigger>
              </TabsList>
            </Tabs>
        </div>
        <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center font-bold text-base">Paciente</TableHead>
                  <TableHead className="hidden md:table-cell text-center font-bold text-base">Fecha</TableHead>
                  <TableHead className="hidden md:table-cell text-center font-bold text-base">Hora</TableHead>
                  <TableHead className="hidden sm:table-cell text-center font-bold text-base">Tipo</TableHead>
                  <TableHead className="text-center font-bold text-base">Estado</TableHead>
                  <TableHead className="text-center font-bold text-base">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
                    </TableCell>
                  </TableRow>
                ) : filteredSessions.length > 0 ? (
                  filteredSessions.map((session) => {
                    const StatusIcon = statusDetails[session.status].icon;
                    return (
                      <TableRow key={session.id}>
                        <TableCell className="text-center">
                           <div className="font-medium">{session.patientName}</div>
                           <div className="text-sm text-muted-foreground md:hidden">{format(session.date, 'PPp', {locale: es})}</div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-center">{format(session.date, 'PP', {locale: es})}</TableCell>
                        <TableCell className="hidden md:table-cell text-center">{format(session.date, 'p', {locale: es})}</TableCell>
                        <TableCell className="hidden sm:table-cell text-center">
                          <Badge variant="outline">{session.type}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className={cn("flex items-center justify-center gap-2 font-medium", statusDetails[session.status].className)}>
                            <StatusIcon className="h-4 w-4"/>
                            <span>{statusDetails[session.status].text}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {session.status === 'Confirmada' ? (
                            <Button variant="default" size="sm">
                              <Video className="mr-2 h-4 w-4" />
                              Unirse
                            </Button>
                          ) : null}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No hay próximas sesiones agendadas para esta vista.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
        </Card>
      </div>
    </div>
  );
}
