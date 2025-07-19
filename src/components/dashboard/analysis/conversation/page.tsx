
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Sparkles, Loader2 } from "lucide-react";

export default function ConversationAnalysisPage() {
  const [conversation, setConversation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleAnalyze = async () => {
    // Placeholder for future AI analysis logic
    setIsLoading(true);
    console.log("Analyzing:", conversation);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    // setAnalysisResult(...)
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          
          <p className="text-muted-foreground mt-2">
            Ingresa el texto de tu conversación abajo para obtener percepciones impulsadas por IA.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Ingresa el Texto de la Conversación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Pega aquí la conversación que quieres analizar..."
              className="min-h-[200px] text-base"
              value={conversation}
              onChange={(e) => setConversation(e.target.value)}
            />
            <Button 
              className="w-full mt-4" 
              onClick={handleAnalyze} 
              disabled={isLoading || !conversation}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Analizar Conversación
            </Button>
          </CardContent>
        </Card>
        {/*
          // Placeholder for results
          isLoading && (
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground mt-2">Analizando...</p>
            </div>
          )
        */}
        {/*
          analysisResult && (
            <Card>
              <CardHeader>
                <CardTitle>Resultados del Análisis</CardTitle>
              </CardHeader>
              <CardContent>
                // Render analysis results here
              </CardContent>
            </Card>
          )
        */}
      </div>
    </div>
  );
}
