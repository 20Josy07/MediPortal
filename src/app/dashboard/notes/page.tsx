
"use client";

import { useState, useEffect, useRef } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import type { Note, Patient } from "@/lib/types";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import type * as PdfJs from 'pdfjs-dist/types/src/pdf';
import type Mammoth from 'mammoth';
import type JsPDF from "jspdf";


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, Paperclip, Send, Bot, FileText, User, Loader2, StopCircle, Trash2, Edit, Upload, FileAudio, Sparkles, Download, Bold, Italic, Underline, Palette, AlignCenter, AlignLeft, AlignRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { transcribeAudio } from "@/ai/flows/transcribe-audio-flow";
import { chatWithNotes } from "@/ai/flows/summarize-notes-flow";
import { reformatNote, ReformatNoteOutput } from "@/ai/flows/reformat-note-flow";
import { addNote, updateNote, deleteNote } from "@/lib/firebase";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";


type ChatMessage = {
  from: "user" | "ai";
  text: string;
};

type NoteTemplate = "SOAP" | "DAP";
type GeneratedBlocks = ReformatNoteOutput;
type OnCommand = (command: string, value?: string) => void;

const RichTextEditorToolbar: React.FC<{ onCommand: OnCommand }> = ({ onCommand }) => {
    const colorInputRef = useRef<HTMLInputElement>(null);

    const handleColorClick = () => {
        colorInputRef.current?.click();
    };

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onCommand('foreColor', e.target.value);
    };

    return (
        <div className="flex items-center gap-1 p-2 border-b bg-muted rounded-t-md">
            <Button variant="ghost" size="icon" onMouseDown={(e) => { e.preventDefault(); onCommand('bold'); }}>
                <Bold className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onMouseDown={(e) => { e.preventDefault(); onCommand('italic'); }}>
                <Italic className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onMouseDown={(e) => { e.preventDefault(); onCommand('underline'); }}>
                <Underline className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6 mx-1" />
            <Button variant="ghost" size="icon" onMouseDown={(e) => { e.preventDefault(); onCommand('justifyLeft'); }}>
                <AlignLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onMouseDown={(e) => { e.preventDefault(); onCommand('justifyCenter'); }}>
                <AlignCenter className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onMouseDown={(e) => { e.preventDefault(); onCommand('justifyRight'); }}>
                <AlignRight className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6 mx-1" />
             <Button variant="ghost" size="icon" onMouseDown={(e) => e.preventDefault()} onClick={handleColorClick}>
                <Palette className="h-4 w-4" />
            </Button>
            <input
                type="color"
                ref={colorInputRef}
                onChange={handleColorChange}
                className="opacity-0 w-0 h-0 absolute"
            />
        </div>
    );
};


