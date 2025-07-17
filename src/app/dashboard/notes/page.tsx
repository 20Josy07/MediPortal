
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";

export default function SmartNotesPage() {
  const [isRecording, setIsRecording] = useState(false);

  return (
    <div className="flex-1 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notas Inteligentes</h1>
        <p className="text-muted-foreground">
          Transcripción y generación de notas SOAP con IA
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Grabación de Voz</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center gap-4 p-8">
            <Button
              size="icon"
              className="h-24 w-24 rounded-full bg-primary hover:bg-primary/90"
              onClick={() => setIsRecording(!isRecording)}
            >
              <Mic className="h-10 w-10" />
            </Button>
            <p className="text-muted-foreground">Iniciar Grabación</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
