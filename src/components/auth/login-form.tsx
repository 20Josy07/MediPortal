
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { logButtonClick } from "@/lib/reportService";
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
import { FacebookIcon, GoogleIcon, LinkedinIcon, MicrosoftIcon } from "../icons";
import { signInWithGoogle, sendPasswordResetEmail } from "@/lib/firebase";
import { getDoc, doc } from "firebase/firestore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";


const formSchema = z.object({
  email: z.string().email({ message: "Por favor, introduce un correo válido." }),
  password: z.string().min(1, { message: "La contraseña es obligatoria." }),
});

const passwordResetSchema = z.object({
  email: z.string().email({ message: "Por favor, introduce un correo válido para restablecer tu contraseña." }),
});

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { auth, db } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

   const passwordResetForm = useForm<z.infer<typeof passwordResetSchema>>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      email: "",
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
      if (auth?.currentUser?.uid) {
        await logButtonClick('login_email', auth.currentUser.uid);
      }
    } catch (error: any) {
      console.error("Login Error:", error);
      let description = "Ocurrió un error inesperado. Por favor, inténtalo de nuevo.";
      if (
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/invalid-credential'
      ) {
        description = "Credenciales inválidas. Por favor, verifica tu correo y contraseña.";
      }
      toast({
        variant: "destructive",
        title: "Error al iniciar sesión",
        description: description,
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handlePasswordReset = async (values: z.infer<typeof passwordResetSchema>) => {
    if (!auth) {
       toast({
        variant: "destructive",
        title: "Error de configuración",
        description: "Firebase no está configurado.",
      });
      return;
    }
    setIsResetting(true);
    try {
        await sendPasswordResetEmail(auth, values.email);
        toast({
            title: "Correo enviado",
            description: "Revisa tu bandeja de entrada para restablecer tu contraseña.",
        });
        setIsResetDialogOpen(false);
        passwordResetForm.reset();
    } catch (error: any) {
        console.error("Password Reset Error:", error);
        toast({
            variant: "destructive",
            title: "Error al enviar correo",
            description: "No se pudo enviar el correo de restablecimiento. Verifica la dirección e inténtalo de nuevo.",
        });
    } finally {
        setIsResetting(false);
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
      const user = await signInWithGoogle(auth, db);
      
      // Verificar si el usuario está validado
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists() && !userDoc.data()?.validated) {
        await auth.signOut();  // Cerrar sesión
        throw new Error('account-not-validated');
      }
      if (auth?.currentUser?.uid) {
        await logButtonClick('login_google', auth.currentUser.uid);
      }
      
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Google Sign In Error:", error);
      if (error.message === 'account-not-validated') {
        toast({
          variant: "destructive",
          title: "Cuenta no validada",
          description: "Tu cuenta está pendiente de validación por un administrador.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error de inicio de sesión con Google",
          description: "No se pudo iniciar sesión con Google. Por favor, inténtalo de nuevo.",
        });
      }
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
               <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                    <DialogTrigger asChild>
                        <button type="button" className="text-sm font-medium text-primary hover:underline">
                            ¿Olvidaste tu contraseña?
                        </button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Restablecer contraseña</DialogTitle>
                            <DialogDescription>
                                Introduce tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...passwordResetForm}>
                            <form onSubmit={passwordResetForm.handleSubmit(handlePasswordReset)} className="space-y-4">
                                <FormField
                                    control={passwordResetForm.control}
                                    name="email"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Correo Electrónico</FormLabel>
                                        <FormControl>
                                        <Input 
                                            placeholder="tu@ejemplo.com"
                                            {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button type="button" variant="outline" disabled={isResetting}>
                                            Cancelar
                                        </Button>
                                    </DialogClose>
                                    <Button type="submit" disabled={isResetting}>
                                        {isResetting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Enviar enlace
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
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
        </div>
      </div>
    </div>
  );
}
