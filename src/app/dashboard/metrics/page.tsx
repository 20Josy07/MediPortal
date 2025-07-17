import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GrowthHistoryChart } from "@/components/dashboard/metrics/growth-history-chart";
import { AttendanceChart } from "@/components/dashboard/metrics/attendance-chart";
import { DollarSign, Calendar, Users, ArrowUp, ChevronDown } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default function MetricsPage() {
  return (
    <div className="flex-1 space-y-4">
      <DashboardHeader title="Métricas de la Práctica" />
      <div className="space-y-2">
        <p className="text-muted-foreground">
          Monitorea el crecimiento y la eficiencia de tu consultorio.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ingresos Netos (Estimados)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,850</div>
            <p className="text-xs text-green-500 flex items-center gap-1">
              <ArrowUp className="h-3 w-3" />
              +8% vs. mes anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sesiones Completadas
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">37</div>
            <p className="text-xs text-muted-foreground">
              +12 vs. mes anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pacientes Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">22</div>
            <p className="text-xs text-green-500">
              +2 nuevos este mes
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
             <div>
                <CardTitle>Historial de Crecimiento</CardTitle>
                <CardDescription>Evolución de Ingresos y Sesiones</CardDescription>
             </div>
             <Button variant="outline" size="sm">
                Últimos 6 meses <ChevronDown className="h-4 w-4 ml-2" />
             </Button>
          </CardHeader>
          <CardContent className="pl-2">
            <GrowthHistoryChart />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Rendimiento de Asistencia</CardTitle>
            <CardDescription>Último trimestre</CardDescription>
          </CardHeader>
          <CardContent>
            <AttendanceChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
