
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { FacebookIcon, GoogleIcon, LinkedinIcon, MicrosoftIcon } from "../icons";
import { signInWithGoogle } from "@/lib/firebase";

const formSchema = z.object({
  email: z.string().email({ message: "Por favor, introduce un correo válido." }),
  password: z.string().min(1, { message: "La contraseña es obligatoria." }),
});

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { auth, db } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!auth) {
      toast({
        variant: "destructive",
        title: "Error de configuración",
        description: "Firebase no está configurado. Por favor, contacta al soporte.",
      });
      return;
    }
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Login Error:", error);
      toast({
        variant: "destructive",
        title: "Error al iniciar sesión",
        description: "Credenciales inválidas, por favor verifica tus datos.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleSignIn = async () => {
    if (!auth || !db) {
       toast({
        variant: "destructive",
        title: "Error de configuración",
        description: "Firebase no está disponible. Por favor, contacta al soporte.",
      });
      return;
    }
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle(auth, db);
      router.push("/dashboard");
    } catch (error) {
      console.error("Google Sign In Error:", error);
      toast({
        variant: "destructive",
        title: "Error de inicio de sesión con Google",
        description: "No se pudo iniciar sesión con Google. Por favor, inténtalo de nuevo.",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 text-left">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-foreground">Correo Electrónico</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="tu@ejemplo.com"
                    {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-foreground">Contraseña</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <div className="text-right">
              <Link href="#" className="text-sm font-medium text-primary hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          <Button type="submit" className="w-full text-base font-bold" size="lg" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Iniciar Sesión
          </Button>
        </form>
      </Form>
      <div className="flex-center mt-6">
        <p className="social-login-text mb-4 text-sm text-muted-foreground">O inicia sesión con</p>
        <div className="flex items-center justify-center gap-5">
           <Button
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              variant="outline"
              size="icon"
              className="group h-12 w-12 rounded-full flex items-center justify-center"
            >
              {isGoogleLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <GoogleIcon className="h-6 w-6 text-foreground" />}
           </Button>
           <Button variant="outline" size="icon" className="group h-12 w-12 rounded-full flex items-center justify-center">
              <FacebookIcon className="h-6 w-6 text-foreground" />
           </Button>
           <Button variant="outline" size="icon" className="group h-12 w-12 rounded-full flex items-center justify-center">
              <LinkedinIcon className="h-6 w-6 text-foreground" />
           </Button>
            <Button variant="outline" size="icon" className="group h-12 w-12 rounded-full flex items-center justify-center">
              <MicrosoftIcon className="h-6 w-6 text-foreground" />
           </Button>
        </div>
      </div>
    </div>
  );
}