export default function SmartNotesPage() {
  const { user, db, userProfile, loading: authLoading } = useAuth();
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
  const [isEditing, setIsEditing] = useState(false);
  const [isFileProcessing, setIsFileProcessing] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const [selectedAudioFile, setSelectedAudioFile] = useState<File | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<NoteTemplate>("SOAP");
  const [generatedBlocks, setGeneratedBlocks] = useState<GeneratedBlocks | null>(null);
  const [isEditingTranscription, setIsEditingTranscription] = useState(false);


  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const audioFileInputRef = useRef<HTMLInputElement | null>(null);
  const chatScrollAreaRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const subjectiveRef = useRef<HTMLTextAreaElement>(null);
  const dataRef = useRef<HTMLTextAreaElement>(null);
  const planRef = useRef<HTMLTextAreaElement>(null);


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

  useEffect(() => {
    if (generatedBlocks) {
      setTimeout(() => {
        if (generatedBlocks.plan === "Completa manualmente" && planRef.current) {
          planRef.current.focus();
        } else if (selectedTemplate === 'SOAP' && subjectiveRef.current) {
          subjectiveRef.current.focus();
        } else if (selectedTemplate === 'DAP' && dataRef.current) {
          dataRef.current.focus();
        }
      }, 100);
    }
  }, [generatedBlocks, selectedTemplate]);
  
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
      toast({ title: "Resumen guardado" });
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
    setIsEditing(false);
    setIsEditingTranscription(false);
    setSelectedTemplate("SOAP");
    setGeneratedBlocks(null); // Reset generated blocks
    setIsDetailViewOpen(true);
  };
  
  const handleUpdateNote = async () => {
    if (!selectedNote || !user || !db || !selectedPatientId) return;

    let finalContent = editableNoteContent;
    if (generatedBlocks) {
      if (selectedTemplate === 'SOAP') {
        finalContent = `S (Subjetivo):\n${generatedBlocks.subjective}\n\nO (Objetivo):\n${generatedBlocks.objective}\n\nA (Análisis/Evaluación):\n${generatedBlocks.assessment}\n\nP (Plan):\n${generatedBlocks.plan}`;
      } else { // DAP
        finalContent = `D (Datos):\n${generatedBlocks.data}\n\nA (Análisis/Evaluación):\n${generatedBlocks.assessment}\n\nP (Plan):\n${generatedBlocks.plan}`;
      }
    } else if (editorRef.current) {
        finalContent = editorRef.current.innerHTML;
    }

    const updatedData = {
      title: editableNoteTitle,
      content: finalContent,
    };

    try {
      await updateNote(db, user.uid, selectedPatientId, selectedNote.id, updatedData);
      setNotes(notes.map(n => n.id === selectedNote.id ? { ...n, ...updatedData, content: finalContent } : n));
      toast({ title: "Nota actualizada correctamente." });
      setIsDetailViewOpen(false);
      setSelectedNote(null);
      setGeneratedBlocks(null);
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
      let text = "";

      if (file.type === "text/plain") {
        // TXT
        text = await file.text();
      
      } else if (file.type === "application/pdf") {
        // PDF (pdfjs-dist moderno)
        const pdfjsLib = await import("pdfjs-dist");
        const { getDocument, GlobalWorkerOptions } = pdfjsLib;
      
        GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url
        ).toString();
      
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
      
        let fullText = "";
        const maxPages = Math.min(pdf.numPages, 10); // limita páginas si quieres
      
        for (let i = 1; i <= maxPages; i++) {
          const page = await pdf.getPage(i);
          const tc = await page.getTextContent();
          fullText +=
            tc.items
              .map((it: any) => ("str" in it ? (it as any).str : ""))
              .join(" ") + "\n";
        }
      
        text = fullText.trim();
      
      } else if (
        file.name.endsWith(".docx") ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        // DOCX (mammoth)
        const mammoth = await import("mammoth");
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.default.extractRawText({ arrayBuffer });
        text = result.value ?? "";
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

  const handleGenerateTemplate = async () => {
    if (!editableNoteContent) {
      toast({ variant: 'destructive', title: 'El contenido de la nota no puede estar vacío.' });
      return;
    }
    setIsGenerating(true);
    setGeneratedBlocks(null);
    try {
      const result = await reformatNote({
        content: editableNoteContent,
        template: selectedTemplate,
      });
      if (result) {
        setGeneratedBlocks(result);
        setIsEditing(true); // Allow editing of generated blocks
        toast({ title: 'Nota formateada con éxito.', description: 'Revisa y edita los bloques generados.' });
      }
    } catch (error) {
      console.error('Error generating template:', error);
      toast({ 
          variant: 'destructive', 
          title: 'Error al generar la plantilla.',
          description: "Hubo un problema. Por favor, intenta de nuevo.",
          action: <Button variant="secondary" onClick={handleGenerateTemplate}>Reintentar</Button>
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBlockChange = (blockName: keyof GeneratedBlocks, value: string) => {
    if (generatedBlocks) {
      setGeneratedBlocks({
        ...generatedBlocks,
        [blockName]: value,
      });
    }
  };


  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
    const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
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

  const handleDownloadPdf = async () => {
    if (!selectedNote) return;

    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 15;

    let content = editableNoteContent;
    if (generatedBlocks) {
        if (selectedTemplate === 'SOAP') {
            content = `S (Subjetivo):\n${generatedBlocks.subjective || ''}\n\nO (Objetivo):\n${generatedBlocks.objective || ''}\n\nA (Análisis/Evaluación):\n${generatedBlocks.assessment || ''}\n\nP (Plan):\n${generatedBlocks.plan || ''}`;
        } else { // DAP
            content = `D (Datos):\n${generatedBlocks.data || ''}\n\nA (Análisis/Evaluación):\n${generatedBlocks.assessment || ''}\n\nP (Plan):\n${generatedBlocks.plan || ''}`;
        }
    }

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
    doc.text('Nota de Sesión', margin + 15, 12);
    
    doc.setTextColor(0,0,0);

    doc.setFillColor(headerFooterColor);
    doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text(`© ${new Date().getFullYear()} Zenda. Todos los derechos reservados.`, margin, pageHeight - 6);
    
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(editableNoteTitle, margin, 35);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    const dateStr = format(selectedNote.createdAt, "PPPp", { locale: es });
    const patientName = patients.find(p => p.id === selectedPatientId)?.name;
    const psychologistName = userProfile?.fullName || user?.displayName || 'N/A';

    doc.text(`Psicólogo/a: ${psychologistName}`, margin, 45);
    doc.text(`Paciente: ${patientName || 'N/A'}`, margin, 50);
    doc.text(`Fecha: ${dateStr}`, margin, 55);
    
    doc.setLineWidth(0.2);
    doc.line(margin, 60, pageWidth - margin, 60);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0,0,0);
    
    const splitContent = doc.splitTextToSize(content, pageWidth - margin * 2);
    doc.text(splitContent, margin, 70);
    
    doc.save(`${editableNoteTitle}.pdf`);
  };

  const handleEditorCommand: OnCommand = (command, value) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
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
             <p className="font-bold text-primary mb-1 uppercase">Selecciona el paciente</p>
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
      
      <Dialog open={isDetailViewOpen} onOpenChange={(isOpen) => { if (!isOpen) { setGeneratedBlocks(null); setIsEditing(false); } setIsDetailViewOpen(isOpen); }}>
        <DialogContent className="max-w-4xl">
          {selectedNote && (
            <>
              <DialogHeader>
                 <div className="flex justify-between items-start">
                    <div className="flex-grow">
                       <DialogTitle>
                        <Input 
                            value={editableNoteTitle}
                            onChange={(e) => setEditableNoteTitle(e.target.value)}
                            className="text-lg font-semibold p-0 border-0 shadow-none focus-visible:ring-0"
                            disabled={!isEditing}
                        />
                        </DialogTitle>
                        <DialogDescription>
                            {selectedNote.type} - {format(selectedNote.createdAt, "PPPp", { locale: es })}
                        </DialogDescription>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                        <Select value={selectedTemplate} onValueChange={(value) => setSelectedTemplate(value as NoteTemplate)}>
                            <SelectTrigger className="h-9 w-[120px]">
                                <SelectValue placeholder="Plantilla" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="SOAP">SOAP</SelectItem>
                                <SelectItem value="DAP">DAP</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-9"
                            onClick={handleGenerateTemplate}
                            disabled={isGenerating || (!isEditing && !isEditingTranscription)}
                        >
                            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                            {isGenerating ? 'Generando...' : 'Generar'}
                        </Button>
                    </div>
                 </div>
              </DialogHeader>
              <ScrollArea className="max-h-[60vh] my-4">
                {generatedBlocks ? (
                  <div className="space-y-4 p-1">
                    {selectedTemplate === 'SOAP' ? (
                      <>
                        <div>
                          <label className="font-semibold">S (Subjetivo)</label>
                          <Textarea ref={subjectiveRef} value={generatedBlocks.subjective} onChange={(e) => handleBlockChange('subjective', e.target.value)} className="mt-1 min-h-[10vh]" />
                        </div>
                        <div>
                          <label className="font-semibold">O (Objetivo)</label>
                          <Textarea value={generatedBlocks.objective} onChange={(e) => handleBlockChange('objective', e.target.value)} className="mt-1 min-h-[10vh]" />
                        </div>
                        <div>
                          <label className="font-semibold">A (Análisis/Evaluación)</label>
                          <Textarea value={generatedBlocks.assessment} onChange={(e) => handleBlockChange('assessment', e.target.value)} className="mt-1 min-h-[15vh]" />
                        </div>
                        <div>
                          <label className="font-semibold">P (Plan)</label>
                          <Textarea ref={planRef} value={generatedBlocks.plan} onChange={(e) => handleBlockChange('plan', e.target.value)} className="mt-1 min-h-[15vh]" />
                        </div>
                      </>
                    ) : (
                      <>
                         <div>
                          <label className="font-semibold">D (Datos)</label>
                          <Textarea ref={dataRef} value={generatedBlocks.data} onChange={(e) => handleBlockChange('data', e.target.value)} className="mt-1 min-h-[15vh]" />
                        </div>
                        <div>
                          <label className="font-semibold">A (Análisis/Evaluación)</label>
                          <Textarea value={generatedBlocks.assessment} onChange={(e) => handleBlockChange('assessment', e.target.value)} className="mt-1 min-h-[15vh]" />
                        </div>
                        <div>
                          <label className="font-semibold">P (Plan)</label>
                          <Textarea ref={planRef} value={generatedBlocks.plan} onChange={(e) => handleBlockChange('plan', e.target.value)} className="mt-1 min-h-[15vh]" />
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                    <div className="border rounded-md">
                        {(isEditing || isEditingTranscription) && <RichTextEditorToolbar onCommand={handleEditorCommand} />}
                        <div
                            ref={editorRef}
                            contentEditable={isEditing || isEditingTranscription}
                            dangerouslySetInnerHTML={{ __html: editableNoteContent }}
                            onBlur={(e) => setEditableNoteContent(e.currentTarget.innerHTML)}
                            className={cn(
                                "text-sm whitespace-pre-wrap p-4 focus:outline-none",
                                (isEditing || isEditingTranscription) ? "min-h-[40vh] bg-background" : "min-h-[20vh] bg-muted/30 cursor-not-allowed"
                            )}
                        />
                    </div>
                )}
              </ScrollArea>
              <DialogFooter className="sm:justify-between">
                <div className="flex gap-2 justify-start">
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
                    <Button variant="outline" onClick={handleDownloadPdf}>
                        <Download className="mr-2 h-4 w-4" /> Descargar
                    </Button>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsDetailViewOpen(false)}>Cancelar</Button>
                  {isEditing || isEditingTranscription ? (
                     <Button onClick={handleUpdateNote}>Guardar Cambios</Button>
                  ) : (
                    <Button onClick={() => { setIsEditing(true); setIsEditingTranscription(true); }}>
                        <Edit className="mr-2 h-4 w-4" /> Editar
                    </Button>
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

    