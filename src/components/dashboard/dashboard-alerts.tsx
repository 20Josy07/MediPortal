
"use client";

import * as React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bell, Info, TriangleAlert } from "lucide-react";
import type { Session } from "@/lib/types";
import { isToday } from "date-fns";

interface DashboardAlertsProps {
  sessions: Session[];
}

interface AlertMessage {
  id: string;
  type: "info" | "warning" | "default";
  title: string;
  description: string;
}

export function DashboardAlerts({ sessions }: DashboardAlertsProps) {
  const alerts = React.useMemo(() => {
    const todaySessions = sessions.filter(session => isToday(session.date) && session.status !== 'Cancelada');
    const newAlerts: AlertMessage[] = [];

    if (todaySessions.length > 0) {
      newAlerts.push({
        id: "today-sessions",
        type: "info",
        title: "Sesiones para Hoy",
        description: `Tienes ${todaySessions.length} ${todaySessions.length === 1 ? 'sesión programada' : 'sesiones programadas'} para hoy.`,
      });
    }

    // You can add more alert logic here in the future.
    // For example, checking for sessions without notes.
    // newAlerts.push({
    //   id: 'missing-notes',
    //   type: 'warning',
    //   title: 'Notas Pendientes',
    //   description: 'Tienes 3 sesiones pasadas sin notas. ¡No olvides completarlas!',
    // });
    
    return newAlerts;
  }, [sessions]);

  if (alerts.length === 0) {
    return null;
  }

  const getIcon = (type: AlertMessage['type']) => {
    switch (type) {
        case 'info': return <Info className="h-4 w-4" />;
        case 'warning': return <TriangleAlert className="h-4 w-4" />;
        default: return <Bell className="h-4 w-4" />;
    }
  }

  return (
    <div className="space-y-2">
      {alerts.map((alert) => (
        <Alert key={alert.id}>
            {getIcon(alert.type)}
            <AlertTitle>{alert.title}</AlertTitle>
            <AlertDescription>{alert.description}</AlertDescription>
        </Alert>
      ))}
    </div>
  );
}
