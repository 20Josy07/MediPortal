
"use client";

import { useState } from "react";
import Link from "next/link";
import { SignUpForm } from "@/components/auth/signup-form";
import { AuthLogo } from "@/components/auth/auth-logo";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { privacyPolicyText, termsAndConditionsText } from "@/lib/legal-text";

export default function SignUpPage() {
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-5">
      <div className="w-full max-w-2xl rounded-2xl bg-card border border-border p-10 text-center shadow-lg">
        <div className="mb-8">
          <AuthLogo />
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            Bienvenidos a Mently
          </h1>
          <p className="text-base text-muted-foreground">
            Regístrate para poder organizar tus citas, notas y evolución clínica desde un solo lugar.
          </p>
        </div>
        <SignUpForm termsAccepted={acceptedTerms} />

        <div className="mt-4 text-center text-xs text-muted-foreground px-4 space-y-4">
            <div className="flex items-center space-x-2 justify-center">
                <Checkbox id="terms" checked={acceptedTerms} onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)} />
                <Label htmlFor="terms" className="text-xs text-muted-foreground">
                    Acepto los{" "}
                    <Dialog>
                        <DialogTrigger asChild>
                            <span className="font-bold text-primary hover:underline cursor-pointer">Términos y Condiciones</span>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                            <DialogHeader>
                                <DialogTitle>Términos y Condiciones de Uso (MVP)</DialogTitle>
                                <DialogDescription>Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</DialogDescription>
                            </DialogHeader>
                            <ScrollArea className="max-h-[60vh] pr-6">
                                <p className="text-justify text-sm whitespace-pre-wrap">{termsAndConditionsText}</p>
                            </ScrollArea>
                        </DialogContent>
                    </Dialog>
                    {" "}y la{" "}
                    <Dialog>
                        <DialogTrigger asChild>
                             <span className="font-bold text-primary hover:underline cursor-pointer">Política de Privacidad</span>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                            <DialogHeader>
                                <DialogTitle>Política de Privacidad</DialogTitle>
                                 <DialogDescription>Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</DialogDescription>
                            </DialogHeader>
                             <ScrollArea className="max-h-[60vh] pr-6">
                                <div className="text-justify text-sm whitespace-pre-wrap prose prose-sm dark:prose-invert" dangerouslySetInnerHTML={{ __html: privacyPolicyText.replace(/\n/g, '<br />') }} />
                            </ScrollArea>
                        </DialogContent>
                    </Dialog>.
                </Label>
            </div>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-bold text-primary hover:underline">
            Iniciar Sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
