
"use client";

import { useState, useEffect, useRef } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import type { Note, Patient } from "@/lib/types";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import * as pdfjs from 'pdfjs-dist/build/pdf';
import mammoth from 'mammoth';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, Paperclip, Send, Bot, FileText, User, Loader2, StopCircle, Trash2, Edit } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { transcribeAudio } from "@/ai/flows/transcribe-audio-flow";
import { addNote, updateNote, deleteNote } from "@/lib/firebase";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


// Configure PDF.js worker
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

const aiChatHistory = [
    { from: "user", text: "Resume la última sesión con el paciente Carlos Vega." },
    { from: "ai", text: "Claro. Durante la última sesión, Carlos Vega expresó una notable disminución en sus niveles de ansiedad laboral. Mencionó haber aplicado con éxito las técnicas de mindfulness discutidas. Sin embargo, señaló la persistencia de conflictos de comunicación con su pareja, identificando este como el principal foco para la próxima sesión." },
];

export default function SmartNotesPage() {
  const { user, db, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
  const [textNoteContent, setTextNoteContent] = useState("");
  const [editableNoteContent, setEditableNoteContent] = useState("");
  const [editableNoteTitle, setEditableNoteTitle] = useState("");
  const [isFileProcessing, setIsFileProcessing] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);


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


  useEffect(() => {
    const fetchNotes = async () => {
      if (!selectedPatientId || !user || !db) {
        setNotes([]);
        return;
      }
      setIsLoading(true);
      try {
        const notesCollection = collection(db, `users/${user.uid}/patients/${selectedPatientId}/notes`);
        const q = query(notesCollection, orderBy("createdAt", "desc"));
        const noteSnapshot = await getDocs(q);
        const noteList = noteSnapshot.docs.map((doc) => {
           const data = doc.data();
           return {
            id: doc.id,
            ...data,
            createdAt: (data.createdAt as any).toDate(),
           } as Note;
        });
        setNotes(noteList);
      } catch (error) {
        console.error("Error fetching notes:", error);
        toast({ variant: "destructive", title: "Error al cargar las notas." });
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotes();
  }, [selectedPatientId, user, db, toast]);


  const startRecording = async () => {
    if (!selectedPatientId) {
        toast({ variant: "destructive", title: "Selecciona un paciente antes de grabar." });
        return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        setIsTranscribing(true);
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;
          try {
            const { transcription } = await transcribeAudio({ audioDataUri: base64Audio });
            
            if (transcription && user && db && selectedPatientId) {
              const newNote: Omit<Note, 'id'> = {
                title: `Nota de voz - ${new Date().toLocaleString()}`,
                type: 'Voz',
                content: transcription,
                patientId: selectedPatientId,
                createdAt: new Date(),
              };
              const addedNote = await addNote(db, user.uid, selectedPatientId, newNote);
              setNotes(prevNotes => [addedNote, ...prevNotes]);
              toast({ title: "Nota de voz guardada y transcrita." });
            }
          } catch (err) {
            console.error("Transcription error:", err);
            toast({ variant: "destructive", title: "Error al transcribir la nota." });
          } finally {
             setIsTranscribing(false);
             stream.getTracks().forEach(track => track.stop());
          }
        };
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1);
      }, 1000);
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({ variant: "destructive", title: "No se pudo iniciar la grabación.", description: "Por favor, permite el acceso al micrófono." });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      setRecordingTime(0);
    }
  };

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  const handleSaveTextNote = async () => {
    if (!selectedPatientId) {
        toast({ variant: "destructive", title: "Selecciona un paciente para guardar la nota." });
        return;
    }
    if (!textNoteContent.trim() || !user || !db) {
      toast({ variant: "destructive", title: "La nota no puede estar vacía." });
      return;
    }

    try {
      const newNote: Omit<Note, 'id'> = {
        title: `${textNoteContent.substring(0, 30)}${textNoteContent.length > 30 ? '...' : ''}`,
        type: 'Texto',
        content: textNoteContent,
        patientId: selectedPatientId,
        createdAt: new Date(),
      };
      const addedNote = await addNote(db, user.uid, selectedPatientId, newNote);
      setNotes(prevNotes => [addedNote, ...prevNotes]);
      setTextNoteContent("");
      toast({ title: "Nota de texto guardada." });
    } catch (error) {
       console.error("Error saving text note:", error);
       toast({ variant: "destructive", title: "Error al guardar la nota de texto." });
    }
  };
  
  const handleViewNote = (note: Note) => {
    setSelectedNote(note);
    setEditableNoteTitle(note.title);
    setEditableNoteContent(note.content || "");
    setIsDetailViewOpen(true);
  };
  
  const handleUpdateNote = async () => {
    if (!selectedNote || !user || !db || !selectedPatientId) return;

    const updatedData = {
      title: editableNoteTitle,
      content: editableNoteContent,
    };

    try {
      await updateNote(db, user.uid, selectedPatientId, selectedNote.id, updatedData);
      setNotes(notes.map(n => n.id === selectedNote.id ? { ...n, ...updatedData } : n));
      toast({ title: "Nota actualizada correctamente." });
      setIsDetailViewOpen(false);
      setSelectedNote(null);
    } catch (error) {
      console.error("Error updating note:", error);
      toast({ variant: "destructive", title: "Error al actualizar la nota." });
    }
  };

  const handleDeleteNote = async () => {
    if (!selectedNote || !user || !db || !selectedPatientId) return;

    try {
      await deleteNote(db, user.uid, selectedPatientId, selectedNote.id);
      setNotes(notes.filter(n => n.id !== selectedNote.id));
      toast({ title: "Nota eliminada correctamente." });
      setIsDetailViewOpen(false);
      setSelectedNote(null);
    } catch (error) {
      console.error("Error deleting note:", error);
      toast({ variant: "destructive", title: "Error al eliminar la nota." });
    }
  };
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!selectedPatientId) {
        toast({ variant: "destructive", title: "Selecciona un paciente primero." });
        return;
    }

    setIsFileProcessing(true);
    try {
      let text = '';
      if (file.type === 'text/plain') {
        text = await file.text();
      } else if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjs.getDocument(arrayBuffer).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          fullText += textContent.items.map((item: any) => item.str).join(' ');
        }
        text = fullText;
      } else if (file.name.endsWith('.docx') || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      } else {
        toast({ variant: "destructive", title: "Formato de archivo no soportado.", description: "Por favor, sube un .txt, .pdf, or .docx." });
        setIsFileProcessing(false);
        return;
      }
      setTextNoteContent(current => current + '\n\n' + text);
      toast({ title: "Documento procesado y añadido a la nota." });
    } catch (error) {
      console.error("Error processing file:", error);
      toast({ variant: "destructive", title: "Error al procesar el archivo." });
    } finally {
      setIsFileProcessing(false);
       if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
    const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };


  return (
    <>
      <div className="flex-1 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notas Inteligentes</h1>
            <p className="text-muted-foreground">
              Selecciona un paciente y luego crea, transcribe o analiza tus notas de sesión.
            </p>
          </div>
          <div className="w-full max-w-xs">
             <Select onValueChange={setSelectedPatientId} value={selectedPatientId || ""}>
                <SelectTrigger>
                    <SelectValue placeholder="Selecciona un paciente..." />
                </SelectTrigger>
                <SelectContent>
                    {patients.length > 0 ? patients.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    )) : (
                        <div className="p-4 text-center text-sm text-muted-foreground">No hay pacientes</div>
                    )}
                </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          <div className="lg:col-span-2 space-y-8">
              <Tabs defaultValue="voice">
                  <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="voice">Nota de Voz</TabsTrigger>
                      <TabsTrigger value="text">Nota de Texto</TabsTrigger>
                  </TabsList>
                  <TabsContent value="voice">
                      <Card>
                      <CardHeader>
                          <CardTitle>Transcripción Automática</CardTitle>
                          <CardDescription>
                          Graba el audio de tu sesión y la IA lo transcribirá por ti.
                          </CardDescription>
                      </CardHeader>
                      <CardContent className="flex flex-col items-center justify-center gap-4 p-8 min-h-[300px]">
                          <Button
                              size="icon"
                              className={`h-24 w-24 rounded-full transition-all duration-300 ${isRecording ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-primary hover:bg-primary/90"}`}
                              onClick={handleMicClick}
                              disabled={isTranscribing || !selectedPatientId}
                              >
                              {isTranscribing ? (
                                  <Loader2 className="h-10 w-10 animate-spin" />
                              ) : isRecording ? (
                                  <StopCircle className="h-10 w-10" />
                              ) : (
                                  <Mic className="h-10 w-10" />
                              )}
                          </Button>
                          <p className="text-muted-foreground">
                              {isTranscribing ? "Transcribiendo..." : isRecording ? `Grabando... ${formatTime(recordingTime)}` : !selectedPatientId ? "Selecciona un paciente para grabar" : "Iniciar Grabación"}
                          </p>
                      </CardContent>
                      </Card>
                  </TabsContent>
                  <TabsContent value="text">
                      <Card>
                      <CardHeader>
                          <CardTitle>Editor de Notas</CardTitle>
                          <CardDescription>
                          Escribe tus notas manualmente o pega texto para analizar.
                          </CardDescription>
                      </CardHeader>
                      <CardContent>
                          <Textarea 
                            placeholder={!selectedPatientId ? "Selecciona un paciente para empezar a escribir..." : "Escribe aquí tus notas..."}
                            className="min-h-[250px] text-base"
                            value={textNoteContent}
                            onChange={(e) => setTextNoteContent(e.target.value)}
                            disabled={!selectedPatientId}
                          />
                          <div className="mt-4 flex justify-between items-center">
                              <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={!selectedPatientId || isFileProcessing}>
                                {isFileProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Paperclip className="mr-2 h-4 w-4" />}
                                Adjuntar Archivo
                              </Button>
                              <input 
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept=".txt,.pdf,.docx,.doc"
                              />
                              <Button onClick={handleSaveTextNote} disabled={!selectedPatientId}>Guardar Nota</Button>
                          </div>
                      </CardContent>
                      </Card>
                  </TabsContent>
              </Tabs>
              
              <Card>
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2"><Bot className="h-6 w-6" /> Asistente de IA</CardTitle>
                      <CardDescription>
                          Pide resúmenes, análisis o ideas.
                      </CardDescription>
                  </CardHeader>
                  <CardContent>
                      <ScrollArea className="h-64 w-full rounded-md border p-4 mb-4">
                        <div className="space-y-4">
                            {aiChatHistory.map((message, index) => (
                                <div key={index} className={`flex items-start gap-3 ${message.from === 'user' ? 'justify-end' : ''}`}>
                                    {message.from === 'ai' && <div className="bg-primary rounded-full p-2"><Bot className="h-5 w-5 text-primary-foreground" /></div>}
                                    <div className={`rounded-lg p-3 max-w-[85%] text-sm ${message.from === 'user' ? 'bg-muted' : 'bg-card'}`}>
                                        <p>{message.text}</p>
                                    </div>
                                    {message.from === 'user' && <div className="bg-muted rounded-full p-2"><User className="h-5 w-5" /></div>}
                                </div>
                            ))}
                        </div>
                      </ScrollArea>
                      <div className="relative">
                          <Textarea placeholder="Pregúntale algo a la IA..." className="pr-16" />
                          <Button size="icon" className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8">
                              <Send className="h-4 w-4" />
                          </Button>
                      </div>
                  </CardContent>
              </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card className="flex flex-col max-h-[calc(100vh-12rem)]">
              <CardHeader>
                <CardTitle>Historial de Notas</CardTitle>
                <CardDescription>
                  {selectedPatientId
                    ? `Mostrando notas para ${
                        patients.find((p) => p.id === selectedPatientId)?.name
                      }`
                    : "Selecciona un paciente para ver sus notas"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow p-2 overflow-hidden">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <ScrollArea className="h-full">
                    <div className="space-y-2 p-2">
                      {notes.length > 0 ? (
                        notes.map((note) => (
                          <div
                            key={note.id}
                            onClick={() => handleViewNote(note)}
                            className="flex items-center justify-between p-3 rounded-md hover:bg-muted/50 cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                              <div className="flex-1 overflow-hidden">
                                <p className="font-semibold truncate">{note.title}</p>
                                <p className="text-xs text-muted-foreground">{note.type}</p>
                              </div>
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {formatDistanceToNow(note.createdAt, {
                                addSuffix: true,
                                locale: es,
                              })}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-sm text-muted-foreground h-full flex items-center justify-center p-4">
                          {selectedPatientId
                            ? "No hay notas para este paciente."
                            : "Selecciona un paciente."}
                        </p>
                      )}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
      
      <Dialog open={isDetailViewOpen} onOpenChange={setIsDetailViewOpen}>
        <DialogContent className="max-w-2xl">
          {selectedNote && (
            <>
              <DialogHeader>
                <DialogTitle>
                  <Input 
                    value={editableNoteTitle}
                    onChange={(e) => setEditableNoteTitle(e.target.value)}
                    className="text-lg font-semibold p-0 border-0 shadow-none focus-visible:ring-0"
                  />
                </DialogTitle>
                <DialogDescription>
                  {selectedNote.type} - {format(selectedNote.createdAt, "PPPp", { locale: es })}
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[50vh] rounded-md border my-4">
                 <Textarea 
                    value={editableNoteContent}
                    onChange={(e) => setEditableNoteContent(e.target.value)}
                    className="text-sm whitespace-pre-wrap min-h-[30vh] border-0 shadow-none focus-visible:ring-0"
                  />
              </ScrollArea>
              <DialogFooter className="justify-between">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive"><Trash2 className="mr-2 h-4 w-4" /> Eliminar</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esto eliminará permanentemente tu nota.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteNote}>Continuar</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsDetailViewOpen(false)}>Cancelar</Button>
                  <Button onClick={handleUpdateNote}>Guardar Cambios</Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
