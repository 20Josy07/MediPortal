
import Link from "next/link";
import Image from "next/image";
import { SignUpForm } from "@/components/auth/signup-form";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-5">
      <div className="w-full max-w-2xl rounded-2xl bg-card border border-border p-10 text-center shadow-lg">
        <div className="mb-8">
          <Image
            src="https://i.postimg.cc/HntBCkhT/Logo-Zenda-Light.png"
            alt="Logo Zenda"
            width={80}
            height={80}
            className="mx-auto mb-4 h-auto w-auto max-w-[80px]"
          />
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            Bienvenidos a Zenda
          </h1>
          <p className="text-base text-muted-foreground">
            Regístrate para poder organizar tus citas, notas y evolución clínica desde un solo lugar.
          </p>
        </div>
        <SignUpForm />
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
