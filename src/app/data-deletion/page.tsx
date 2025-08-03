"use client";

import { AuthLogo } from "@/components/auth/auth-logo";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function DataDeletionPage() {
  const router = useRouter();

  const dataDeletionInstructions = `
    <p>En Zenda, respetamos tu derecho a controlar tu información. Si deseas eliminar tu cuenta y todos los datos asociados, sigue estos pasos:</p>
    <ol>
        <li><strong>Envía un correo electrónico:</strong> Redacta un correo electrónico desde la dirección de email con la que te registraste en nuestra plataforma.</li>
        <li><strong>Destinatario:</strong> Dirige el correo a <a href="mailto:soporte-baja@zenda.ai" style="color: hsl(var(--primary)); text-decoration: underline;">soporte-baja@zenda.ai</a>.</li>
        <li><strong>Asunto:</strong> Utiliza el asunto "Solicitud de Eliminación de Datos".</li>
        <li><strong>Contenido del correo:</strong> En el cuerpo del mensaje, por favor, indica claramente tu nombre de usuario y tu deseo de eliminar permanentemente tu cuenta y toda la información asociada.</li>
    </ol>
    <p><strong>Proceso y plazos:</strong></p>
    <p>Una vez que recibamos tu solicitud, nuestro equipo la verificará. La eliminación de los datos se completará en un plazo máximo de 30 días hábiles. Te enviaremos una confirmación por correo electrónico una vez que el proceso haya finalizado. Esta acción es irreversible.</p>
  `;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-5">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
            <div className="inline-block mx-auto">
             <AuthLogo />
            </div>
           <CardTitle className="text-3xl">Instrucciones para la Eliminación de Datos</CardTitle>
           <CardDescription>Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
        </CardHeader>
        <CardContent className="prose prose-sm md:prose-base dark:prose-invert max-w-none mx-auto text-justify">
             <div dangerouslySetInnerHTML={{ __html: dataDeletionInstructions }} />
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
