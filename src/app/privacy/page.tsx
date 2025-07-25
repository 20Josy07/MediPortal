"use client";

import { AuthLogo } from "@/components/auth/auth-logo";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { privacyPolicyText } from "@/lib/legal-text";

export default function PrivacyPage() {
  const router = useRouter();
  
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
           <div dangerouslySetInnerHTML={{ __html: privacyPolicyText.replace(/\n/g, '<br />').replace(/<br \/>\s*<br \/>/g, '</p><p>') }} />
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
