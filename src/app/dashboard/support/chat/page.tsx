
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Bot, User, ChevronRight, HelpCircle } from 'lucide-react';
import { faqData } from '@/lib/faq-data';
import type { FAQ } from '@/lib/faq-data';

type ChatMessage = {
  from: "user" | "bot";
  text: React.ReactNode;
};

export default function FaqChatPage() {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { from: 'bot', text: '¡Hola! Soy el asistente de Mently. ¿En qué puedo ayudarte hoy? Puedes seleccionar una de las preguntas frecuentes a continuación.' },
  ]);

  const handleQuestionClick = (faq: FAQ) => {
    // Add user question to chat
    const userMessage: ChatMessage = { from: 'user', text: faq.question };
    
    // Add bot answer to chat
    const botMessage: ChatMessage = { from: 'bot', text: faq.answer };

    setChatHistory(prev => [...prev, userMessage, botMessage]);
  };

  return (
    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
         <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bot className="h-6 w-6" /> Asistente de Ayuda</CardTitle>
                <CardDescription>
                    Respuestas instantáneas a tus preguntas.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
                <ScrollArea className="flex-grow h-96 w-full rounded-md border p-4 mb-4">
                <div className="space-y-4">
                    {chatHistory.map((message, index) => (
                        <div key={index} className={`flex items-start gap-3 ${message.from === 'user' ? 'justify-end' : ''}`}>
                            {message.from === 'bot' && <div className="bg-primary rounded-full p-2 flex-shrink-0"><Bot className="h-5 w-5 text-primary-foreground" /></div>}
                            <div className={`rounded-lg p-3 max-w-[85%] text-sm ${message.from === 'user' ? 'bg-muted' : 'bg-card'}`}>
                                <div className="prose prose-sm text-foreground">{message.text}</div>
                            </div>
                            {message.from === 'user' && <div className="bg-muted rounded-full p-2 flex-shrink-0"><User className="h-5 w-5" /></div>}
                        </div>
                    ))}
                </div>
                </ScrollArea>
                <div className="text-center text-muted-foreground text-sm">
                    Para más ayuda, contacta a soporte@mently.ai
                </div>
            </CardContent>
         </Card>
      </div>
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><HelpCircle className="h-5 w-5"/> Preguntas Frecuentes</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[60vh]">
              <div className="space-y-2">
                {faqData.map((faq) => (
                    <Button
                        key={faq.id}
                        variant="outline"
                        className="w-full justify-between text-left h-auto py-3"
                        onClick={() => handleQuestionClick(faq)}
                    >
                        <span className="flex-1">{faq.question}</span>
                        <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
