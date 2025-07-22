
"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
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
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { GoogleIcon, FacebookIcon, LinkedinIcon, MicrosoftIcon } from "../icons";
import { signInWithGoogle } from "@/lib/firebase";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  fullname: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  email: z.string().email({ message: "Por favor, introduce un correo válido." }),
  username: z.string().min(2, { message: "El nombre de usuario debe tener al menos 2 caracteres." }),
  password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres." })
    .refine((password) => /[a-z]/.test(password), {
      message: "La contraseña debe contener al menos una letra minúscula.",
    })
    .refine((password) => /[A-Z]/.test(password), {
      message: "La contraseña debe contener al menos una letra mayúscula.",
    })
    .refine((password) => /\d/.test(password), {
      message: "La contraseña debe contener al menos un número.",
    })
    .refine((password) => /[@$!%*?&]/.test(password), {
      message: "La contraseña debe contener al menos un carácter especial (@$!%*?&).",
    }),
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
    mode: "onChange"
  });
  
  const passwordValue = form.watch("password");

  const calculatePasswordStrength = (password: string) => {
    let score = 0;
    if (!password) return { score: 0, color: "bg-transparent", label: "" };

    if (password.length >= 8) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;

    let color = "bg-red-500";
    let label = "Débil";
    if (score >= 4) {
      color = "bg-green-500";
      label = "Fuerte";
    } else if (score >= 2) {
      color = "bg-yellow-500";
      label = "Media";
    }
    
    return { score, color, label };
  };
  
  const passwordStrength = useMemo(() => calculatePasswordStrength(passwordValue), [passwordValue]);


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

      const user = userCredential.user;
      if (user) {
        await updateProfile(user, {
          displayName: values.fullname,
        });
        await sendEmailVerification(user);
      }

      toast({
        title: "¡Registro exitoso!",
        description: "Revisa tu email para confirmar tu cuenta.",
      });

      // Reset form and potentially redirect to login or a "please-verify" page
      form.reset();
      router.push("/login");

    } catch (error: any) {
      console.error("Sign Up Error:", error);
      toast({
        variant: "destructive",
        title: "Error al registrarse",
        description: error.code === 'auth/email-already-in-use' ? 'El correo electrónico ya está en uso.' : 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo.',
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
                <FormLabel className="font-bold text-foreground">Nombre Completo</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Tu nombre completo"
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
                <FormLabel className="font-bold text-foreground">Correo Electrónico</FormLabel>
                <FormControl>
                  <Input
                    placeholder="nombre@ejemplo.com"
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
                <FormLabel className="font-bold text-foreground">Nombre de Usuario</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Tu nombre de usuario"
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
                <div className="flex justify-between items-center">
                   <FormLabel className="font-bold text-foreground">Contraseña</FormLabel>
                   {passwordStrength.label && (
                    <span className="text-xs font-medium" style={{ color: passwordStrength.color.replace('bg-', '') }}>
                      {passwordStrength.label}
                    </span>
                   )}
                </div>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="••••••••"
                    {...field} />
                </FormControl>
                <Progress value={passwordStrength.score * 25} className={cn("h-2", passwordStrength.color)} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-foreground">Fecha de Nacimiento</FormLabel>
                <FormControl>
                  <Input 
                    type="date"
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
                <FormLabel className="font-bold text-foreground">Género</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
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
          <p className="social-login-text mb-4 text-sm text-muted-foreground">O regístrate con</p>
          <div className="flex items-center justify-center gap-5">
             <Button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
                variant="outline"
                size="icon"
                className="group h-12 w-12 rounded-full flex items-center justify-center"
             >
                {isGoogleLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <GoogleIcon className="h-6 w-6 text-foreground" />}
             </Button>
             <Button type="button" variant="outline" size="icon" className="group h-12 w-12 rounded-full flex items-center justify-center">
                <FacebookIcon className="h-6 w-6 text-foreground" />
             </Button>
             <Button type="button" variant="outline" size="icon" className="group h-12 w-12 rounded-full flex items-center justify-center">
                <LinkedinIcon className="h-6 w-6 text-foreground" />
             </Button>
              <Button type="button" variant="outline" size="icon" className="group h-12 w-12 rounded-full flex items-center justify-center">
                <MicrosoftIcon className="h-6 w-6 text-foreground" />
             </Button>
          </div>
        </div>
        
        <Button type="submit" className="w-full mt-8 text-base font-bold" size="lg" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Registrarse
        </Button>
      </form>
    </Form>
  );
}
