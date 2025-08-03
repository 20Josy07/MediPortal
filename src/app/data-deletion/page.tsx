
"use client";

import { AuthLogo } from "@/components/auth/auth-logo";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";

export default function DataDeletionPage() {
  const router = useRouter();
  const { user, deleteUserAccount } = useAuth();
  const { toast } = useToast();

  const dataDeletionInstructions = `
    <p>En Zenda, respetamos tu derecho a controlar tu información. Si deseas eliminar tu cuenta y todos los datos asociados, tienes dos opciones:</p>
    <h3>Opción 1: Eliminación Inmediata (Recomendado)</h3>
    <p>Si has iniciado sesión, puedes eliminar tu cuenta y todos tus datos de forma inmediata y segura desde el panel de control.</p>
    <ol>
        <li>Ve a tu <strong>Dashboard</strong>.</li>
        <li>Navega a la sección de <strong>Configuración</strong>.</li>
        <li>En el apartado de <strong>Seguridad y Cuenta</strong>, encontrarás la opción para eliminar tu cuenta permanentemente.</li>
    </ol>
    <br/>
    <h3>Opción 2: Solicitud por Correo Electrónico</h3>
    <p>Si no puedes acceder a tu cuenta, sigue estos pasos:</p>
    <ol>
        <li><strong>Envía un correo electrónico:</strong> Redacta un correo electrónico desde la dirección de email con la que te registraste en nuestra plataforma.</li>
        <li><strong>Destinatario:</strong> Dirige el correo a <a href="mailto:soporte-baja@zenda.ai" style="color: hsl(var(--primary)); text-decoration: underline;">soporte-baja@zenda.ai</a>.</li>
        <li><strong>Asunto:</strong> Utiliza el asunto "Solicitud de Eliminación de Datos".</li>
        <li><strong>Contenido del correo:</strong> En el cuerpo del mensaje, por favor, indica claramente tu nombre de usuario y tu deseo de eliminar permanentemente tu cuenta y toda la información asociada.</li>
    </ol>
    <p><strong>Proceso y plazos (Opción 2):</strong></p>
    <p>Una vez que recibamos tu solicitud, nuestro equipo la verificará. La eliminación de los datos se completará en un plazo máximo de 30 días hábiles. Te enviaremos una confirmación por correo electrónico una vez que el proceso haya finalizado. Esta acción es irreversible.</p>
  `;

    const handleDelete = async () => {
        try {
            await deleteUserAccount();
            toast({
                title: "Cuenta eliminada",
                description: "Tu cuenta ha sido eliminada permanentemente.",
            });
            router.push('/');
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error al eliminar la cuenta",
                description: error.message || "Por favor, inténtalo de nuevo.",
            });
        }
    };

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
             {user && (
                <div className="mt-6 p-4 border border-destructive rounded-md bg-destructive/10">
                    <h4 className="font-bold text-destructive">Acción Directa de Eliminación</h4>
                    <p className="text-sm text-destructive/80">
                        Hemos detectado que tienes una sesión activa. Puedes proceder a eliminar tu cuenta y todos tus datos ahora mismo. Esta acción es irreversible.
                    </p>
                    <Button variant="destructive" className="mt-4" onClick={handleDelete}>
                        Eliminar mi cuenta permanentemente
                    </Button>
                </div>
             )}
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
