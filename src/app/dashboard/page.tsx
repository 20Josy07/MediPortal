
"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Video, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Session, Patient } from "@/lib/types";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function DashboardPage() {
  const { user, db, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [sessions, setSessions] = useState<Session[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
        const q = query(
          sessionsCollection, 
          where("date", ">=", new Date()), 
          orderBy("date"), 
          limit(4)
        );
        const sessionSnapshot = await getDocs(q);
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
        console.error("Error fetching dashboard data:", error);
        toast({
          variant: "destructive",
          title: "Error al cargar los datos del dashboard.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, db, authLoading, toast]);


  return (
    <div className="flex-1 space-y-4">
      <div className="space-y-4">
        <h3 className="mb-4 text-xl font-semibold">Resumen de la semana</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="text-center">
            <CardHeader className="flex flex-col items-center justify-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pacientes activos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{patients.filter(p => p.status === 'Activo').length}</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader className="flex flex-col items-center justify-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Sesiones completadas (semana)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader className="flex flex-col items-center justify-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ingresos estimados (semana)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$1,200</div>
            </CardContent>
          </Card>
        </div>
        <div>
          <h3 className="mb-4 text-xl font-semibold">Próximas sesiones</h3>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center font-bold">Paciente</TableHead>
                  <TableHead className="text-center font-bold">Fecha</TableHead>
                  <TableHead className="text-center font-bold">Hora</TableHead>
                  <TableHead className="text-center font-bold">Tipo</TableHead>
                  <TableHead className="text-center font-bold">Estado</TableHead>
                  <TableHead className="text-center font-bold">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
                    </TableCell>
                  </TableRow>
                ) : sessions.length > 0 ? (
                  sessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell className="text-center">{session.patientName}</TableCell>
                      <TableCell className="text-center">{format(session.date, 'yyyy-MM-dd')}</TableCell>
                      <TableCell className="text-center">{format(session.date, 'p')}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">{session.type}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={
                          session.status === 'Confirmada' ? 'bg-green-600/90' : 
                          session.status === 'Pendiente' ? 'bg-yellow-500 text-white' : 
                          'bg-red-600/90'
                        }>
                          {session.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {session.status === 'Confirmada' ? (
                          <Button variant="outline" size="sm">
                            <Video className="mr-2 h-4 w-4" />
                            Join
                          </Button>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No hay próximas sesiones agendadas.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </div>
  );
}
