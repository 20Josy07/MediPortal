import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ArrowUp, Mic, FileText, Eye } from "lucide-react";
import { MostFrequentTopicsChart } from "@/components/dashboard/analysis/most-frequent-topics-chart";
import { EmotionalTrendsChart } from "@/components/dashboard/analysis/emotional-trends-chart";

export default function AnalysisPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Análisis de la Práctica (IA)
        </h2>
        <p className="text-muted-foreground">
          Insights agregados de todos los pacientes para una visión global.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Main Column */}
        <div className="col-span-1 space-y-6 lg:col-span-2">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Análisis de Conversaciones</CardTitle>
                <CardDescription>
                  Descubre patrones en la comunicación verbal y alertas
                  críticas.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-6 w-6 text-destructive" />
                    <h3 className="text-lg font-semibold text-destructive">
                      Patrones de Abuso Emocional
                    </h3>
                  </div>
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p className="text-5xl font-bold">3</p>
                      <p className="text-sm text-muted-foreground">
                        Detecciones en último mes
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1 text-sm font-medium text-green-500">
                        <ArrowUp className="h-4 w-4" />
                        <span>+1 vs mes anterior</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Detecciones de IA, para apoyo clínico.
                      </p>
                    </div>
                  </div>
                  <Button variant="destructive" className="mt-6 w-full">
                    Explorar Detecciones
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Análisis de Notas y Documentos</CardTitle>
                <CardDescription>
                  Identifica patrones cognitivos y conductuales.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Card>
                  <CardHeader>
                    <CardTitle>Tópicos más Frecuentes</CardTitle>
                    <CardDescription>Último trimestre</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MostFrequentTopicsChart />
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Tendencias Emocionales Agregadas</CardTitle>
              <CardDescription>Últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <EmotionalTrendsChart />
            </CardContent>
          </Card>
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Tendencias de Indicadores Clínicos</CardTitle>
              <CardDescription>Próximamente...</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-48 items-center justify-center rounded-md border-2 border-dashed">
                <p className="text-muted-foreground">
                  Gráfico de indicadores clínicos
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Column */}
        <div className="col-span-1 space-y-6 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente de Análisis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4 rounded-lg bg-card p-4">
                <Mic className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">Isabella Rossi</p>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    2024-07-28 - 60 min
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="secondary">Alta Ansiedad</Badge>
                    <Badge variant="secondary">Conflictos Familiares</Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-lg bg-card p-4">
                <Mic className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">Juan Pérez</p>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    2024-07-27 - 45 min
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="secondary">Detección de Resistencia</Badge>
                    <Badge variant="secondary">Estrés Laboral</Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-lg bg-card p-4">
                <Mic className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">Sofía Hernández</p>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    2024-07-26 - 60 min
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="secondary">Burnout</Badge>
                    <Badge variant="secondary">Lenguaje Depresivo</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Documentos Clínicos Procesados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4 rounded-lg bg-card p-4">
                <FileText className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">Carlos Ruiz</p>
                     <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Diario del Paciente - 2024-07-29
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="secondary">Pensamientos Catastróficos</Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-lg bg-card p-4">
                <FileText className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">Isabella Rossi</p>
                     <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Informe de Evaluación - 2024-07-25
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="secondary">Mejora en Coping</Badge>
                  </div>
                </div>
              </div>
               <div className="flex items-start gap-4 rounded-lg bg-card p-4">
                <FileText className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">Lucas Gómez</p>
                     <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Nota de Sesión - 2024-07-22
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="secondary">Conflicto de Pareja</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
