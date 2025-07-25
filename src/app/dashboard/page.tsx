
"use client";

import { useState, useEffect, useMemo } from "react";
import { collection, onSnapshot, query, where, orderBy, getDocs } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Video, Loader2, Users, CalendarOff, CheckCircle, HelpCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Session, Patient } from "@/lib/types";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { format, isToday, isTomorrow, startOfDay, endOfDay } from "date-fns";
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

  const [sessions, setSessions] = useState<Session[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (authLoading || !user || !db) {
        if (!authLoading) setIsLoading(false);
        return;
    }

    setIsLoading(true);

    const fetchPatients = async () => {
        try {
            const patientsCollection = collection(db, `users/${user.uid}/patients`);
            const patientSnapshot = await getDocs(patientsCollection);
            const patientList = patientSnapshot.docs.map(
              (doc) => ({ id: doc.id, ...doc.data() } as Patient)
            );
            setPatients(patientList);
        } catch (error) {
             console.error("Error fetching patients:", error);
             toast({
                variant: "destructive",
                title: "Error al cargar los pacientes.",
            });
        }
    };
    fetchPatients();

    const sessionsCollection = collection(db, `users/${user.uid}/sessions`);
    const q = query(
      sessionsCollection,
      where("date", ">=", startOfDay(new Date())),
      orderBy("date")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const sessionList = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                date: data.date ? (data.date as any).toDate() : new Date(),
                endDate: data.endDate ? (data.endDate as any).toDate() : new Date(),
            } as Session;
        });
        setSessions(sessionList);
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

    return () => unsubscribe();
  }, [user, db, authLoading, toast]);
  
  const filteredSessions = useMemo(() => {
    if (filter === "today") {
      return sessions.filter(session => isToday(session.date));
    }
    if (filter === "tomorrow") {
      return sessions.filter(session => isTomorrow(session.date));
    }
    return sessions;
  }, [sessions, filter]);

  return (
    <div className="flex-1 space-y-6">
      <DashboardAlerts sessions={sessions} />
      
      <div>
        <h3 className="mb-4 text-xl font-semibold">Resumen de la semana</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pacientes activos
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{patients.filter(p => p.status === 'Activo').length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Sesiones completadas
              </CardTitle>
               <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">0</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Nuevos pacientes
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">0</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Sesiones canceladas
              </CardTitle>
              <CalendarOff className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">0</div>
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
                  <TableHead>Paciente</TableHead>
                  <TableHead className="hidden md:table-cell">Fecha</TableHead>
                  <TableHead className="hidden md:table-cell">Hora</TableHead>
                  <TableHead className="hidden sm:table-cell">Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acción</TableHead>
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
                        <TableCell>
                           <div className="font-medium">{session.patientName}</div>
                           <div className="text-sm text-muted-foreground md:hidden">{format(session.date, 'PPp', {locale: es})}</div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{format(session.date, 'PP', {locale: es})}</TableCell>
                        <TableCell className="hidden md:table-cell">{format(session.date, 'p', {locale: es})}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant="outline">{session.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className={cn("flex items-center gap-2 font-medium", statusDetails[session.status].className)}>
                            <StatusIcon className="h-4 w-4"/>
                            <span>{statusDetails[session.status].text}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
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
