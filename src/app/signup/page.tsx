
"use client";

import Link from "next/link";
import { SignUpForm } from "@/components/auth/signup-form";
import { AuthLogo } from "@/components/auth/auth-logo";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-5">
      <div className="w-full max-w-2xl rounded-2xl bg-card border border-border p-10 text-center shadow-lg">
        <div className="mb-8">
          <AuthLogo />
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            Bienvenidos a Zenda
          </h1>
          <p className="text-base text-muted-foreground">
            Regístrate para poder organizar tus citas, notas y evolución clínica desde un solo lugar.
          </p>
        </div>
        <SignUpForm />
        <p className="mt-4 text-center text-xs text-muted-foreground px-4">
            Al registrarte, aceptas nuestros{" "}
            <Link href="/terms" className="font-bold text-primary hover:underline">
              Términos y Condiciones
            </Link>{" "}
            y nuestra{" "}
            <Link href="/privacy" className="font-bold text-primary hover:underline">
              Política de Privacidad
            </Link>
            .
          </p>
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
