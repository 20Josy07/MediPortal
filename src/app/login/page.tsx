
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { getDoc, doc } from "firebase/firestore";
import { signInWithGoogle, sendPasswordResetEmail } from "@/lib/firebase";
import { AuthCard } from "@/components/auth/auth-card";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { auth, db } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
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
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
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
  };

  const handleSocialLogin = async (provider: string) => {
    if (provider !== 'google') {
      toast({ title: "Próximamente", description: "Esta opción de inicio de sesión estará disponible pronto." });
      return;
    }

    if (!auth || !db) {
      toast({
        variant: "destructive",
        title: "Error de configuración",
        description: "Firebase no está disponible. Por favor, contacta al soporte.",
      });
      return;
    }
    setIsLoading(true);
    try {
      const user = await signInWithGoogle(auth, db);
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists() && !userDoc.data()?.validated) {
        await auth.signOut();
        throw new Error('account-not-validated');
      }
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Google Sign In Error:", error);
      toast({
        variant: "destructive",
        title: "Error de inicio de sesión con Google",
        description: error.message === 'account-not-validated' 
          ? "Tu cuenta está pendiente de validación por un administrador."
          : "No se pudo iniciar sesión con Google. Por favor, inténtalo de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleForgotPassword = async () => {
    if (!auth) {
       toast({
        variant: "destructive",
        title: "Error de configuración",
        description: "Firebase no está configurado.",
      });
      return;
    }
    if (!email) {
      toast({
        variant: "destructive",
        title: "Correo requerido",
        description: "Por favor, introduce tu correo electrónico para restablecer la contraseña.",
      });
      return;
    }
    setIsLoading(true);
    try {
        await sendPasswordResetEmail(auth, email);
        toast({
            title: "Correo enviado",
            description: "Revisa tu bandeja de entrada para restablecer tu contraseña.",
        });
    } catch (error: any) {
        console.error("Password Reset Error:", error);
        toast({
            variant: "destructive",
            title: "Error al enviar correo",
            description: "No se pudo enviar el correo de restablecimiento. Verifica la dirección e inténtalo de nuevo.",
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-5 bg-cover bg-center" style={{backgroundImage: "url('/placeholder.svg')"}}>
      <AuthCard
        isLoading={isLoading}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        rememberMe={rememberMe}
        setRememberMe={setRememberMe}
        onSignIn={handleSignIn}
        onSocialLogin={handleSocialLogin}
        onForgotPassword={handleForgotPassword}
        onSignUp={() => {}} // This is handled by the signup page
      />
    </div>
  );
}
