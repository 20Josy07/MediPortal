
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, Paperclip, Send, Bot, FileText, Clock, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const recentNotes = [
    { title: "Sesión con Ana G.", type: "Voz", date: "Hace 2 horas" },
    { title: "Reflexión sobre caso M.", type: "Texto", date: "Hace 1 día" },
    { title: "Ideas para terapia de grupo", type: "Texto", date: "Hace 3 días" },
];

const aiChatHistory = [
    { from: "user", text: "Resume la última sesión con el paciente Carlos Vega." },
    { from: "ai", text: "Claro. Durante la última sesión, Carlos Vega expresó una notable disminución en sus niveles de ansiedad laboral. Mencionó haber aplicado con éxito las técnicas de mindfulness discutidas. Sin embargo, señaló la persistencia de conflictos de comunicación con su pareja, identificando este como el principal foco para la próxima sesión." },
];

export default function SmartNotesPage() {
  const [isRecording, setIsRecording] = useState(false);

  return (
    <div className="flex-1 space-y-6">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">Notas Inteligentes</h1>
        <p className="text-muted-foreground">
          Crea, transcribe y analiza tus notas de sesión con el poder de la IA.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Notes Input */}
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
                            onClick={() => setIsRecording(!isRecording)}
                            >
                            <Mic className="h-10 w-10" />
                        </Button>
                        <p className="text-muted-foreground">{isRecording ? "Grabando..." : "Iniciar Grabación"}</p>
                        {isRecording && <p className="text-lg font-mono">01:23</p>}
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
                        <Textarea placeholder="Escribe aquí tus notas..." className="min-h-[250px] text-base" />
                        <div className="mt-4 flex justify-between items-center">
                            <Button variant="outline"><Paperclip className="mr-2 h-4 w-4" /> Adjuntar Archivo</Button>
                            <Button>Guardar Nota</Button>
                        </div>
                    </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>

        {/* AI Assistant and History */}
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
                    <div className="space-y-4">
                        {recentNotes.map((note, index) => (
                            <div key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <FileText className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="font-semibold">{note.title}</p>
                                        <p className="text-xs text-muted-foreground">{note.type}</p>
                                    </div>
                                </div>
                                <span className="text-xs text-muted-foreground">{note.date}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>

      </div>
    </div>
  );
}
