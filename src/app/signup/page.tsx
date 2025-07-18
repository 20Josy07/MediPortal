import Link from "next/link";
import Image from "next/image";
import { SignUpForm } from "@/components/auth/signup-form";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-5">
      <div className="w-full max-w-2xl rounded-2xl bg-background p-10 text-center shadow-[0_10px_30px_rgba(255,255,255,0.5)] backdrop-blur-sm">
        <div className="mb-8">
          <Image
            src="https://i.postimg.cc/59L8Lbsj/og-image.png"
            alt="Logo Alumbra"
            width={100}
            height={100}
            className="mx-auto mb-2.5 h-auto w-auto max-w-[100px]"
          />
          <h1 className="mb-2.5 text-4xl font-bold text-white">
            Bienvenidos a Alumbra
          </h1>
          <p className="text-lg text-white/80">
            Regístrate para poder organizar tus citas, notas y evolución clínica desde un solo lugar.
          </p>
        </div>
        <SignUpForm />
        <p className="mt-4 text-center text-sm text-white/80">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-bold text-primary hover:underline">
            Iniciar Sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

    
