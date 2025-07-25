
"use client";

import { useState, useEffect, useRef } from "react";
import { collection, query, orderBy, onSnapshot, doc } from "firebase/firestore";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import type { Note, Patient } from "@/lib/types";
import { format, formatDistanceToNow, differenceInYears, addDays } from "date-fns";
import { es } from "date-fns/locale";
import type { DateRange } from "react-day-picker";


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowLeft, Edit, Download, MessageSquare, Plus, Smile, NotebookPen, FileText, BrainCircuit, Folder, CalendarDays, Tags, Search, Star, RotateCcw, PlusCircle } from "lucide-react";
import { addNote, updateNote } from "@/lib/firebase";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { Switch } from "../ui/switch";


const FilterSidebar = () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 7),
    });

    return (
        <Card className="p-4 shadow-sm flex flex-col gap-6">
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <BrainCircuit className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold">Filtrar notas</h3>
                </div>
                <Separator />
            </div>

            {/* Note Type Filter */}
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <Folder className="w-4 h-4 text-muted-foreground" />
                    <Label className="font-semibold">Tipo de nota</Label>
                </div>
                <div className="space-y-2 pl-6">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="type-audio" />
                        <Label htmlFor="type-audio" className="font-normal">Audio</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="type-transcription" />
                        <Label htmlFor="type-transcription" className="font-normal">Transcripción</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="type-manual" />
                        <Label htmlFor="type-manual" className="font-normal">Manual</Label>
                    </div>
                </div>
            </div>

            <Separator />
            
            {/* Date Range Filter */}
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-muted-foreground" />
                    <Label className="font-semibold">Rango de fechas</Label>
                </div>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className="w-full justify-start text-left font-normal"
                        >
                            <CalendarDays className="mr-2 h-4 w-4" />
                            {dateRange?.from ? (
                                dateRange.to ? (
                                    <>
                                        {format(dateRange.from, "LLL dd, y")} -{" "}
                                        {format(dateRange.to, "LLL dd, y")}
                                    </>
                                ) : (
                                    format(dateRange.from, "LLL dd, y")
                                )
                            ) : (
                                <span>Selecciona un rango</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={dateRange?.from}
                            selected={dateRange}
                            onSelect={setDateRange}
                            numberOfMonths={2}
                            locale={es}
                        />
                    </PopoverContent>
                </Popover>
            </div>

            <Separator />

            {/* Tags Filter */}
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <Tags className="w-4 h-4 text-muted-foreground" />
                    <Label className="font-semibold">Etiquetas</Label>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Ansiedad</Badge>
                    <Badge variant="secondary">Progreso</Badge>
                    <Button variant="outline" size="sm" className="h-6 px-2 text-xs"><Plus className="h-3 w-3 mr-1" />Agregar</Button>
                </div>
            </div>

             <Separator />

             {/* Keyword Filter */}
            <div className="space-y-2">
                 <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <Label className="font-semibold">Contiene palabra</Label>
                </div>
                 <div className="flex items-center space-x-2">
                    <Input placeholder="colegio..." />
                    <Button variant="outline" size="icon" className="h-9 w-9"><Search className="h-4 w-4" /></Button>
                 </div>
            </div>

            <Separator />

            {/* Show Starred */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-muted-foreground" />
                    <Label htmlFor="show-starred" className="font-semibold">Mostrar destacadas</Label>
                </div>
                 <Switch id="show-starred" />
            </div>

             <Separator />

            <Button variant="ghost">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset filtros
            </Button>
        </Card>
    );
}

export function PatientDetailPage({ patientId }: { patientId: string }) {
  const { user, db, loading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [patient, setPatient] = useState<Patient | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  useEffect(() => {
    if (!patientId || !user || !db) return;

    const patientDocRef = doc(db, `users/${user.uid}/patients`, patientId);
    const unsubscribePatient = onSnapshot(patientDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as Omit<Patient, 'id'>;
        setPatient({ id: docSnap.id, ...data });
      } else {
        toast({ variant: "destructive", title: "Paciente no encontrado" });
        setPatient(null);
      }
      setIsLoading(false);
    });

    const notesCollection = collection(db, `users/${user.uid}/patients/${patientId}/notes`);
    const q = query(notesCollection, orderBy("createdAt", "desc"));
    const unsubscribeNotes = onSnapshot(q, (noteSnapshot) => {
      const noteList = noteSnapshot.docs.map((doc) => {
         const data = doc.data();
         return {
          id: doc.id,
          ...data,
          createdAt: (data.createdAt as any).toDate(),
         } as Note;
      });
      setNotes(noteList);
    });

    return () => {
        unsubscribePatient();
        unsubscribeNotes();
    }
  }, [patientId, user, db, toast]);

  const handleOpenForm = (note: Note | null = null) => {
    setSelectedNote(note);
    setIsFormOpen(true);
  };
  
  const handleNoteSubmit = async (values: { title: string; content: string }) => {
    if (!user || !db) return;
    
    try {
        if (selectedNote) {
            await updateNote(db, user.uid, patientId, selectedNote.id, values);
            toast({ title: "Nota actualizada" });
        } else {
            const newNote: Omit<Note, 'id'> = {
                ...values,
                patientId,
                type: 'Texto',
                createdAt: new Date(),
            };
            await addNote(db, user.uid, patientId, newNote);
            toast({ title: "Nueva entrada guardada" });
        }
        setIsFormOpen(false);
        setSelectedNote(null);
    } catch (error) {
        console.error("Error saving note:", error);
        toast({ variant: "destructive", title: "Error al guardar la nota" });
    }
  };

  const getPatientAge = (dob: string | undefined) => {
    if (!dob) return '';
    return differenceInYears(new Date(), new Date(dob));
  }

  const getLastSessionDate = () => {
    if (notes.length === 0) return "No hay sesiones registradas";
    const lastNoteDate = notes[0].createdAt;
    return format(lastNoteDate, "d 'de' MMMM 'de' yyyy", { locale: es });
  }

  const getNoteIcon = (title: string) => {
    const lowerCaseTitle = title.toLowerCase();
    if (lowerCaseTitle.includes('motivo') || lowerCaseTitle.includes('consulta')) {
        return <MessageSquare className="w-6 h-6 text-purple-500" />;
    }
    if (lowerCaseTitle.includes('plan') || lowerCaseTitle.includes('seguimiento')) {
        return <NotebookPen className="w-6 h-6 text-blue-500" />;
    }
    if (lowerCaseTitle.includes('síntoma')) {
        return <Smile className="w-6 h-6 text-yellow-500" />;
    }
    return <FileText className="w-6 h-6 text-gray-500" />;
  };


  if (isLoading) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  if (!patient) {
     return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
            <p className="text-muted-foreground">Paciente no encontrado.</p>
            <Button asChild variant="outline">
                <Link href="/dashboard/patients">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver a Pacientes
                </Link>
            </Button>
        </div>
    );
  }

  return (
    <>
        <div className="flex-1 space-y-6 p-6">
            <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-4xl font-bold tracking-tight">Historial Médico</h1>
                   <p className="text-muted-foreground mt-1">
                        Revisa y gestiona todas las notas del paciente.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Exportar</Button>
                    <Button onClick={() => handleOpenForm()}>
                       <PlusCircle className="mr-2 h-4 w-4" /> Nueva entrada
                    </Button>
                </div>
            </div>

            <Card className="p-6 shadow-sm">
                <h2 className="text-3xl font-bold">{patient.name}, {getPatientAge(patient.dob)} años</h2>
                <p className="text-muted-foreground mt-1">Fecha última sesión: {getLastSessionDate()}</p>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                <aside className="md:col-span-1 flex flex-col gap-4 sticky top-20">
                   <FilterSidebar />
                </aside>

                <main className="md:col-span-3 space-y-4">
                     {notes.length > 0 ? (
                        notes.map((note) => (
                        <Card key={note.id} className="p-4 cursor-pointer hover:bg-muted/50" onClick={() => handleOpenForm(note)}>
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-4 mb-2">
                                    {getNoteIcon(note.title)}
                                    <h3 className="text-lg font-semibold">{note.title}</h3>
                                </div>
                                <span className="text-xs text-muted-foreground">{format(note.createdAt, "dd MMM yyyy", { locale: es })}</span>
                            </div>
                            <div className="pl-10">
                                <p className="text-muted-foreground bg-secondary p-3 rounded-lg inline-block">{note.content}</p>
                            </div>
                        </Card>
                        ))
                    ) : (
                        <Card className="p-6 text-center min-h-[200px] flex flex-col justify-center items-center">
                            <NotebookPen className="w-12 h-12 text-muted-foreground mb-4" />
                            <p className="text-muted-foreground font-semibold">No hay notas para este paciente.</p>
                            <p className="text-sm text-muted-foreground">Crea la primera entrada para empezar el historial.</p>
                        </Card>
                    )}
                </main>
            </div>
        </div>

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{selectedNote ? 'Editar Entrada' : 'Nueva Entrada'}</DialogTitle>
                    <DialogDescription>
                        Añade o modifica una entrada en el historial médico de {patient.name}.
                    </DialogDescription>
                </DialogHeader>
                <NoteEntryForm 
                    note={selectedNote} 
                    onSubmit={handleNoteSubmit} 
                    onCancel={() => setIsFormOpen(false)}
                />
            </DialogContent>
        </Dialog>
    </>
  );
}

// Sub-component for the form
const NoteEntryForm = ({ note, onSubmit, onCancel }: { note: Note | null, onSubmit: (values: { title: string; content: string }) => void, onCancel: () => void }) => {
    const [title, setTitle] = useState(note?.title || '');
    const [content, setContent] = useState(note?.content || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title && content) {
            onSubmit({ title, content });
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">Título</label>
                <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej: Motivo de consulta"
                />
            </div>
            <div>
                <label htmlFor="content" className="block text-sm font-medium mb-1">Contenido</label>
                <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Describe los detalles aquí..."
                    rows={5}
                />
            </div>
            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
                <Button type="submit">Guardar</Button>
            </div>
        </form>
    );
};
