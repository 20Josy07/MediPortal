
"use client";

import { useState, useEffect, useMemo } from "react";
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import type { Note, Patient } from "@/lib/types";
import { format, formatDistanceToNow, differenceInYears, addDays, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { es } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import jsPDF from "jspdf";
import { generateProgressReport, type GenerateProgressReportOutput } from "@/ai/flows/generate-progress-report-flow";
import { summarizeSingleNote } from "@/ai/flows/summarize-single-note-flow";


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowLeft, Download, MessageSquare, Plus, NotebookPen, FileText, BrainCircuit, Folder, CalendarDays, Tags, Search, Star, RotateCcw, PlusCircle, Filter, MapPin, Edit, Save, FileDown, ChevronLeft, Calendar as CalendarIcon, FileClock, BarChartHorizontal, ChevronDown } from "lucide-react";
import { addNote, updateNote as updateNoteInDb } from "@/lib/firebase";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { Switch } from "../ui/switch";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";


const noteTypes = [
    { id: 'Voz', label: 'Voz' },
    { id: 'Texto', label: 'Texto' },
];

const FilterSidebar = ({ onFilter, onReset }: { onFilter: (filters: any) => void, onReset: () => void }) => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());
    const [keyword, setKeyword] = useState("");
    const [showStarred, setShowStarred] = useState(false);

    const handleTypeChange = (typeId: string, checked: boolean) => {
        const newSelectedTypes = new Set(selectedTypes);
        if (checked) {
            newSelectedTypes.add(typeId);
        } else {
            newSelectedTypes.delete(typeId);
        }
        setSelectedTypes(newSelectedTypes);
    };

    const handleApplyFilters = () => {
        onFilter({
            dateRange,
            types: Array.from(selectedTypes),
            keyword: keyword.trim().toLowerCase(),
            showStarred,
        });
    };

    const handleReset = () => {
        setDateRange(undefined);
        setSelectedTypes(new Set());
        setKeyword("");
        setShowStarred(false);
        onReset();
    }


    return (
        <Card className="p-4 shadow-sm flex flex-col gap-6">
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <BrainCircuit className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold">Filtrar notas</h3>
                </div>
                <Separator />
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <Folder className="w-4 h-4 text-muted-foreground" />
                    <Label className="font-semibold">Tipo de nota</Label>
                </div>
                <div className="space-y-2 pl-6">
                    {noteTypes.map(type => (
                        <div key={type.id} className="flex items-center space-x-2">
                            <Checkbox 
                                id={`type-${type.id}`} 
                                checked={selectedTypes.has(type.id)}
                                onCheckedChange={(checked) => handleTypeChange(type.id, !!checked)}
                            />
                            <Label htmlFor={`type-${type.id}`} className="font-normal">{type.label}</Label>
                        </div>
                    ))}
                </div>
            </div>

            <Separator />
            
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-muted-foreground" />
                    <Label className="font-semibold">Rango de fechas</Label>
                </div>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn("w-full justify-start text-left font-normal", !dateRange && "text-muted-foreground")}
                        >
                            <CalendarDays className="mr-2 h-4 w-4" />
                            {dateRange?.from ? (
                                dateRange.to ? (
                                    <>
                                        {format(dateRange.from, "dd LLL, y", { locale: es })} -{" "}
                                        {format(dateRange.to, "dd LLL, y", { locale: es })}
                                    </>
                                ) : (
                                    format(dateRange.from, "dd LLL, y", { locale: es })
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

            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <Tags className="w-4 h-4 text-muted-foreground" />
                    <Label className="font-semibold">Etiquetas</Label>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Ansiedad</Badge>
                    <Badge variant="secondary">Progreso</Badge>
                    <Button variant="outline" size="sm" className="h-6 px-2 text-xs" disabled><Plus className="h-3 w-3 mr-1" />Agregar</Button>
                </div>
            </div>

             <Separator />

            <div className="space-y-2">
                 <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <Label htmlFor="keyword-search" className="font-semibold">Contiene palabra</Label>
                </div>
                 <div className="flex items-center space-x-2">
                    <Input 
                        id="keyword-search"
                        placeholder="colegio..." 
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                 </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-muted-foreground" />
                    <Label htmlFor="show-starred" className="font-semibold">Mostrar destacadas</Label>
                </div>
                 <Switch id="show-starred" disabled />
            </div>

             <Separator />
            
             <Button onClick={handleApplyFilters} className="bg-green-600 hover:bg-green-700">
                <Filter className="w-4 h-4 mr-2" />
                Filtrar
            </Button>
            
            <Button variant="ghost" onClick={handleReset}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset filtros
            </Button>
        </Card>
    );
}

const NoteCard = ({ note, onOpenForm }: { note: Note, onOpenForm: (note: Note) => void }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [summary, setSummary] = useState<string | null>(null);
    const [isSummarizing, setIsSummarizing] = useState(false);

    const wordCount = useMemo(() => note.content.split(/\s+/).length, [note.content]);
    const needsSummary = wordCount > 300;

    useEffect(() => {
        const generateSummary = async () => {
            if (needsSummary && !summary && !isSummarizing) {
                setIsSummarizing(true);
                try {
                    const result = await summarizeSingleNote({ noteContent: note.content });
                    setSummary(result.summary);
                } catch (error) {
                    console.error("Error summarizing note:", error);
                    setSummary("No se pudo generar el resumen.");
                } finally {
                    setIsSummarizing(false);
                }
            }
        };
        generateSummary();
    }, [needsSummary, note.content, summary, isSummarizing]);

    const getNoteIcon = (type: Note['type']) => {
        switch (type) {
            case 'Voz':
                return <MessageSquare className="w-6 h-6 text-purple-500" />;
            case 'Texto':
                return <NotebookPen className="w-6 h-6 text-blue-500" />;
            default:
                return <FileText className="w-6 h-6 text-gray-500" />;
        }
    };

    const displayContent = isExpanded ? note.content : (needsSummary ? summary : note.content);

    return (
        <Card className="p-4 cursor-pointer hover:bg-muted/50" onClick={() => onOpenForm(note)}>
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-4 mb-2">
                    {getNoteIcon(note.type)}
                    <h3 className="text-lg font-semibold">{note.title}</h3>
                </div>
                <span className="text-xs text-muted-foreground">{format(note.createdAt, "dd MMM yyyy", { locale: es })}</span>
            </div>
            <div className="pl-10">
                {isSummarizing ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Resumiendo nota...</span>
                    </div>
                ) : (
                    <p className="text-muted-foreground bg-secondary p-3 rounded-lg block w-full break-words">
                        {displayContent}
                    </p>
                )}
                {needsSummary && !isSummarizing && (
                    <Button variant="link" size="sm" className="p-0 h-auto mt-2" onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}>
                        {isExpanded ? "Ver menos" : "Ver más"}
                        <ChevronDown className={cn("h-4 w-4 ml-1 transition-transform", isExpanded && "rotate-180")} />
                    </Button>
                )}
            </div>
        </Card>
    );
};


