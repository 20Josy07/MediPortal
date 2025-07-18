
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { GoogleIcon, FacebookIcon, LinkedinIcon, MicrosoftIcon } from "../icons";
import { signInWithGoogle } from "@/lib/firebase";

const formSchema = z.object({
  fullname: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  email: z.string().email({ message: "Por favor, introduce un correo válido." }),
  username: z.string().min(2, { message: "El nombre de usuario debe tener al menos 2 caracteres." }),
  password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres." }),
  dob: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Por favor, introduce una fecha válida." }),
  gender: z.string().min(1, { message: "Por favor, selecciona un género." }),
});

export function SignUpForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { auth, db } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "",
      email: "",
      username: "",
      password: "",
      dob: "",
      gender: "",
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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: values.fullname,
        });
      }

      toast({
        title: "Cuenta Creada",
        description: "Te has registrado exitosamente.",
      });

      router.push("/dashboard");
    } catch (error: any) {
      console.error("Sign Up Error:", error);
      toast({
        variant: "destructive",
        title: "Error al registrarse",
        description: error.message || "Ocurrió un error inesperado. Por favor, inténtalo de nuevo.",
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
        title: "Error de registro con Google",
        description: "No se pudo crear la cuenta con Google. Por favor, inténtalo de nuevo.",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="text-left">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="fullname"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-white">Nombre Completo</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Tu nombre completo"
                    className="mt-1 w-full rounded-lg border-none bg-white/10 p-4 text-white placeholder:text-white/60 focus:border-inline focus:border-2 focus:border-primary focus:outline-none"
                    {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-white">Correo Electrónico</FormLabel>
                <FormControl>
                  <Input
                    placeholder="nombre@ejemplo.com"
                    className="mt-1 w-full rounded-lg border-none bg-white/10 p-4 text-white placeholder:text-white/60 focus:border-inline focus:border-2 focus:border-primary focus:outline-none"
                    {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-white">Nombre de Usuario</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Tu nombre de usuario"
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
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-white">Fecha de Nacimiento</FormLabel>
                <FormControl>
                  <Input 
                    type="date"
                    className="mt-1 w-full rounded-lg border-none bg-white/10 p-4 text-white placeholder:text-white/60 focus:border-inline focus:border-2 focus:border-primary focus:outline-none"
                    {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-white">Género</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="mt-1 w-full rounded-lg border-none bg-white/10 p-4 text-white h-auto placeholder:text-white/60 focus:border-inline focus:border-2 focus:border-primary focus:outline-none">
                      <SelectValue placeholder="Selecciona tu género" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Masculino</SelectItem>
                    <SelectItem value="female">Femenino</SelectItem>
                    <SelectItem value="other">Otro</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex-center mt-6">
          <p className="social-login-text mb-4 text-sm text-white/70">O regístrate con</p>
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
        
        <Button type="submit" className="login-shimmer-button w-full mt-8 h-auto" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Registrarse
        </Button>
      </form>
    </Form>
  );
}
