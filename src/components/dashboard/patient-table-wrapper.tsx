"use client";

import { useState, useEffect, useMemo } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
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
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { MoreHorizontal, PlusCircle, Edit, Trash2, Loader2 } from "lucide-react";
import { PatientForm } from "./patient-form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";

export function PatientTableWrapper() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      if (!user || !db) {
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
        toast({ variant: "destructive", title: "Failed to fetch patients." });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, [user, toast]);
  
  const filteredPatients = useMemo(() =>
    patients.filter((patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [patients, searchTerm]);

  const handleFormSubmit = async (data: Omit<Patient, "id">) => {
    if (!user || !db) return;
    const patientsCollection = collection(db, `users/${user.uid}/patients`);
    
    try {
      if (selectedPatient) {
        // Update
        const patientDoc = doc(db, `users/${user.uid}/patients`, selectedPatient.id);
        await updateDoc(patientDoc, data);
        setPatients(patients.map(p => p.id === selectedPatient.id ? { ...p, ...data } : p));
        toast({ title: "Patient updated successfully." });
      } else {
        // Create
        const docRef = await addDoc(patientsCollection, data);
        setPatients([...patients, { id: docRef.id, ...data }]);
        toast({ title: "Patient added successfully." });
      }
      setIsFormOpen(false);
      setSelectedPatient(null);
    } catch (error) {
      console.error("Error saving patient:", error);
      toast({ variant: "destructive", title: "Failed to save patient." });
    }
  };
  
  const handleDeletePatient = async () => {
    if (!user || !selectedPatient || !db) return;
    try {
      const patientDoc = doc(db, `users/${user.uid}/patients`, selectedPatient.id);
      await deleteDoc(patientDoc);
      setPatients(patients.filter(p => p.id !== selectedPatient.id));
      toast({ title: "Patient deleted successfully." });
      setIsDeleteConfirmOpen(false);
      setSelectedPatient(null);
    } catch (error) {
      console.error("Error deleting patient:", error);
      toast({ variant: "destructive", title: "Failed to delete patient." });
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
        <Input
          placeholder="Search patients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={openCreateForm}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Patient
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Medical History</TableHead>
              <TableHead></TableHead>
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
                  <TableCell className="font-medium">{patient.name}</TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell className="max-w-xs truncate">{patient.medicalHistory}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditForm(patient)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openDeleteConfirm(patient)} className="text-destructive focus:text-destructive">
                           <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No patients found.
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
            <DialogTitle>{selectedPatient ? 'Edit Patient' : 'Add New Patient'}</DialogTitle>
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
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the patient record for <span className="font-semibold">{selectedPatient?.name}</span>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeletePatient}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
