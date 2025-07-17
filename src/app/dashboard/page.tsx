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
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Dashboard Principal
        </h2>
        <div className="flex items-center space-x-4">
          <Bell className="h-6 w-6" />
          <div className="h-8 w-8 rounded-full bg-gray-300"></div>
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="mb-4 text-xl font-semibold">Resumen de la semana</h3>
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
          <h3 className="mb-4 text-xl font-semibold">Próximas sesiones</h3>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
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
                    <Badge className="bg-green-600/90">Confirmada</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      <Video className="mr-2 h-4 w-4" />
                      Join
                    </Button>
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
                    <Badge className="border-yellow-500/30 bg-yellow-500/20 text-yellow-400">
                      Pendiente
                    </Badge>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Sofía Hernández</TableCell>
                  <TableCell>2024-07-27</TableCell>
                  <TableCell>11:00 AM</TableCell>
                  <TableCell>
                    <Badge variant="outline">Individual</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-green-600/90">Confirmada</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      <Video className="mr-2 h-4 w-4" />
                      Join
                    </Button>
                  </TableCell>
                </TableRow>
                 <TableRow>
                  <TableCell>Carlos Ruiz</TableCell>
                  <TableCell>2024-07-28</TableCell>
                  <TableCell>09:00 AM</TableCell>
                  <TableCell>
                    <Badge variant="outline">Individual</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-green-600/90">Confirmada</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="icon" className="h-9 w-9">
                      <Video className="h-4 w-4" />
                    </Button>
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
