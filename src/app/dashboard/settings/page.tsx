import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-4">
      <DashboardHeader title="Configuración" />
      <div className="space-y-2">
        <p className="text-muted-foreground">
          Gestiona la configuración de tu cuenta y de la aplicación.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Próximamente</CardTitle>
          <CardDescription>
            Estamos trabajando en esta sección.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="flex h-48 items-center justify-center rounded-md border-2 border-dashed">
                <p className="text-muted-foreground">
                  Opciones de configuración aparecerán aquí.
                </p>
              </div>
        </CardContent>
      </Card>
    </div>
  );
}
