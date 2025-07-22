
import { AuthLogo } from "@/components/auth/auth-logo";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-5">
      <Card className="w-full max-w-4xl">
         <CardHeader className="text-center">
            <div className="inline-block mx-auto">
             <AuthLogo />
            </div>
           <CardTitle className="text-3xl">Política de Privacidad</CardTitle>
           <CardDescription>Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
        </CardHeader>
        <CardContent className="prose prose-sm md:prose-base dark:prose-invert max-w-none mx-auto text-justify">
            <p>
                Esta es una política de privacidad de ejemplo. Deberías reemplazar este texto con tu propia política de privacidad.
            </p>
            <h2>Información que recopilamos</h2>
            <p>
                Recopilamos información que nos proporcionas directamente, como cuando creas una cuenta, te suscribes, participas en cualquier función interactiva de nuestros servicios, completas un formulario, solicitas atención al cliente o te comunicas con nosotros de cualquier otra manera.
            </p>
            <h2>Cómo usamos la información</h2>
            <p>
                Usamos la información que recopilamos sobre ti para proporcionar, mantener y mejorar nuestros servicios y para desarrollar nuevos productos y servicios. También podemos usar la información que recopilamos para:
            </p>
            <ul>
                <li>Enviar avisos técnicos, actualizaciones, alertas de seguridad y mensajes de soporte y administrativos.</li>
                <li>Responder a tus comentarios, preguntas y solicitudes y proporcionar servicio al cliente.</li>
                <li>Comunicarnos contigo sobre productos, servicios, ofertas, promociones, recompensas y eventos ofrecidos por Zenda y otros, y proporcionar noticias e información que creemos que será de tu interés.</li>
            </ul>
             <div className="text-center mt-8">
                <Link href="/" className="font-bold text-primary hover:underline">
                    Volver al home
                </Link>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
