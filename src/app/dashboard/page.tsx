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
import {
  Bell,
  Users,
  Calendar,
  BarChart2,
  LineChart,
  FileText,
  CreditCard,
  Settings,
  LifeBuoy,
  Home,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Dashboard Principal
        </h2>
        <div className="flex items-center space-x-4">
          <Bell className="h-6 w-6" />
          <div className="w-8 h-8 rounded-full bg-gray-300"></div>
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Resumen de la semana</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pacientes activos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Sesiones completadas (semana)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
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
          <h3 className="text-xl font-semibold mb-4">Próximas sesiones</h3>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Isabella Rossi</TableCell>
                  <TableCell>2024-07-25</TableCell>
                  <TableCell>10:00 AM</TableCell>
                  <TableCell>
                    <Badge variant="outline">Individual</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge>Confirmada</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Lucas Gómez</TableCell>
                  <TableCell>2024-07-26</TableCell>
                  <TableCell>02:00 PM</TableCell>
                  <TableCell>
                    <Badge variant="outline">Pareja</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">Pendiente</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Sofía Hernández</TableCell>
                  <TableCell>2024-07-27</TableCell>
                  <TableCell>11:00 AM</TableCell>
                  <TableCell>
                    <Badge variant="outline">Individual</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge>Confirmada</Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </div>
  );
}
