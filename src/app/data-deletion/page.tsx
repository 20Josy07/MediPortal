
"use client";

import { AuthLogo } from "@/components/auth/auth-logo";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function DataDeletionPage() {
  const router = useRouter();

  const dataDeletionInstructions = `
    <p>En Zenda, respetamos tu derecho a controlar tu información. Si deseas eliminar tu cuenta y todos los datos asociados, sigue estos pasos:</p>
    <ol>
        <li><strong>Ve a la Configuración:</strong> Dentro de la aplicación, navega a la sección "Configuración" en tu panel de control.</li>
        <li><strong>Busca la sección "Seguridad y Privacidad":</strong> Expande esta sección para ver las opciones relacionadas con tu cuenta.</li>
        <li><strong>Haz clic en "Eliminar mi cuenta":</strong> Encontrarás un botón para iniciar el proceso de eliminación.</li>
        <li><strong>Confirma la acción:</strong> Se te pedirá que confirmes tu decisión. Es posible que, por seguridad, necesitemos que vuelvas a introducir tu contraseña para verificar tu identidad.</li>
    </ol>
    <p><strong>Proceso y plazos:</strong></p>
    <p>Una vez que confirmes la eliminación, tu cuenta y todos los datos asociados (pacientes, notas, sesiones) se borrarán de forma permanente de nuestros servidores. No podrás recuperar tu información una vez completado el proceso.</p>
    <p>Si tienes problemas para acceder a tu cuenta, puedes enviar un correo a <a href="mailto:soporte-baja@zenda.ai" style="color: hsl(var(--primary)); text-decoration: underline;">soporte-baja@zenda.ai</a> para solicitar la eliminación manual.</p>
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
