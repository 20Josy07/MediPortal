'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { getButtonClicks, getReportStats } from "@/lib/reportService";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserProfile } from "@/lib/types";

export default function ReportesPage() {
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    totalPacientes: 0,
    totalSesiones: 0,
    totalClics: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);
  const [buttonClicks, setButtonClicks] = useState<Record<string, number>>({});


  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        
        if (!user) {
          setError("Usuario no autenticado");
          setIsLoading(false);
          return;
        }

        // Obtener el perfil del usuario
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
          setError("Perfil de usuario no encontrado");
          setIsLoading(false);
          return;
        }

        const userData = userDoc.data() as UserProfile;
        setUserRole(userData.role || 'user');

        // Si el usuario es administrador, cargar las estadísticas
        if (userData.role === 'admin') {
          await loadStats();
        } else {
          setError("Acceso denegado. No tienes permisos para ver esta sección.");
        }
      } catch (err) {
        console.error("Error al verificar el rol del usuario:", err);
        setError("Error al cargar los permisos del usuario");
      } finally {
        setIsLoading(false);
      }
    };

    const loadStats = async () => {
      try {
        const data = await getReportStats();
        setStats(data);
        setError(null);
      } catch (err) {
        console.error("Error al cargar estadísticas:", err);
        setError("Error al cargar las estadísticas. Por favor, intenta de nuevo más tarde.");
      }
    };

    checkUserRole();
  }, []);

  // Agrega este useEffect para cargar los clics
    useEffect(() => {
        const loadButtonClicks = async () => {
        try {
            const clicks = await getButtonClicks();
            setButtonClicks(clicks);
        } catch (error) {
            console.error("Error al cargar clics de botones:", error);
        }
        };
    
        if (userRole === 'admin') {
        loadButtonClicks();
        }
    }, [userRole]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  // Si el usuario no es administrador, ya mostramos el mensaje de error
  if (userRole !== 'admin') {
    return (
      <div className="container mx-auto p-6">
        <div className="text-red-500">Acceso denegado. No tienes permisos para ver esta sección.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Reportes y Estadísticas</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard 
          title="Total Usuarios" 
          value={stats.totalUsuarios} 
          isLoading={isLoading} 
        />
        <StatCard 
          title="Total Pacientes" 
          value={stats.totalPacientes} 
          isLoading={isLoading} 
        />
        <StatCard 
          title="Total Sesiones" 
          value={stats.totalSesiones} 
          isLoading={isLoading} 
        />
        <StatCard 
          title="Pacientes Creados" 
          value={buttonClicks['new_patient_created'] || 0} 
          isLoading={isLoading} 
        />
        <StatCard 
          title="Sesiones Creadas" 
          value={buttonClicks['session_created'] || 0} 
          isLoading={isLoading} 
        />
        <StatCard 
          title="Sesiones Grabadas" 
          value={buttonClicks['session_recorded'] || 0} 
          isLoading={isLoading} 
        />
        <StatCard 
          title="Sesiones Cargadas" 
          value={buttonClicks['session_loaded'] || 0} 
          isLoading={isLoading} 
        />
        <StatCard 
          title="Notas Guardadas" 
          value={buttonClicks['note_saved'] || 0} 
          isLoading={isLoading} 
        />
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Otras Estadísticas</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(buttonClicks)
              .filter(([buttonId]) => buttonId !== 'new_patient_created' && buttonId !== 'session_created' && buttonId !== 'session_recorded' && buttonId !== 'session_loaded' && buttonId !== 'note_saved')
              .map(([buttonId, count]) => (
                <Card key={buttonId}>
                    <CardHeader>
                    <CardTitle className="text-sm font-medium">
                        {buttonId === 'login_email' ? 'Inicios de sesión (Email)' : 
                         buttonId === 'login_google' ? 'Inicios de sesión (Google)' : 
                         buttonId}
                    </CardTitle>
                    </CardHeader>
                    <CardContent>
                    <div className="text-2xl font-bold">{count}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : (
              <p>Gráfico de actividad reciente irá aquí</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribución</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : (
              <p>Gráfico de distribución irá aquí</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

type StatCardProps = {
  title: string;
  value: number;
  isLoading: boolean;
};

function StatCard({ title, value, isLoading }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  );
}