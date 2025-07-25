
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Wrench } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TutorialsPage() {
  return (
    <div className="flex-1 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tutoriales en Video</h1>
        <p className="text-muted-foreground mt-1">
          Guías visuales para sacar el máximo provecho a Mently.
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
              Estamos trabajando para traerte tutoriales en video muy pronto.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <p className="text-muted-foreground">
                Mientras tanto, puedes consultar nuestra{" "}
                <Link href="/dashboard/support/quick-guide" className="font-semibold text-primary hover:underline">
                    Guía Rápida
                </Link>
                .
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
