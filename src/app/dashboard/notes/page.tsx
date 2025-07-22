
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
import { Mic, Paperclip, Send, Bot, FileText, User, Loader2, StopCircle, Trash2, Edit, Upload, FileAudio } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { transcribeAudio } from "@/ai/flows/transcribe-audio-flow";
import { chatWithNotes } from "@/ai/flows/summarize-notes-flow";
import { addNote, updateNote, deleteNote } from "@/lib/firebase";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";


// Configure PDF.js worker
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

type ChatMessage = {
  from: "user" | "ai";
  text: string;
};

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
  const [isEditingTranscription, setIsEditingTranscription] = useState(false);
  const [isFileProcessing, setIsFileProcessing] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const [selectedAudioFile, setSelectedAudioFile] = useState<File | null>(null);


  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const audioFileInputRef = useRef<HTMLInputElement | null>(null);
  const chatScrollAreaRef = useRef<HTMLDivElement>(null);


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

  useEffect(() => {
    if (chatScrollAreaRef.current) {
        chatScrollAreaRef.current.scrollTo({
            top: chatScrollAreaRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [chatHistory]);
  
  const transcribeAndSaveAudio = async (base64Audio: string) => {
    if (!user || !db || !selectedPatientId) return;
    setIsTranscribing(true);
    try {
      const { transcription } = await transcribeAudio({ audioDataUri: base64Audio });
      if (transcription) {
        const newNote: Omit<Note, 'id'> = {
          title: `Nota de audio - ${new Date().toLocaleString()}`,
          type: 'Voz',
          content: transcription,
          patientId: selectedPatientId,
          createdAt: new Date(),
        };
        const addedNote = await addNote(db, user.uid, selectedPatientId, newNote);
        setNotes(prevNotes => [addedNote, ...prevNotes]);
        toast({ title: "Nota de audio guardada y transcrita." });
      }
    } catch (err) {
      console.error("Transcription error:", err);
      toast({ variant: "destructive", title: "Error al transcribir el audio." });
    } finally {
       setIsTranscribing(false);
       setSelectedAudioFile(null);
    }
  };

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
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;
          await transcribeAndSaveAudio(base64Audio);
          stream.getTracks().forEach(track => track.stop());
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
       toast({
        variant: "destructive",
        title: "Error al guardar la nota.",
        description: "Hubo un problema. Por favor, intenta de nuevo.",
        action: <Button variant="secondary" onClick={handleSaveTextNote}>Reintentar</Button>
      });
    }
  };
  
  const handleViewNote = (note: Note) => {
    setSelectedNote(note);
    setEditableNoteTitle(note.title);
    setEditableNoteContent(note.content || "");
    setIsEditingTranscription(false);
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
  
  const handleAudioFileSelected = (file: File) => {
    if (!selectedPatientId) {
      toast({ variant: "destructive", title: "Selecciona un paciente primero." });
      return;
    }

    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3'];
    const maxSize = 10 * 1024 * 1024; // 10 MB

    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.mp3')) {
      toast({
        variant: "destructive",
        title: "Formato de archivo no válido",
        description: "Por favor, sube un archivo MP3 o WAV.",
      });
      return;
    }

    if (file.size > maxSize) {
      toast({
        variant: "destructive",
        title: "Archivo demasiado grande",
        description: "El tamaño del archivo no puede exceder los 10 MB.",
      });
      return;
    }

    setSelectedAudioFile(file);
  };
  
  const handleUploadAudio = async () => {
    if (!selectedAudioFile) return;

    const reader = new FileReader();
    reader.readAsDataURL(selectedAudioFile);
    reader.onloadend = async () => {
      const base64Audio = reader.result as string;
      await transcribeAndSaveAudio(base64Audio);
    };
    reader.onerror = () => {
        toast({ variant: "destructive", title: "Error al leer el archivo." });
    };
  }

  const handleAudioFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleAudioFileSelected(file);
    }
    if (audioFileInputRef.current) {
      audioFileInputRef.current.value = "";
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleAudioFileSelected(file);
    } else {
      toast({ variant: "destructive", title: "No se soltó ningún archivo." });
    }
  };

  const handleAiChatSubmit = async () => {
    if (!chatInput.trim()) return;
    if (!selectedPatientId || notes.length === 0) {
      toast({ variant: "destructive", title: "No hay notas para analizar.", description: "Selecciona un paciente con notas." });
      return;
    }

    const newUserMessage: ChatMessage = { from: 'user', text: chatInput };
    setChatHistory(prev => [...prev, newUserMessage]);
    setChatInput("");
    setIsAiLoading(true);

    try {
      const notesContent = notes.map(n => `Nota: ${n.title}\nContenido: ${n.content}`).join('\n\n---\n\n');
      const result = await chatWithNotes({ question: chatInput, notesContent });
      
      if (result.answer) {
        const newAiMessage: ChatMessage = { from: 'ai', text: result.answer };
        setChatHistory(prev => [...prev, newAiMessage]);
      }
    } catch (error) {
      console.error("AI chat error:", error);
      toast({ variant: "destructive", title: "Error del asistente de IA." });
      const errorAiMessage: ChatMessage = { from: 'ai', text: "Lo siento, no pude procesar tu solicitud." };
      setChatHistory(prev => [...prev, errorAiMessage]);
    } finally {
      setIsAiLoading(false);
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
                      <Card 
                         onDragEnter={handleDragEnter}
                         onDragLeave={handleDragLeave}
                         onDragOver={handleDragOver}
                         onDrop={handleDrop}
                         className={cn("transition-all", isDraggingOver && "border-primary ring-2 ring-primary bg-primary/10")}
                      >
                      <CardHeader>
                          <CardTitle>Transcripción Automática</CardTitle>
                          <CardDescription>
                          Graba, sube o arrastra el audio de tu sesión y la IA lo transcribirá por ti.
                          </CardDescription>
                      </CardHeader>
                      <CardContent className="flex flex-col items-center justify-center gap-4 p-8 min-h-[300px]">
                          {selectedAudioFile ? (
                              <div className="flex flex-col items-center gap-4 w-full">
                                  <div className="flex items-center gap-3 p-3 border rounded-md bg-muted/50 w-full max-w-sm">
                                      <FileAudio className="h-6 w-6 text-primary" />
                                      <p className="font-medium truncate flex-1">{selectedAudioFile.name}</p>
                                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedAudioFile(null)}>
                                          <Trash2 className="h-4 w-4 text-destructive"/>
                                      </Button>
                                  </div>
                                  <Button onClick={handleUploadAudio} disabled={isTranscribing}>
                                      {isTranscribing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                                      Subir Archivo
                                  </Button>
                              </div>
                          ) : (
                              <>
                                  <div className="flex gap-4 items-center">
                                      <Button
                                          size="icon"
                                          className={`h-24 w-24 rounded-full transition-all duration-300 ${isRecording ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-primary hover:bg-primary/90"}`}
                                          onClick={handleMicClick}
                                          disabled={isTranscribing || !selectedPatientId}
                                      >
                                          {isTranscribing && !isRecording ? (
                                              <Loader2 className="h-10 w-10 animate-spin" />
                                          ) : isRecording ? (
                                              <StopCircle className="h-10 w-10" />
                                          ) : (
                                              <Mic className="h-10 w-10" />
                                          )}
                                      </Button>
                                      <Button
                                          variant="outline"
                                          className="h-24 w-24 rounded-full flex flex-col gap-1"
                                          onClick={() => audioFileInputRef.current?.click()}
                                          disabled={isTranscribing || !selectedPatientId}
                                      >
                                          <Upload className="h-8 w-8" />
                                          <span className="text-xs">Subir</span>
                                      </Button>
                                      <input
                                          type="file"
                                          ref={audioFileInputRef}
                                          onChange={handleAudioFileChange}
                                          className="hidden"
                                          accept="audio/mpeg,audio/wav,audio/mp3"
                                      />
                                  </div>
                                  <p className="text-muted-foreground text-center">
                                      {isDraggingOver ? "Suelta el archivo para transcribir" : isTranscribing ? "Transcribiendo..." : isRecording ? `Grabando... ${formatTime(recordingTime)}` : !selectedPatientId ? "Selecciona un paciente para empezar" : "Iniciar Grabación o Subir Archivo"}
                                  </p>
                              </>
                          )}
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
                          Pide resúmenes, análisis o ideas sobre las notas del paciente seleccionado.
                      </CardDescription>
                  </CardHeader>
                  <CardContent>
                      <ScrollArea className="h-64 w-full rounded-md border p-4 mb-4" ref={chatScrollAreaRef}>
                        <div className="space-y-4">
                            {chatHistory.length === 0 && (
                              <div className="flex justify-center items-center h-full">
                                <p className="text-muted-foreground text-sm">El historial del chat aparecerá aquí.</p>
                              </div>
                            )}
                            {chatHistory.map((message, index) => (
                                <div key={index} className={`flex items-start gap-3 ${message.from === 'user' ? 'justify-end' : ''}`}>
                                    {message.from === 'ai' && <div className="bg-primary rounded-full p-2 flex-shrink-0"><Bot className="h-5 w-5 text-primary-foreground" /></div>}
                                    <div className={`rounded-lg p-3 max-w-[85%] text-sm ${message.from === 'user' ? 'bg-muted' : 'bg-card'}`}>
                                        <p>{message.text}</p>
                                    </div>
                                    {message.from === 'user' && <div className="bg-muted rounded-full p-2 flex-shrink-0"><User className="h-5 w-5" /></div>}
                                </div>
                            ))}
                            {isAiLoading && (
                              <div className="flex items-start gap-3">
                                <div className="bg-primary rounded-full p-2 flex-shrink-0"><Bot className="h-5 w-5 text-primary-foreground" /></div>
                                <div className="rounded-lg p-3 max-w-[85%] text-sm bg-card flex items-center">
                                  <Loader2 className="h-4 w-4 animate-spin"/>
                                </div>
                              </div>
                            )}
                        </div>
                      </ScrollArea>
                      <div className="relative">
                          <Textarea 
                            placeholder={!selectedPatientId ? "Selecciona un paciente para chatear" : "Pregúntale algo a la IA..."} 
                            className="pr-16" 
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleAiChatSubmit();
                              }
                            }}
                            disabled={!selectedPatientId || isAiLoading}
                          />
                          <Button 
                            size="icon" 
                            className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8"
                            onClick={handleAiChatSubmit}
                            disabled={!selectedPatientId || isAiLoading || !chatInput.trim()}
                          >
                              {isAiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                          </Button>
                      </div>
                  </CardContent>
              </Card>
          </div>
          
          <div className="lg:col-span-1 flex flex-col">
            <Card className="flex-1 flex flex-col">
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
              <CardContent className="p-2 overflow-hidden flex-grow">
                <ScrollArea className="h-[115vh]">
                  <div className="space-y-2 p-2 h-full">
                    {isLoading ? (
                      <div className="flex justify-center items-center h-full">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    ) : notes.length > 0 ? (
                      notes.map((note) => (
                        <div
                          key={note.id}
                          onClick={() => handleViewNote(note)}
                          className="flex items-start p-3 rounded-md hover:bg-muted/50 cursor-pointer"
                        >
                          <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div className="flex-1 ml-3 overflow-hidden">
                            <p className="font-semibold truncate">{note.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {note.type}
                              {' | '}
                              {formatDistanceToNow(note.createdAt, {
                                addSuffix: true,
                                locale: es,
                              })}
                            </p>
                          </div>
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
                    disabled={!isEditingTranscription}
                  />
                </DialogTitle>
                <div className="flex justify-between items-center">
                  <DialogDescription>
                    {selectedNote.type} - {format(selectedNote.createdAt, "PPPp", { locale: es })}
                  </DialogDescription>
                  <div className="w-32">
                     <Select>
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Plantilla" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="soap">SOAP</SelectItem>
                        <SelectItem value="dap">DAP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </DialogHeader>
              <ScrollArea className="max-h-[50vh] rounded-md border my-4">
                 <Textarea 
                    value={editableNoteContent}
                    onChange={(e) => setEditableNoteContent(e.target.value)}
                    className="text-sm whitespace-pre-wrap min-h-[30vh] border-0 shadow-none focus-visible:ring-0"
                    disabled={!isEditingTranscription}
                  />
              </ScrollArea>
              <DialogFooter className="justify-between">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive"><Trash2 className="mr-2 h-4 w-4" /> Eliminar</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás absolutely seguro?</AlertDialogTitle>
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
                  {!isEditingTranscription ? (
                    <Button onClick={() => setIsEditingTranscription(true)}><Edit className="mr-2 h-4 w-4" /> Editar</Button>
                  ) : (
                    <Button onClick={handleUpdateNote}>Guardar Cambios</Button>
                  )}
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
