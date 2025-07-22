
import Link from "next/link";
import Image from "next/image";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-5">
      <div className="w-full max-w-md rounded-2xl bg-primary/20 border border-border p-10 text-center shadow-lg">
        <div className="mb-8">
          <Image
            src="https://i.postimg.cc/BbB1NZZF/replicate-prediction-h8nxevgngdrge0cr5vb92hqb80.png"
            alt="Logo Zenda"
            width={80}
            height={80}
            className="mx-auto mb-4 h-auto w-auto max-w-[80px]"
          />
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
