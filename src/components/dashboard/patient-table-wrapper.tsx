
"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import type { Patient } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, Eye, Search, Loader2 } from "lucide-react";
import { PatientForm } from "./patient-form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";

export function PatientTableWrapper() {
  const { user, db, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      if (authLoading || !user || !db) {
        setIsLoading(false);
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
  
  const filteredPatients = useMemo(() =>
    patients.filter((patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [patients, searchTerm]);

  const handleFormSubmit = async (data: Omit<Patient, "id" | "nextSession">) => {
    if (!user || !db) {
      toast({ variant: "destructive", title: "Error de autenticación. Intenta de nuevo." });
      return;
    };
    
    const dataToSave = {
      ...data,
    };

    try {
      if (selectedPatient) {
        // Update
        const patientDoc = doc(db, `users/${user.uid}/patients`, selectedPatient.id);
        await updateDoc(patientDoc, dataToSave);
        setPatients(patients.map(p => p.id === selectedPatient.id ? { ...p, ...dataToSave } : p));
        toast({ title: "Paciente actualizado exitosamente." });
      } else {
        // Create
        const patientsCollection = collection(db, `users/${user.uid}/patients`);
        const newPatientData = { ...dataToSave, nextSession: null };
        const docRef = await addDoc(patientsCollection, newPatientData);
        setPatients([...patients, { id: docRef.id, ...newPatientData }]);
        toast({ title: "Paciente agregado exitosamente." });
      }
      setIsFormOpen(false);
      setSelectedPatient(null);
    } catch (error) {
      console.error("Error saving patient:", error);
      toast({ variant: "destructive", title: "Error al guardar el paciente." });
    }
  };
  
  const handleDeletePatient = async () => {
    if (!user || !selectedPatient || !db) return;
    try {
      const patientDoc = doc(db, `users/${user.uid}/patients`, selectedPatient.id);
      await deleteDoc(patientDoc);
      setPatients(patients.filter(p => p.id !== selectedPatient.id));
      toast({ title: "Paciente eliminado exitosamente." });
      setIsDeleteConfirmOpen(false);
      setSelectedPatient(null);
    } catch (error) {
      console.error("Error deleting patient:", error);
      toast({ variant: "destructive", title: "Error al eliminar el paciente." });
    }
  };

  const openEditForm = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsFormOpen(true);
  };
  
  const openDeleteConfirm = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsDeleteConfirmOpen(true);
  };
  
  const openCreateForm = () => {
    setSelectedPatient(null);
    setIsFormOpen(true);
  };


  return (
    <>
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar paciente por nombre"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={openCreateForm}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Agregar Paciente
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Paciente</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
                </TableCell>
              </TableRow>
            ) : filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>
                    <div className="font-medium">{patient.name}</div>
                    <div className="text-sm text-muted-foreground">{patient.email}</div>
                  </TableCell>
                  <TableCell>{patient.phone}</TableCell>
                  <TableCell>
                    <Badge variant={patient.status === 'Activo' ? 'default' : 'destructive'} className={patient.status === 'Activo' ? 'bg-green-600/90' : 'bg-red-600/90'}>
                      {patient.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                       <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                        <Link href={`/dashboard/patients/${patient.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditForm(patient)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => openDeleteConfirm(patient)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No se encontraron pacientes.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Patient Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedPatient ? 'Editar Paciente' : 'Agregar Nuevo Paciente'}</DialogTitle>
          </DialogHeader>
          <PatientForm
            patient={selectedPatient}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
       <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Estás seguro?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el registro del paciente <span className="font-semibold">{selectedPatient?.name}</span>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDeletePatient}>Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
