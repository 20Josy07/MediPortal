
"use client";

import { useState, useEffect, useRef } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import type { Note } from "@/lib/types";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, Paperclip, Send, Bot, FileText, User, Loader2, StopCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { transcribeAudio } from "@/ai/flows/transcribe-audio-flow";
import { addNote } from "@/lib/firebase";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";


const aiChatHistory = [
    { from: "user", text: "Resume la última sesión con el paciente Carlos Vega." },
    { from: "ai", text: "Claro. Durante la última sesión, Carlos Vega expresó una notable disminución en sus niveles de ansiedad laboral. Mencionó haber aplicado con éxito las técnicas de mindfulness discutidas. Sin embargo, señaló la persistencia de conflictos de comunicación con su pareja, identificando este como el principal foco para la próxima sesión." },
];

export default function SmartNotesPage() {
  const { user, db, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
  const [textNoteContent, setTextNoteContent] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);


  useEffect(() => {
    const fetchNotes = async () => {
      if (authLoading || !user || !db) {
        if (!authLoading) setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const notesCollection = collection(db, `users/${user.uid}/notes`);
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
  }, [user, db, authLoading, toast]);


  const startRecording = async () => {
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
            
            if (transcription && user && db) {
              const newNote: Omit<Note, 'id'> = {
                title: `Nota de voz - ${new Date().toLocaleString()}`,
                type: 'Voz',
                content: transcription,
                createdAt: new Date(),
              };
              const addedNote = await addNote(db, user.uid, newNote);
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
    if (!textNoteContent.trim()) {
      toast({ variant: "destructive", title: "La nota no puede estar vacía." });
      return;
    }
    if (!user || !db) {
      toast({ variant: "destructive", title: "Debes iniciar sesión para guardar notas." });
      return;
    }

    try {
      const newNote: Omit<Note, 'id'> = {
        title: `${textNoteContent.substring(0, 30)}${textNoteContent.length > 30 ? '...' : ''}`,
        type: 'Texto',
        content: textNoteContent,
        createdAt: new Date(),
      };
      const addedNote = await addNote(db, user.uid, newNote);
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
    setIsDetailViewOpen(true);
  };
  
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
    const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };


  return (
    <>
      <div className="flex-1 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notas Inteligentes</h1>
          <p className="text-muted-foreground">
            Crea, transcribe y analiza tus notas de sesión con el poder de la IA.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
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
                              disabled={isTranscribing}
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
                              {isTranscribing ? "Transcribiendo..." : isRecording ? `Grabando... ${formatTime(recordingTime)}` : "Iniciar Grabación"}
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
                            placeholder="Escribe aquí tus notas..." 
                            className="min-h-[250px] text-base"
                            value={textNoteContent}
                            onChange={(e) => setTextNoteContent(e.target.value)}
                          />
                          <div className="mt-4 flex justify-between items-center">
                              <Button variant="outline"><Paperclip className="mr-2 h-4 w-4" /> Adjuntar Archivo</Button>
                              <Button onClick={handleSaveTextNote}>Guardar Nota</Button>
                          </div>
                      </CardContent>
                      </Card>
                  </TabsContent>
              </Tabs>
          </div>

          <div className="space-y-8">
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

              <Card>
                  <CardHeader>
                      <CardTitle>Historial de Notas</CardTitle>
                  </CardHeader>
                  <CardContent>
                      {isLoading ? (
                          <div className="flex justify-center items-center h-40">
                              <Loader2 className="h-6 w-6 animate-spin text-primary" />
                          </div>
                      ) : (
                          <div className="space-y-4">
                              {notes.length > 0 ? notes.map((note) => (
                                  <div key={note.id} onClick={() => handleViewNote(note)} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 cursor-pointer">
                                      <div className="flex items-center gap-3">
                                          <FileText className="h-5 w-5 text-muted-foreground" />
                                          <div>
                                              <p className="font-semibold">{note.title}</p>
                                              <p className="text-xs text-muted-foreground">{note.type}</p>
                                          </div>
                                      </div>
                                      <span className="text-xs text-muted-foreground">
                                          {formatDistanceToNow(note.createdAt, { addSuffix: true, locale: es })}
                                      </span>
                                  </div>
                              )) : (
                                  <p className="text-center text-sm text-muted-foreground py-4">No hay notas guardadas.</p>
                              )}
                          </div>
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
                <DialogTitle>{selectedNote.title}</DialogTitle>
                <DialogDescription>
                  {selectedNote.type} - {format(selectedNote.createdAt, "PPPp", { locale: es })}
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[60vh] rounded-md border p-4 my-4">
                <p className="text-sm whitespace-pre-wrap">
                  {selectedNote.content}
                </p>
              </ScrollArea>
              <div className="flex justify-end">
                  <Button variant="outline" onClick={() => setIsDetailViewOpen(false)}>Cerrar</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