export function PatientDetailPage({ patientId }: { patientId: string }) {
  const { user, db, userProfile, loading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [patient, setPatient] = useState<Patient | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const [isEditingPatientDetails, setIsEditingPatientDetails] = useState(false);
  const [editablePatient, setEditablePatient] = useState<Partial<Patient>>({});
  
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<GenerateProgressReportOutput | null>(null);


  useEffect(() => {
    if (!patientId || !user || !db) return;

    const patientDocRef = doc(db, `users/${user.uid}/patients`, patientId);
    const unsubscribePatient = onSnapshot(patientDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as Omit<Patient, 'id'>;
        const patientData = { id: docSnap.id, ...data, createdAt: data.createdAt ? (data.createdAt as any).toDate() : undefined };
        setPatient(patientData);
        setEditablePatient(patientData);
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
      setFilteredNotes(noteList);
    });

    return () => {
        unsubscribePatient();
        unsubscribeNotes();
    }
  }, [patientId, user, db, toast]);
  
  const handleFilter = (filters: { dateRange?: DateRange, types: string[], keyword: string, showStarred: boolean }) => {
    let tempNotes = [...notes];

    if (filters.types.length > 0) {
        tempNotes = tempNotes.filter(note => filters.types.includes(note.type));
    }
    
    if (filters.dateRange?.from) {
        const interval = {
            start: startOfDay(filters.dateRange.from),
            end: filters.dateRange.to ? endOfDay(filters.dateRange.to) : endOfDay(filters.dateRange.from)
        };
        tempNotes = tempNotes.filter(note => isWithinInterval(note.createdAt, interval));
    }

    if (filters.keyword) {
        tempNotes = tempNotes.filter(note => 
            note.title.toLowerCase().includes(filters.keyword) || 
            (note.content && note.content.toLowerCase().includes(filters.keyword))
        );
    }
    
    setFilteredNotes(tempNotes);
    toast({ title: `Se encontraron ${tempNotes.length} notas.` });
  };
  
  const handleResetFilters = () => {
    setFilteredNotes(notes);
  }

  const handleOpenForm = (note: Note | null = null) => {
    setSelectedNote(note);
    setIsFormOpen(true);
  };
  
  const handleNoteSubmit = async (values: { title: string; content: string }) => {
    if (!user || !db) return;
    
    try {
        if (selectedNote) {
            await updateNoteInDb(db, user.uid, patientId, selectedNote.id, values);
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

  const handlePatientDetailChange = (field: keyof Patient, value: string) => {
    setEditablePatient(prev => ({...prev, [field]: value}));
  };
  
  const handleSavePatientDetails = async () => {
    if (!user || !db || !patient) return;
    const patientDocRef = doc(db, `users/${user.uid}/patients`, patient.id);
    try {
        await updateDoc(patientDocRef, editablePatient);
        toast({title: "Datos del paciente actualizados."});
        setIsEditingPatientDetails(false);
    } catch (error) {
        console.error("Error updating patient details:", error);
        toast({variant: "destructive", title: "Error al guardar los cambios."})
    }
  };

  const getPatientAge = (dob: string | undefined): string => {
    if (!dob || isNaN(Date.parse(dob))) return '';
    const age = differenceInYears(new Date(), new Date(dob));
    return `, ${age} años`;
  }

  const getLastSessionDate = () => {
    if (notes.length === 0) return "No hay sesiones registradas";
    const lastNoteDate = notes[0].createdAt;
    return format(lastNoteDate, "d 'de' MMMM 'de' yyyy", { locale: es });
  }

  const handleGenerateReport = async () => {
    if (!patient || notes.length === 0) {
        toast({ variant: "destructive", title: "No hay suficientes datos", description: "Se necesitan notas para generar un informe." });
        return;
    }
    setIsGeneratingReport(true);
    setIsReportModalOpen(true);
    setGeneratedReport(null);
    try {
        const notesContent = notes.map(n => `[${format(n.createdAt, 'PPp', {locale: es})}] ${n.title}:\n${n.content}`).join('\n\n---\n\n');
        const result = await generateProgressReport({
            patientName: patient.name,
            notesContent: notesContent,
            initialObjective: patient.currentObjective || 'No especificado',
        });
        setGeneratedReport(result);
    } catch (error) {
        console.error("Error generating report:", error);
        toast({ variant: "destructive", title: "Error al generar el informe." });
        setIsReportModalOpen(false);
    } finally {
        setIsGeneratingReport(false);
    }
  };
  
  const handleReportChange = (field: keyof GenerateProgressReportOutput, value: string) => {
    if (generatedReport) {
      setGeneratedReport({
        ...generatedReport,
        [field]: value,
      });
    }
  };

  const getBase64FromUrl = async (url: string): Promise<string> => {
    const data = await fetch(url);
    const blob = await data.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result;
        resolve(base64data as string);
      };
    });
  };

  const handleDownloadReport = async () => {
    if (!patient || !generatedReport) return;
    
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 15;
    let yPos = 0;
    
    // Header
    const headerFooterColor = '#141f16';
    doc.setFillColor(headerFooterColor);
    doc.rect(0, 0, pageWidth, 20, 'F');
    try {
        const logoUrl = 'https://i.postimg.cc/BbB1NZZF/replicate-prediction-h8nxevgngdrge0cr5vb92hqb80.png';
        const logoBase64 = await getBase64FromUrl(logoUrl);
        doc.addImage(logoBase64, 'PNG', margin, 4, 12, 12);
    } catch (error) {
        console.error("Error loading logo for PDF:", error);
    }
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('Informe de Progreso Terapéutico', margin + 15, 12);

    // Footer
    doc.setFillColor(headerFooterColor);
    doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text(`© ${new Date().getFullYear()} Zenda. Todos los derechos reservados.`, margin, pageHeight - 6);
    
    // Title and patient info
    yPos = 35;
    doc.setTextColor(0,0,0);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(patient.name, margin, yPos);
    yPos += 10;
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    const psychologistName = userProfile?.fullName || user?.displayName || 'N/A';
    doc.text(`Psicólogo/a: ${psychologistName}`, margin, yPos);
    yPos += 5;
    doc.text(`Fecha del informe: ${format(new Date(), "PPP", { locale: es })}`, margin, yPos);
    yPos += 5;
    
    doc.setLineWidth(0.2);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;
    
    // Report Content
    const addSection = (title: string, content?: string) => {
        if (!content) return;
        
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(title, margin, yPos);
        yPos += 7;
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        const splitContent = doc.splitTextToSize(content, pageWidth - margin * 2);
        const contentHeight = doc.getTextDimensions(splitContent).h;

        if (yPos + contentHeight > pageHeight - 25) {
            doc.addPage();
            yPos = 20;
        }

        doc.text(splitContent, margin, yPos);
        yPos += contentHeight + 10;
    };
    
    addSection("Objetivo Inicial", patient.currentObjective);
    addSection("Resumen de Evolución", generatedReport.summary);
    addSection("Logros Alcanzados", generatedReport.achievements);
    addSection("Cambios Detectados", generatedReport.detectedChanges);
    if(generatedReport.keyPhrases) {
        addSection("Frases Clave", generatedReport.keyPhrases);
    }

    doc.save(`Informe_Progreso_${patient.name.replace(/\s/g, '_')}.pdf`);
  };

  const handleDownloadCurrentNote = () => {
    if (!selectedNote || !patient) {
      toast({variant: "destructive", title: "Ninguna nota seleccionada"});
      return;
    }
    const doc = new jsPDF();
    doc.text(`Nota para ${patient.name}`, 10, 10);
    doc.text(`Fecha: ${format(selectedNote.createdAt, "PPP", {locale: es})}`, 10, 20);
    doc.text(selectedNote.title, 10, 30);
    doc.text(selectedNote.content, 10, 40);
    doc.save(`${selectedNote.title.replace(/\s/g, '_')}.pdf`);
  }


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

  const ageText = getPatientAge(patient.dob);
  const lastSession = getLastSessionDate();

  return (
    <>
        <div className="flex-1 space-y-6 p-6 h-full flex flex-col">
            <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-4xl font-bold tracking-tight">Historial Médico</h1>
                   <p className="text-muted-foreground mt-1">
                        Revisa y gestiona todas las notas del paciente.
                    </p>
                </div>
                <div className="flex gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline"><FileDown className="mr-2 h-4 w-4" /> Exportar</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={handleDownloadCurrentNote} disabled={!selectedNote}>
                          Descargar Nota Actual (PDF)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleGenerateReport}>
                          Generar Informe de Progreso
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button onClick={() => handleOpenForm()}>
                       <PlusCircle className="mr-2 h-4 w-4" /> Nueva entrada
                    </Button>
                </div>
            </div>

            <Card className="p-6 shadow-sm">
                <div className="flex justify-between items-start">
                    <h2 className="text-3xl font-bold mb-4">{patient.name}{ageText}</h2>
                    {!isEditingPatientDetails ? (
                        <Button variant="ghost" size="icon" onClick={() => setIsEditingPatientDetails(true)}>
                            <Edit className="w-5 h-5" />
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => { setIsEditingPatientDetails(false); setEditablePatient(patient); }}>Cancelar</Button>
                            <Button onClick={handleSavePatientDetails}><Save className="mr-2 h-4 w-4" /> Guardar</Button>
                        </div>
                    )}
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 text-sm">
                    {isEditingPatientDetails ? (
                        <>
                           <div className="space-y-1">
                                <Label className="font-semibold text-muted-foreground">Edad</Label>
                                <Input value={ageText.replace(', ', '')} disabled />
                           </div>
                           <div className="space-y-1">
                                <Label className="font-semibold text-muted-foreground">Tipo de consulta</Label>
                                <Input value={editablePatient.consultationType || ""} onChange={(e) => handlePatientDetailChange('consultationType', e.target.value)} />
                           </div>
                           <div className="space-y-1">
                                <Label className="font-semibold text-muted-foreground">Diagnóstico principal</Label>
                                <Input value={editablePatient.mainDiagnosis || ""} onChange={(e) => handlePatientDetailChange('mainDiagnosis', e.target.value)} />
                           </div>
                           <div className="space-y-1">
                                <Label className="font-semibold text-muted-foreground">Objetivo actual</Label>
                                <Input value={editablePatient.currentObjective || ""} onChange={(e) => handlePatientDetailChange('currentObjective', e.target.value)} />
                           </div>
                           <div className="space-y-1">
                                <Label className="font-semibold text-muted-foreground">Frecuencia</Label>
                                <Input value={editablePatient.frequency || ""} onChange={(e) => handlePatientDetailChange('frequency', e.target.value)} />
                           </div>
                           <div className="space-y-1">
                                <Label className="font-semibold text-muted-foreground">Última sesión</Label>
                                <Input value={lastSession} disabled />
                           </div>
                           <div className="md:col-span-2 lg:col-span-3">
                                <Label className="font-semibold text-muted-foreground">Contexto</Label>
                                <Textarea value={editablePatient.context || ""} onChange={(e) => handlePatientDetailChange('context', e.target.value)} />
                           </div>
                        </>
                    ) : (
                        <>
                           <div>
                               <span className="font-semibold text-muted-foreground">Edad: </span>
                               <span className="text-foreground">{ageText.replace(', ', '') || 'N/A'}</span>
                           </div>
                           <div>
                               <span className="font-semibold text-muted-foreground">Tipo de consulta: </span>
                               <span className="text-foreground">{patient.consultationType || "No especificado"}</span>
                           </div>
                           <div>
                               <span className="font-semibold text-muted-foreground">Diagnóstico principal: </span>
                               <span className="text-foreground">{patient.mainDiagnosis || "No especificado"}</span>
                           </div>
                           <div>
                               <span className="font-semibold text-muted-foreground">Objetivo actual: </span>
                               <span className="text-foreground">{patient.currentObjective || "No especificado"}</span>
                           </div>
                           <div>
                               <span className="font-semibold text-muted-foreground">Frecuencia: </span>
                               <span className="text-foreground">{patient.frequency || "No especificada"}</span>
                           </div>
                            <div>
                                <span className="font-semibold text-muted-foreground">Última sesión: </span>
                                <span className="text-foreground">{lastSession}</span>
                           </div>
                           <div className="md:col-span-2 lg:col-span-3">
                               <span className="font-semibold text-muted-foreground">Contexto: </span>
                               <span className="text-foreground">{patient.context || "No especificado"}</span>
                           </div>
                        </>
                    )}
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start flex-grow min-h-0">
                <aside className="md:col-span-1 h-full">
                    <ScrollArea className="h-full pr-4">
                        <FilterSidebar onFilter={handleFilter} onReset={handleResetFilters} />
                    </ScrollArea>
                </aside>

                <main className="md:col-span-3 h-full">
                     <ScrollArea className="h-full pr-4">
                        <div className="space-y-4">
                        {filteredNotes.length > 0 ? (
                            filteredNotes.map((note) => (
                                <NoteCard key={note.id} note={note} onOpenForm={handleOpenForm} />
                            ))
                        ) : (
                            <Card className="p-6 text-center min-h-[200px] flex flex-col justify-center items-center">
                                <NotebookPen className="w-12 h-12 text-muted-foreground mb-4" />
                                <p className="text-muted-foreground font-semibold">No se encontraron notas.</p>
                                <p className="text-sm text-muted-foreground">Ajusta los filtros o crea una nueva entrada.</p>
                            </Card>
                        )}
                        </div>
                     </ScrollArea>
                </main>
            </div>
        </div>

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent className="sm:max-w-[480px]">
                <NoteEntryForm 
                    note={selectedNote} 
                    onSubmit={handleNoteSubmit} 
                    onCancel={() => setIsFormOpen(false)}
                    patientName={patient.name}
                />
            </DialogContent>
        </Dialog>
        
        <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Informe de Progreso Terapéutico</DialogTitle>
                    <DialogDescription>
                        Informe generado por IA para {patient?.name}. Puedes editar el contenido antes de exportar.
                    </DialogDescription>
                </DialogHeader>
                {isGeneratingReport ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="ml-4 text-muted-foreground">Generando informe...</p>
                    </div>
                ) : generatedReport ? (
                    <ScrollArea className="max-h-[60vh] pr-4">
                        <div className="space-y-4">
                            <div>
                                <Label className="font-semibold">Resumen de Evolución</Label>
                                <Textarea value={generatedReport.summary} onChange={e => handleReportChange('summary', e.target.value)} rows={4} className="mt-1"/>
                            </div>
                            <div>
                                <Label className="font-semibold">Logros Alcanzados</Label>
                                <Textarea value={generatedReport.achievements} onChange={e => handleReportChange('achievements', e.target.value)} rows={4} className="mt-1"/>
                            </div>
                            <div>
                                <Label className="font-semibold">Cambios Detectados</Label>
                                <Textarea value={generatedReport.detectedChanges} onChange={e => handleReportChange('detectedChanges', e.target.value)} rows={4} className="mt-1"/>
                            </div>
                            <div>
                                <Label className="font-semibold">Frases Clave (Opcional)</Label>
                                <Textarea value={generatedReport.keyPhrases || ""} onChange={e => handleReportChange('keyPhrases', e.target.value)} rows={3} className="mt-1"/>
                            </div>
                        </div>
                    </ScrollArea>
                ) : (
                     <div className="flex items-center justify-center h-64">
                        <p className="text-muted-foreground">No se pudo generar el informe.</p>
                    </div>
                )}
                 <DialogFooter>
                    <Button variant="outline" onClick={() => setIsReportModalOpen(false)}>Cancelar</Button>
                    <Button onClick={handleDownloadReport} disabled={!generatedReport}>
                        <Download className="mr-2 h-4 w-4" />
                        Descargar PDF
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>
  );
}

