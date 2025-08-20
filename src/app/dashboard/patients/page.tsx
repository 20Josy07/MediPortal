
"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import type { Patient } from "@/lib/types";
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Phone,
  Mail,
  Calendar,
  FileText,
  Loader2,
  Trash2,
  Edit,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PatientForm } from "@/components/dashboard/patient-form";
import { Label } from "@/components/ui/label";

const calculateAge = (dob: string | undefined): number | null => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) return null;
    return new Date().getFullYear() - birthDate.getFullYear();
};


const PatientCard = ({ patient, onEdit, onDelete }: { patient: Patient, onEdit: (patient: Patient) => void, onDelete: (patient: Patient) => void }) => {
  const getInitials = (name: string) => {
    if (!name) return "U";
    const names = name.split(" ");
    if (names.length > 1) {
      return names[0][0] + names[names.length - 1][0];
    }
    return name.substring(0, 2);
  };

  const age = calculateAge(patient.dob);

  return (
    <div className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {getInitials(patient.name)}
            </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-foreground">{patient.name}</h3>
            <Badge variant={patient.status === "Activo" ? "default" : "secondary"} className={patient.status === 'Activo' ? 'bg-green-600/90' : ''}>
              {patient.status}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {patient.email}
            </span>
            <span className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {patient.phone}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Edad: {age ?? 'N/A'}</span>
            <span>Condición: {patient.mainDiagnosis || "No especificada"}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
         <Button asChild variant="outline" size="sm" className="gap-1 bg-transparent">
            <Link href={`/dashboard/patients/${patient.id}`}>
              <FileText className="h-3 w-3" />
              Ver Historial
            </Link>
          </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(patient)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar Paciente
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => onDelete(patient)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar Paciente
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};


export default function PatientsPage() {
    const { user, db, loading: authLoading } = useAuth();
    const { toast } = useToast();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    
    // States for the main filter controls
    const [mainStatusFilter, setMainStatusFilter] = useState("all");
    const [ageRangeFilter, setAgeRangeFilter] = useState("all");
    const [conditionFilter, setConditionFilter] = useState("");

    // Temporary states for the dropdown menu
    const [dropdownStatusFilter, setDropdownStatusFilter] = useState("all");
    const [dropdownAgeRange, setDropdownAgeRange] = useState("all");
    const [dropdownCondition, setDropdownCondition] = useState("");


    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

    useEffect(() => {
        if (authLoading || !user || !db) {
        if(!authLoading) setIsLoading(false);
        return;
        }
        
        setIsLoading(true);
        const patientsCollection = collection(db, `users/${user.uid}/patients`);
        const q = query(patientsCollection, orderBy("name"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const patientList = snapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() } as Patient)
            );
            setPatients(patientList);
            setIsLoading(false);
        }, (error) => {
        console.error("Error fetching patients:", error);
        toast({ variant: "destructive", title: "Error al cargar los pacientes." });
        setIsLoading(false);
        });

        return () => unsubscribe();
    }, [user, db, authLoading, toast]);
    
    const applyFilters = () => {
        setMainStatusFilter(dropdownStatusFilter);
        setAgeRangeFilter(dropdownAgeRange);
        setConditionFilter(dropdownCondition);
    };

    const filteredPatients = useMemo(() => {
        return patients.filter((patient) => {
            // Main search term
            const matchesSearch = searchTerm === "" || 
                                patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                patient.email.toLowerCase().includes(searchTerm.toLowerCase());

            // Dropdown: Status filter
            const matchesStatus = mainStatusFilter === 'all' || patient.status === mainStatusFilter;

            // Dropdown: Age range filter
            const age = calculateAge(patient.dob);
            const matchesAge = ageRangeFilter === 'all' || (age !== null && (
                (ageRangeFilter === '0-12' && age <= 12) ||
                (ageRangeFilter === '13-17' && age >= 13 && age <= 17) ||
                (ageRangeFilter === '18-59' && age >= 18 && age <= 59) ||
                (ageRangeFilter === '60+' && age >= 60)
            ));
            
            // Dropdown: Condition filter
            const matchesCondition = conditionFilter === "" || (patient.mainDiagnosis && patient.mainDiagnosis.toLowerCase().includes(conditionFilter.toLowerCase()));

            return matchesSearch && matchesStatus && matchesAge && matchesCondition;
        });
    }, [patients, searchTerm, mainStatusFilter, ageRangeFilter, conditionFilter]);

    const stats = useMemo(() => ({
        total: patients.length,
        active: patients.filter(p => p.status === 'Activo').length,
        inactive: patients.filter(p => p.status === 'Inactivo').length,
        newThisMonth: patients.filter(p => p.createdAt && new Date(p.createdAt.toDate()).getMonth() === new Date().getMonth()).length,
    }), [patients]);

    const handleFormSubmit = async (data: Omit<Patient, "id" | "nextSession" | "createdAt" | "dob"> & { dob?: string }) => {
        if (!user || !db) {
            toast({ variant: "destructive", title: "Error de autenticación. Intenta de nuevo." });
            return;
        };
        
        setIsSubmitting(true);
        const dataToSave: any = { ...data };
        if (data.dob) {
            dataToSave.dob = data.dob;
        }

        try {
        if (selectedPatient) {
            const patientDoc = doc(db, `users/${user.uid}/patients`, selectedPatient.id);
            await updateDoc(patientDoc, dataToSave);
            toast({ title: "Paciente actualizado exitosamente." });
        } else {
            const patientsCollection = collection(db, `users/${user.uid}/patients`);
            const newPatientData = { 
            ...dataToSave,
            nextSession: null,
            createdAt: serverTimestamp(),
            };
            await addDoc(patientsCollection, newPatientData);
            toast({ title: "Paciente agregado exitosamente." });
        }
        setIsFormOpen(false);
        setSelectedPatient(null);
        } catch (error) {
        console.error("Error saving patient:", error);
        toast({ variant: "destructive", title: "Error al guardar el paciente." });
        } finally {
        setIsSubmitting(false);
        }
    };
  
    const handleDeletePatient = async () => {
        if (!user || !selectedPatient || !db) return;
        try {
        const patientDoc = doc(db, `users/${user.uid}/patients`, selectedPatient.id);
        await deleteDoc(patientDoc);
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
            <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Gestión de Pacientes</h1>
                        <p className="text-muted-foreground">Administre los registros e información de sus pacientes.</p>
                    </div>
                    <Button onClick={openCreateForm} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Agregar Nuevo Paciente
                    </Button>
                </div>

                <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardContent className="p-4">
                        <div className="text-2xl font-bold text-primary">{stats.total}</div>
                        <p className="text-sm text-muted-foreground">Total de Pacientes</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                        <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                        <p className="text-sm text-muted-foreground">Pacientes Activos</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                        <div className="text-2xl font-bold text-muted-foreground">{stats.inactive}</div>
                        <p className="text-sm text-muted-foreground">Pacientes Inactivos</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                        <div className="text-2xl font-bold text-primary">{stats.newThisMonth}</div>
                        <p className="text-sm text-muted-foreground">Nuevos Este Mes</p>
                        </CardContent>
                    </Card>
                </div>
                
                 <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex-1">
                                <CardTitle>Registros de Pacientes</CardTitle>
                                <CardDescription>Lista completa de todos los pacientes.</CardDescription>
                            </div>
                            <div className="flex flex-1 items-center gap-4 max-w-lg">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input 
                                        placeholder="Buscar por nombre, email..." 
                                        className="pl-10"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                     />
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                                            <Filter className="h-4 w-4" />
                                            Filtros
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-64 p-4 space-y-4">
                                         <div>
                                            <Label className="font-semibold text-sm">Estado</Label>
                                            <Select value={dropdownStatusFilter} onValueChange={setDropdownStatusFilter}>
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Seleccionar estado" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">Todos</SelectItem>
                                                    <SelectItem value="Activo">Activo</SelectItem>
                                                    <SelectItem value="Inactivo">Inactivo</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                         <div>
                                            <Label className="font-semibold text-sm">Rango de Edad</Label>
                                            <Select value={dropdownAgeRange} onValueChange={setDropdownAgeRange}>
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Seleccionar rango" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">Todos</SelectItem>
                                                    <SelectItem value="0-12">Niños (0-12)</SelectItem>
                                                    <SelectItem value="13-17">Adolescentes (13-17)</SelectItem>
                                                    <SelectItem value="18-59">Adultos (18-59)</SelectItem>
                                                    <SelectItem value="60+">Adultos Mayores (60+)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label className="font-semibold text-sm">Condición</Label>
                                            <Input 
                                                placeholder="Ej: Ansiedad..." 
                                                className="mt-1" 
                                                value={dropdownCondition} 
                                                onChange={(e) => setDropdownCondition(e.target.value)}
                                            />
                                        </div>
                                        <DropdownMenuSeparator />
                                        <div className="flex justify-end gap-2">
                                            <DropdownMenuItem asChild>
                                              <Button type="button" variant="ghost" size="sm">Cancelar</Button>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Button type="button" size="sm" onClick={applyFilters}>Aplicar</Button>
                                            </DropdownMenuItem>
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-48">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : filteredPatients.length > 0 ? (
                            filteredPatients.map((patient) => (
                                <PatientCard key={patient.id} patient={patient} onEdit={openEditForm} onDelete={openDeleteConfirm} />
                            ))
                        ) : (
                            <div className="text-center py-10 text-muted-foreground">
                                No se encontraron pacientes.
                            </div>
                        )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent>
                <DialogHeader>
                    <DialogTitle>{selectedPatient ? 'Editar Paciente' : 'Agregar Nuevo Paciente'}</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[80vh] pr-6">
                    <PatientForm
                    patient={selectedPatient}
                    onSubmit={handleFormSubmit}
                    onCancel={() => setIsFormOpen(false)}
                    isSubmitting={isSubmitting}
                    />
                </ScrollArea>
                </DialogContent>
            </Dialog>
            
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
