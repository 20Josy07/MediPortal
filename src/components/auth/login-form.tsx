
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
                <FormLabel className="font-bold text-white">Correo Electrónico</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="tu@ejemplo.com"
                    className="mt-1 w-full rounded-lg border-none bg-white/10 p-4 text-white placeholder:text-white/60 focus:border-inline focus:border-2 focus:border-primary focus:outline-none"
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
                <FormLabel className="font-bold text-white">Contraseña</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    className="mt-1 w-full rounded-lg border-none bg-white/10 p-4 text-white placeholder:text-white/60 focus:border-inline focus:border-2 focus:border-primary focus:outline-none"
                    {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <span className="block text-left text-sm mt-2.5">
              <Link href="#" className="font-bold text-primary hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </span>
          <Button type="submit" className="login-shimmer-button w-full mt-8 h-auto" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Iniciar Sesión
          </Button>
        </form>
      </Form>
      <div className="flex-center mt-6">
        <p className="social-login-text mb-4 text-sm text-white/70">O inicia sesión con</p>
        <div className="flex items-center justify-center gap-5">
           <Button
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              variant="outline"
              className="group h-14 w-14 rounded-full bg-primary flex items-center justify-center overflow-hidden transition-colors duration-300 hover:bg-[#d62976] p-0 border-0"
            >
              {isGoogleLoading ? <Loader2 className="h-7 w-7 animate-spin" /> : <GoogleIcon className="h-7 w-7 text-white transition-transform duration-300 group-hover:animate-[slide-in-top_0.3s_both]" />}
           </Button>
           <a href="#" className="group h-14 w-14 rounded-full bg-primary flex items-center justify-center overflow-hidden transition-colors duration-300 hover:bg-[#00acee]">
              <FacebookIcon className="h-7 w-7 text-white transition-transform duration-300 group-hover:animate-[slide-in-top_0.3s_both]" />
           </a>
           <a href="#" className="group h-14 w-14 rounded-full bg-primary flex items-center justify-center overflow-hidden transition-colors duration-300 hover:bg-[#0072b1]">
              <LinkedinIcon className="h-7 w-7 text-white transition-transform duration-300 group-hover:animate-[slide-in-top_0.3s_both]" />
           </a>
            <a href="#" className="group h-14 w-14 rounded-full bg-primary flex items-center justify-center overflow-hidden transition-colors duration-300 hover:bg-[#128C7E]">
              <MicrosoftIcon className="h-7 w-7 text-white transition-transform duration-300 group-hover:animate-[slide-in-top_0.3s_both]" />
           </a>
        </div>
      </div>
    </div>
  );
}
