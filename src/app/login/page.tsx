import Link from "next/link";
import Image from "next/image";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-5">
      <div className="w-full max-w-md rounded-2xl bg-background p-10 text-center shadow-[0_10px_30px_rgba(255,255,255,0.5)] backdrop-blur-sm">
        <div className="mb-8">
          <Image
            src="/og-image.png"
            alt="Logo Alumbra"
            width={100}
            height={100}
            className="mx-auto mb-2.5 h-auto w-auto max-w-[100px]"
          />
          <h1 className="mb-2.5 text-4xl font-bold text-white">
            Bienvenido de nuevo
          </h1>
          <p className="text-lg text-white/80">
            Inicia sesión para acceder a tu cuenta.
          </p>
        </div>
        <LoginForm />
        <div className="mt-4 text-center">
          <span className="text-sm">
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
