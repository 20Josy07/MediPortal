
"use client";

import { useState, useEffect, useMemo } from "react";
import { collection, onSnapshot, query, orderBy, where, Timestamp, limit, getDocs } from "firebase/firestore";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import type { Session, Patient, Note } from "@/lib/types";
import { format, isToday, startOfDay, endOfDay, isFuture, subDays, addMinutes, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

import {
  Calendar,
  Users,
  FileText,
  BarChart3,
  Clock,
  UserPlus,
  CalendarDays,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Activity,
  Brain,
  Heart,
  Target,
  NotebookText,
  Loader2,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type ActivityItem = 
  | (Session & { activityType: 'session'; activityDate: Date; })
  | (Note & { activityType: 'note'; activityDate: Date; patientName?: string; })
  | (Patient & { activityType: 'patient'; activityDate: Date; });


export default function DashboardPage() {
    const { user, db, userProfile, loading: authLoading } = useAuth();
    const { toast } = useToast();

    const [sessions, setSessions] = useState<Session[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [recentNotes, setRecentNotes] = useState<Note[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingNotes, setIsLoadingNotes] = useState(true);
    const [pendingNotesCount, setPendingNotesCount] = useState(0);


    useEffect(() => {
        if (authLoading || !user || !db) {
            if (!authLoading) setIsLoading(false);
            return;
        }

        setIsLoading(true);

        const patientsCollection = collection(db, `users/${user.uid}/patients`);
        const unsubscribePatients = onSnapshot(query(patientsCollection, orderBy("createdAt", "desc")), (patientSnapshot) => {
            const patientList = patientSnapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt ? (data.createdAt as any).toDate() : new Date(0),
                } as Patient;
            });
            setPatients(patientList);
        }, (error) => {
            console.error("Error fetching patients:", error);
            toast({ variant: "destructive", title: "Error al cargar los pacientes." });
        });

        const now = new Date();
        const startOfToday = startOfDay(now);

        const sessionsCollection = collection(db, `users/${user.uid}/sessions`);
        const qSessions = query(
            sessionsCollection,
            orderBy("date")
        );

        const unsubscribeSessions = onSnapshot(qSessions, (snapshot) => {
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
                description: "Puede que necesites crear un índice en Firestore. Revisa la consola para más detalles."
            });
            setIsLoading(false);
        });
        
        const fetchRecentNotesAndPendingCount = async () => {
            setIsLoadingNotes(true);
            try {
                const allNotes: Note[] = [];
                let pendingCount = 0;
                const patientDocs = await getDocs(patientsCollection);
                for (const patientDoc of patientDocs.docs) {
                    const notesCollectionRef = collection(db, `users/${user.uid}/patients/${patientDoc.id}/notes`);
                    const notesSnapshot = await getDocs(notesCollectionRef);
                    notesSnapshot.forEach(doc => {
                        const data = doc.data();
                        const note = {
                            id: doc.id,
                            patientId: patientDoc.id,
                            ...data,
                            createdAt: data.createdAt.toDate(),
                        } as Note;
                        
                        allNotes.push(note);
                        if (note.status === 'Draft') {
                            pendingCount++;
                        }
                    });
                }
                 // Sort all notes by date and take the most recent 5 for the activity feed
                allNotes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
                setRecentNotes(allNotes.slice(0, 5));
                setPendingNotesCount(pendingCount);
            } catch (e) {
                console.error("Error fetching notes:", e);
                toast({ variant: "destructive", title: "Error al cargar notas." });
            } finally {
                setIsLoadingNotes(false);
            }
        };

        fetchRecentNotesAndPendingCount();

        return () => {
            unsubscribePatients();
            unsubscribeSessions();
        };
    }, [user, db, authLoading, toast]);


    const stats = useMemo(() => {
        const todaySessions = sessions.filter(s => isToday(s.date));
        const activePatients = patients.filter(p => p.status === 'Activo');
        const newPatientsThisMonth = patients.filter(p => p.createdAt && p.createdAt >= startOfDay(subDays(new Date(), 30))).length;
        
        return {
            sessionsTodayCount: todaySessions.length,
            activePatientsCount: activePatients.length,
            newPatientsThisMonth,
        }
    }, [sessions, patients]);

    const upcomingSessions = useMemo(() => {
        return sessions.filter(s => isFuture(s.date) || isToday(s.date)).sort((a, b) => a.date.getTime() - b.date.getTime());
    }, [sessions]);

    const nextSession = upcomingSessions[0];
    
    const todaySchedule = useMemo(() => {
        return sessions
            .filter(s => isToday(s.date))
            .sort((a, b) => a.date.getTime() - b.date.getTime());
    }, [sessions]);

    const recentActivity = useMemo((): ActivityItem[] => {
        const completedSessions: ActivityItem[] = sessions
            .filter(s => s.status === 'Confirmada' && !isFuture(s.date)) 
            .map(s => ({ ...s, activityType: 'session', activityDate: s.date }));

        const notesAsActivity: ActivityItem[] = recentNotes.map(n => {
            const patient = patients.find(p => p.id === n.patientId);
            return { ...n, activityType: 'note', activityDate: n.createdAt, patientName: patient?.name || 'Desconocido' };
        });

        const newPatientsAsActivity: ActivityItem[] = patients
            .map(p => ({ ...p, activityType: 'patient', activityDate: p.createdAt }));

        const combined = [...completedSessions, ...notesAsActivity, ...newPatientsAsActivity];
        
        return combined
            .sort((a, b) => b.activityDate.getTime() - a.activityDate.getTime())
            .slice(0, 5);
    }, [sessions, recentNotes, patients]);


    if (isLoading) {
        return (
          <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        );
    }

    const getActivityIcon = (activity: ActivityItem) => {
        switch (activity.activityType) {
            case 'session':
                return (
                    <div className="rounded-full bg-green-100 p-1 dark:bg-green-900">
                        <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
                    </div>
                );
            case 'note':
                return (
                    <div className="rounded-full bg-purple-100 p-1 dark:bg-purple-900">
                        <NotebookText className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                    </div>
                );
            case 'patient':
                return (
                    <div className="rounded-full bg-blue-100 p-1 dark:bg-blue-900">
                        <UserPlus className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                    </div>
                );
            default:
                return null;
        }
    };

    const getActivityText = (activity: ActivityItem) => {
        switch (activity.activityType) {
            case 'session':
                return {
                    title: 'Sesión completada',
                    description: `${activity.patientName} - ${activity.type}`
                };
            case 'note':
                return {
                    title: `Nota ${activity.type === 'Voz' ? 'de voz' : 'de texto'} creada`,
                    description: `${activity.patientName} - "${activity.title}"`
                };
            case 'patient':
                return {
                    title: 'Nuevo paciente agregado',
                    description: activity.name
                };
            default:
                return { title: '', description: '' };
        }
    };
    
    const getStatusBadge = (status: Session['status']): { variant: "success" | "warning" | "danger" | "info" | "default"; icon: React.ElementType } => {
        switch (status) {
            case "Confirmada":
                return { variant: "success", icon: CheckCircle2 };
            case "Pendiente":
                return { variant: "warning", icon: Clock };
            case "Cancelada":
                 return { variant: "danger", icon: AlertCircle };
            case "No asistió":
                return { variant: "info", icon: AlertCircle };
            default:
                return { variant: "default", icon: AlertCircle };
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
            <main className="p-6 space-y-6">
                {/* Important Alerts */}
                <div className="grid gap-4 md:grid-cols-2">
                    {pendingNotesCount > 0 && (
                        <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
                            <AlertCircle className="h-4 w-4 text-amber-600" />
                            <AlertDescription className="text-amber-800 dark:text-amber-200">
                                <strong>{pendingNotesCount} {pendingNotesCount === 1 ? 'nota clínica pendiente' : 'notas clínicas pendientes'}</strong> por completar. 
                                <Link href="/dashboard/notes" className="font-semibold underline ml-1">Ir a notas</Link>
                            </AlertDescription>
                        </Alert>
                    )}
                    {nextSession && (
                         <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
                            <Calendar className="h-4 w-4 text-blue-600" />
                            <AlertDescription className="text-blue-800 dark:text-blue-200">
                                <strong>Próxima cita</strong> a las {format(nextSession.date, 'p', { locale: es })} - {nextSession.patientName}
                            </AlertDescription>
                        </Alert>
                    )}
                </div>

                {/* Enhanced Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent"></div>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sesiones Hoy</CardTitle>
                        <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                            <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{stats.sessionsTodayCount}</div>
                            <Progress value={stats.sessionsTodayCount * 10} className="mt-2 h-1" />
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent"></div>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pacientes Activos</CardTitle>
                        <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                            <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.activePatientsCount}</div>
                             <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <TrendingUp className="h-3 w-3 text-green-500" />
                                +{stats.newPatientsThisMonth} este mes
                            </div>
                            <Progress value={stats.activePatientsCount} className="mt-2 h-1" />
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent"></div>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sesiones por Reprogramar</CardTitle>
                        <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-900">
                            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-amber-600">4</div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                Canceladas esta semana
                            </div>
                            <Progress value={15} className="mt-2 h-1" />
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent"></div>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ingresos Mes</CardTitle>
                        <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900">
                            <BarChart3 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-600">$12,450</div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <TrendingUp className="h-3 w-3 text-green-500" />
                                +15% vs mes anterior
                            </div>
                            <Progress value={78} className="mt-2 h-1" />
                        </CardContent>
                    </Card>
                </div>

                {/* Main Dashboard Grid */}
                <div className="grid gap-6 lg:grid-cols-12">
                    {/* Today's Schedule */}
                    <Card className="lg:col-span-8 shadow-sm">
                        <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                            <CalendarDays className="h-5 w-5 text-primary" />
                            <CardTitle>Agenda de Hoy</CardTitle>
                            </div>
                             <Badge variant="outline" className="text-xs">
                                {todaySchedule.length} sesiones programadas
                            </Badge>
                        </div>
                        <CardDescription>{format(new Date(), "eeee, d 'de' MMMM yyyy", { locale: es })}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                        {todaySchedule.length > 0 ? todaySchedule.map((session, index) => {
                            const statusInfo = getStatusBadge(session.status);
                            const Icon = statusInfo.icon;
                            return (
                                <div
                                    key={index}
                                    className="group flex items-center justify-between rounded-xl border border-border p-4 transition-all hover:shadow-md hover:border-primary/20"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-muted to-muted/50 text-sm font-semibold">
                                            {format(session.date, 'HH:mm')}
                                        </div>
                                        <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold text-foreground">{session.patientName}</p>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{session.type}</p>
                                        <p className="text-xs text-muted-foreground">{session.duration} min</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant={statusInfo.variant}
                                            className="text-xs"
                                        >
                                            <Icon className="mr-1 h-3 w-3" />
                                            {session.status}
                                        </Badge>
                                    </div>
                                </div>
                            )
                        }) : (
                            <div className="text-center py-10 text-muted-foreground">
                                No hay sesiones programadas para hoy.
                            </div>
                        )}
                        </CardContent>
                    </Card>

                    {/* Right Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        <Card className="shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2">
                            <Heart className="h-4 w-4 text-primary" />
                            Acciones Rápidas
                            </CardTitle>
                            <CardDescription>Herramientas de uso frecuente</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Link href="/dashboard/patients">
                            <Button
                                className="w-full justify-start h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md"
                                size="lg"
                            >
                                <UserPlus className="mr-3 h-4 w-4" />
                                <div className="text-left">
                                <div className="font-medium">Gestionar Pacientes</div>
                                <div className="text-xs opacity-90">Ver y editar perfiles</div>
                                </div>
                            </Button>
                            </Link>
                            <Link href="/dashboard/sessions">
                            <Button
                                className="w-full justify-start h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md"
                                size="lg"
                            >
                                <Calendar className="mr-3 h-4 w-4" />
                                <div className="text-left">
                                <div className="font-medium">Nueva Cita</div>
                                <div className="text-xs opacity-90">Programar sesión</div>
                                </div>
                            </Button>
                            </Link>
                            <Link href="/dashboard/notes">
                            <Button
                                className="w-full justify-start h-12 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-md"
                                size="lg"
                            >
                                <FileText className="mr-3 h-4 w-4" />
                                <div className="text-left">
                                <div className="font-medium">Notas Clínicas</div>
                                <div className="text-xs opacity-90">Documentar sesión</div>
                                </div>
                            </Button>
                            </Link>
                        </CardContent>
                        </Card>
                        <Card className="shadow-sm">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2">
                                <Activity className="h-4 w-4 text-primary" />
                                Actividad Reciente
                                </CardTitle>
                                <CardDescription>Últimas actualizaciones del sistema</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {isLoadingNotes ? (
                                    <>
                                        <div className="flex items-center space-x-4">
                                            <Skeleton className="h-8 w-8 rounded-full" />
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 w-[200px]" />
                                                <Skeleton className="h-4 w-[150px]" />
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <Skeleton className="h-8 w-8 rounded-full" />
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 w-[200px]" />
                                                <Skeleton className="h-4 w-[150px]" />
                                            </div>
                                        </div>
                                         <div className="flex items-center space-x-4">
                                            <Skeleton className="h-8 w-8 rounded-full" />
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 w-[200px]" />
                                                <Skeleton className="h-4 w-[150px]" />
                                            </div>
                                        </div>
                                    </>
                                ) : recentActivity.length > 0 ? (
                                    recentActivity.map((activity) => {
                                        const { title, description } = getActivityText(activity);
                                        return (
                                            <div key={`${activity.activityType}-${activity.id}`} className="flex items-start gap-3">
                                                {getActivityIcon(activity)}
                                                <div className="space-y-1 text-sm">
                                                    <p className="font-medium text-foreground">{title}</p>
                                                    <p className="text-muted-foreground truncate max-w-[240px]">{description}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatDistanceToNow(activity.activityDate, { addSuffix: true, locale: es })}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-4">No hay actividad reciente.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )

    