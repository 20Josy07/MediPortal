
"use client";

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import type { Patient } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Folder,
  FolderPlus,
  Upload,
  Search,
  Loader2,
} from "lucide-react";

export default function DocumentsPage() {
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


  return (
    <div className="flex-1 space-y-8">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar en todos los documentos..."
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <FolderPlus className="mr-2 h-4 w-4" />
          Nueva Colección
        </Button>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Nuevo Documento
        </Button>
      </div>

      <div>
        <h3 className="mb-4 text-xl font-bold tracking-tight">Carpetas de Pacientes</h3>
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {patients.length > 0 ? patients.map((patient) => (
              <Card
                key={patient.id}
                className="group cursor-pointer transition-all hover:border-primary hover:shadow-lg"
              >
                <CardContent className="flex flex-col items-start gap-4 p-6">
                  <div
                    className="rounded-lg bg-card p-3 ring-1 ring-border group-hover:ring-primary text-primary"
                  >
                    <Folder className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{patient.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Carpeta de documentos
                    </p>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="col-span-full text-center text-muted-foreground p-8">
                No hay pacientes. Agrega un paciente para crear su carpeta de documentos.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
