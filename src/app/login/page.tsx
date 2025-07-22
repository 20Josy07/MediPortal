"use client";

import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { AuthLogo } from "@/components/auth/auth-logo";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-5">
      <div className="w-full max-w-md rounded-2xl bg-card border border-border p-10 text-center shadow-lg">
        <div className="mb-8">
          <AuthLogo />
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            Bienvenido de nuevo
          </h1>
          <p className="text-base text-muted-foreground">
            Inicia sesión para acceder a tu cuenta.
          </p>
        </div>
        <LoginForm />
        <div className="mt-6 text-center">
          <span className="text-sm text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <Link href="/signup" className="font-bold text-primary hover:underline">
              Regístrate
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
