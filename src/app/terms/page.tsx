"use client";

import { AuthLogo } from "@/components/auth/auth-logo";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function TermsPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-5">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
            <div className="inline-block mx-auto">
             <AuthLogo />
            </div>
           <CardTitle className="text-3xl">Términos y Condiciones de Uso (MVP)</CardTitle>
           <CardDescription>Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
        </CardHeader>
        <CardContent className="prose prose-sm md:prose-base dark:prose-invert max-w-none mx-auto text-justify">
            <p>
                Al utilizar Zenda en su versión MVP, aceptas que estás participando en una etapa temprana de prueba de una herramienta en desarrollo destinada a facilitar la práctica clínica de psicólogos, incluyendo funciones como agendamiento, organización de pacientes, generación de notas y transcripción automática de sesiones. Esta versión puede contener errores o limitaciones y no garantiza disponibilidad continua ni precisión total. Te comprometes a usar la plataforma de forma ética y profesional, respetando la confidencialidad de tus pacientes y las leyes de protección de datos vigentes. Zenda no se hace responsable por pérdidas o daños derivados del uso de esta versión. Toda la información que ingreses es tu responsabilidad, y recomendamos no introducir datos reales de pacientes sin su consentimiento informado. Al continuar, aceptas estos términos y nos ayudas a construir una mejor herramienta para la práctica clínica.
            </p>
             <div className="text-center mt-8">
                <button onClick={() => router.back()} className="font-bold text-primary hover:underline">
                    Volver atrás
                </button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
