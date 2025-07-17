
"use client";

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import type { Patient } from "@/lib/types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  Plus,
  Search,
  Send,
  Loader2
} from "lucide-react";

const initialInvoices = [
  {
    invoiceNumber: "FACT-001",
    patientKey: 0,
    date: "2024-07-28",
    total: "$150.00",
    status: "Pagada",
  },
  {
    invoiceNumber: "FACT-002",
    patientKey: 1,
    date: "2024-07-29",
    total: "$200.00",
    status: "Pendiente",
  },
  {
    invoiceNumber: "FACT-003",
    patientKey: 2,
    date: "2024-07-20",
    total: "$100.00",
    status: "Vencida",
  },
  {
    invoiceNumber: "FACT-004",
    patientKey: 3,
    date: "2024-07-25",
    total: "$350.00",
    status: "Pagada",
  },
];


const statusStyles: { [key: string]: string } = {
  Pagada: "bg-green-500/20 text-green-400 border-green-500/30",
  Pendiente: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  Vencida: "bg-red-500/20 text-red-400 border-red-500/30",
};

const statusIcons: { [key: string]: React.ElementType } = {
  Pagada: CheckCircle2,
  Pendiente: Clock,
  Vencida: AlertTriangle,
};

export default function BillingPage() {
  const { user, db, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
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
      } catch (error) {
        console.error("Error fetching patients:", error);
        toast({ variant: "destructive", title: "Error al cargar los pacientes." });
      } finally {
        setIsLoading(false);
      }
    };
    fetchPatients();
  }, [user, db, authLoading, toast]);

  const getPatientName = (key: number) => {
    return patients[key]?.name || "Paciente no encontrado";
  }

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-end space-x-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar..." className="pl-10" />
        </div>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Registrar Gasto
        </Button>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Factura
        </Button>
      </div>

      <Tabs defaultValue="invoices">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="invoices">Facturas (Ingresos)</TabsTrigger>
          <TabsTrigger value="expenses">Gastos</TabsTrigger>
        </TabsList>
        <TabsContent value="invoices">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Factura</TableHead>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Fecha de Emisión</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
                      </TableCell>
                    </TableRow>
                  ) : initialInvoices.map((invoice) => {
                    const Icon = statusIcons[invoice.status];
                    return (
                      <TableRow key={invoice.invoiceNumber}>
                        <TableCell className="font-medium">
                          {invoice.invoiceNumber}
                        </TableCell>
                        <TableCell>{getPatientName(invoice.patientKey)}</TableCell>
                        <TableCell>{invoice.date}</TableCell>
                        <TableCell>{invoice.total}</TableCell>
                        <TableCell>
                          <Badge
                            className={`flex items-center gap-2 ${
                              statusStyles[invoice.status]
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                            <span>{invoice.status}</span>
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Download className="h-4 w-4" />
                            </Button>
                             <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="expenses">
          <Card>
            <CardContent className="flex h-48 items-center justify-center">
              <p className="text-muted-foreground">
                Próximamente: gestión de gastos.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

