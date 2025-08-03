
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
    <p>En Zenda, respetamos tu derecho a controlar tu información. Si deseas eliminar tu cuenta y todos los datos asociados, puedes hacerlo de forma inmediata y segura desde el panel de control.</p>
    <h3>Eliminación desde tu cuenta (Recomendado)</h3>
    <p>Para eliminar tu cuenta y todos tus datos, sigue estos pasos:</p>
    <ol>
        <li>Inicia sesión y ve a tu <strong>Dashboard</strong>.</li>
        <li>Navega a la sección de <strong>Configuración</strong>.</li>
        <li>En el apartado de <strong>Seguridad y Cuenta</strong>, encontrarás la opción para eliminar tu cuenta permanentemente.</li>
    </ol>
    <br/>
    <p>Esta acción es irreversible y eliminará todos los datos de tus pacientes, sesiones y notas de forma definitiva.</p>
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
