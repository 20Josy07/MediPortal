
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Wrench } from "lucide-react";
import Link from "next/link";

export default function AnalysisPage() {
  return (
    <div className="flex-1 space-y-8 p-8">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">Análisis de conversaciones</h1>
        <p className="text-muted-foreground mt-1">
          analiza tu conversación al instante
        </p>
      </div>

       <div className="flex items-center justify-center h-[60vh]">
        <Card className="w-full max-w-lg text-center p-8 shadow-lg">
          <CardHeader>
            <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
              <Wrench className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl">Página en Construcción</CardTitle>
            <CardDescription>
              Estamos trabajando para traerte poderosas herramientas de análisis.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <p className="text-muted-foreground">
                Pronto podrás analizar conversaciones y detectar señales de abuso psicológico aquí
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