type NoteType = 'session' | 'follow-up' | 'summary';

const NoteEntryForm = ({ 
    note, 
    onSubmit, 
    onCancel,
    patientName
}: { 
    note: Note | null, 
    onSubmit: (values: { title: string; content: string }) => void, 
    onCancel: () => void,
    patientName: string
}) => {
    const [noteType, setNoteType] = useState<NoteType | null>(null);

    // Session Note State
    const [sessionDate, setSessionDate] = useState<Date | undefined>(new Date());
    const [sessionTopic, setSessionTopic] = useState('');
    const [sessionObservations, setSessionObservations] = useState('');
    const [sessionInterventions, setSessionInterventions] = useState('');
    const [sessionNextSteps, setSessionNextSteps] = useState('');

    // Follow-up Note State
    const [followUpTask, setFollowUpTask] = useState('');
    const [followUpDate, setFollowUpDate] = useState<Date | undefined>(new Date());
    const [followUpProgress, setFollowUpProgress] = useState('');
    const [followUpRecommendations, setFollowUpRecommendations] = useState('');
    
    // Summary Note State
    const [summaryDateRange, setSummaryDateRange] = useState<DateRange | undefined>();
    const [summaryObjectives, setSummaryObjectives] = useState('');
    const [summaryChanges, setSummaryChanges] = useState('');
    const [summaryPatientComments, setSummaryPatientComments] = useState('');
    const [summaryEvaluation, setSummaryEvaluation] = useState('');

    useEffect(() => {
        // If editing an existing note, we can try to parse it, but for now, we'll just show a simple form
        if (note) {
            setNoteType('session'); // default to session for existing simple notes
            setSessionTopic(note.title);
            setSessionObservations(note.content);
        }
    }, [note]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let title = '';
        let content = '';

        if (noteType === 'session') {
            title = sessionTopic || `Nota de sesión - ${format(sessionDate || new Date(), "PPP", { locale: es })}`;
            content = `Fecha: ${format(sessionDate || new Date(), "PPP", { locale: es })}\nTema Central: ${sessionTopic}\n\nObservaciones del Paciente:\n${sessionObservations}\n\nIntervenciones Realizadas:\n${sessionInterventions}\n\nConclusiones o Próximos Pasos:\n${sessionNextSteps}`;
        } else if (noteType === 'follow-up') {
            title = followUpTask || `Seguimiento - ${format(followUpDate || new Date(), "PPP", { locale: es })}`;
            content = `Tarea Asignada: ${followUpTask}\nFecha Asignada: ${format(followUpDate || new Date(), "PPP", { locale: es })}\n\nProgreso Observado:\n${followUpProgress}\n\nRecomendaciones:\n${followUpRecommendations}`;
        } else if (noteType === 'summary') {
            const from = summaryDateRange?.from ? format(summaryDateRange.from, "PPP", { locale: es }) : 'N/A';
            const to = summaryDateRange?.to ? format(summaryDateRange.to, "PPP", { locale: es }) : 'N/A';
            title = `Resumen de evolución (${from} - ${to})`;
            content = `Rango de Fechas: ${from} al ${to}\nObjetivos Trabajados: ${summaryObjectives}\n\nCambios Observados:\n${summaryChanges}\n\nComentarios del Paciente:\n${summaryPatientComments}\n\nEvaluación del Proceso:\n${summaryEvaluation}`;
        }

        if (title && content) {
            onSubmit({ title, content });
        }
    };

    if (!noteType) {
        return (
            <>
                <DialogHeader>
                    <DialogTitle>Elige un tipo de entrada</DialogTitle>
                    <DialogDescription>
                        Selecciona la plantilla que mejor se adapte a tu registro para {patientName}.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Button variant="outline" className="justify-start h-14" onClick={() => setNoteType('session')}>
                        <FileText className="mr-3 h-5 w-5" />
                        <div className="text-left">
                            <p className="font-semibold">Notas de la sesión</p>
                            <p className="text-xs text-muted-foreground">Detalles de una consulta específica.</p>
                        </div>
                    </Button>
                     <Button variant="outline" className="justify-start h-14" onClick={() => setNoteType('follow-up')}>
                        <FileClock className="mr-3 h-5 w-5" />
                        <div className="text-left">
                           <p className="font-semibold">Seguimiento</p>
                           <p className="text-xs text-muted-foreground">Registra el progreso de tareas o metas.</p>
                        </div>
                    </Button>
                    <Button variant="outline" className="justify-start h-14" onClick={() => setNoteType('summary')}>
                        <BarChartHorizontal className="mr-3 h-5 w-5" />
                        <div className="text-left">
                            <p className="font-semibold">Resumen de evolución</p>
                            <p className="text-xs text-muted-foreground">Evalúa un período de la terapia.</p>
                        </div>
                    </Button>
                </div>
                 <DialogFooter>
                    <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
                </DialogFooter>
            </>
        );
    }
    
    return (
        <form onSubmit={handleSubmit}>
            <DialogHeader>
                 <DialogTitle className="flex items-center">
                    <Button variant="ghost" size="icon" className="mr-2 h-7 w-7" onClick={() => setNoteType(null)}>
                        <ChevronLeft className="h-5 w-5"/>
                    </Button>
                    {
                        noteType === 'session' ? 'Nota de la Sesión' : 
                        noteType === 'follow-up' ? 'Nota de Seguimiento' : 'Resumen de Evolución'
                    }
                </DialogTitle>
                 <DialogDescription>
                    Rellena los campos para crear la nueva entrada.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
                {noteType === 'session' && (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label>Fecha</Label>
                                 <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn("w-full justify-start text-left font-normal", !sessionDate && "text-muted-foreground")}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {sessionDate ? format(sessionDate, "PPP", { locale: es }) : <span>Elige una fecha</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar mode="single" selected={sessionDate} onSelect={setSessionDate} initialFocus locale={es}/>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="session-topic">Tema central</Label>
                                <Input id="session-topic" value={sessionTopic} onChange={(e) => setSessionTopic(e.target.value)} placeholder="Ej: Regulación emocional"/>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="session-observations">Observaciones del paciente</Label>
                            <Textarea id="session-observations" value={sessionObservations} onChange={(e) => setSessionObservations(e.target.value)} placeholder="El paciente reporta..." rows={3}/>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="session-interventions">Intervenciones realizadas</Label>
                            <Textarea id="session-interventions" value={sessionInterventions} onChange={(e) => setSessionInterventions(e.target.value)} placeholder="Se aplicó técnica de..." rows={3}/>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="session-next-steps">Conclusiones o próximos pasos</Label>
                            <Textarea id="session-next-steps" value={sessionNextSteps} onChange={(e) => setSessionNextSteps(e.target.value)} placeholder="Asignar tarea..." rows={3}/>
                        </div>
                    </>
                )}
                {noteType === 'follow-up' && (
                     <>
                        <div className="space-y-1">
                            <Label htmlFor="follow-up-task">Tarea asignada</Label>
                            <Input id="follow-up-task" value={followUpTask} onChange={(e) => setFollowUpTask(e.target.value)} placeholder="Ej: Registro de pensamientos automáticos"/>
                        </div>
                         <div className="space-y-1">
                            <Label>Fecha asignada</Label>
                             <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn("w-full justify-start text-left font-normal", !followUpDate && "text-muted-foreground")}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {followUpDate ? format(followUpDate, "PPP", { locale: es }) : <span>Elige una fecha</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={followUpDate} onSelect={setFollowUpDate} initialFocus locale={es}/>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="follow-up-progress">Progreso observado</Label>
                            <Textarea id="follow-up-progress" value={followUpProgress} onChange={(e) => setFollowUpProgress(e.target.value)} placeholder="El paciente completó..." rows={3}/>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="follow-up-recommendations">Recomendaciones</Label>
                            <Textarea id="follow-up-recommendations" value={followUpRecommendations} onChange={(e) => setFollowUpRecommendations(e.target.value)} placeholder="Continuar con el registro..." rows={3}/>
                        </div>
                    </>
                )}
                 {noteType === 'summary' && (
                     <>
                        <div className="space-y-1">
                            <Label>Rango de fechas</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !summaryDateRange && "text-muted-foreground")}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {summaryDateRange?.from ? (summaryDateRange.to ? `${format(summaryDateRange.from, "LLL dd, y")} - ${format(summaryDateRange.to, "LLL dd, y")}` : format(summaryDateRange.from, "LLL dd, y")) : <span>Elige un rango</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar initialFocus mode="range" defaultMonth={summaryDateRange?.from} selected={summaryDateRange} onSelect={setSummaryDateRange} numberOfMonths={2} locale={es}/>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="summary-objectives">Objetivos trabajados</Label>
                            <Textarea id="summary-objectives" value={summaryObjectives} onChange={(e) => setSummaryObjectives(e.target.value)} placeholder="Durante este período, se trabajó en..." rows={2}/>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="summary-changes">Cambios observados</Label>
                            <Textarea id="summary-changes" value={summaryChanges} onChange={(e) => setSummaryChanges(e.target.value)} placeholder="Se observó una disminución en..." rows={2}/>
                        </div>
                         <div className="space-y-1">
                            <Label htmlFor="summary-patient-comments">Comentarios del paciente</Label>
                            <Textarea id="summary-patient-comments" value={summaryPatientComments} onChange={(e) => setSummaryPatientComments(e.target.value)} placeholder="El paciente expresó sentirse..." rows={2}/>
                        </div>
                         <div className="space-y-1">
                            <Label htmlFor="summary-evaluation">Evaluación del proceso</Label>
                            <Textarea id="summary-evaluation" value={summaryEvaluation} onChange={(e) => setSummaryEvaluation(e.target.value)} placeholder="La evolución del paciente es..." rows={2}/>
                        </div>
                    </>
                )}
            </div>
            <DialogFooter className="mt-4">
                <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
                <Button type="submit">Guardar</Button>
            </DialogFooter>
        </form>
    );
};
