
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { signInWithGoogle } from "@/lib/firebase";
import { AuthCard } from "@/components/auth/auth-card";

export default function SignUpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { auth, db } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      toast({
        variant: "destructive",
        title: "Error de configuración",
        description: "Firebase no está configurado.",
      });
      return;
    }
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (user) {
        await updateProfile(user, { displayName: fullName });
        await sendEmailVerification(user);
      }
      toast({
        title: "¡Registro exitoso!",
        description: "Revisa tu email para confirmar tu cuenta y espera la validación del administrador.",
      });
      router.push("/login");
    } catch (error: any) {
      console.error("Sign Up Error:", error);
      toast({
        variant: "destructive",
        title: "Error al registrarse",
        description: error.code === 'auth/email-already-in-use' ? 'El correo electrónico ya está en uso.' : 'Ocurrió un error inesperado.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
     if (provider.toLowerCase() !== 'google') {
      toast({ title: "Próximamente", description: "Esta opción de inicio de sesión estará disponible pronto." });
      return;
    }
    
    if (!auth || !db) {
       toast({
        variant: "destructive",
        title: "Error de configuración",
        description: "Firebase no está disponible.",
      });
      return;
    }
    setIsLoading(true);
    try {
      await signInWithGoogle(auth, db);
      toast({
        title: "¡Registro exitoso!",
        description: "Tu cuenta ha sido creada. Espera la validación del administrador para poder iniciar sesión.",
      });
      router.push("/login");
    } catch (error) {
      console.error("Google Sign In Error:", error);
      toast({
        variant: "destructive",
        title: "Error de registro con Google",
        description: "No se pudo crear la cuenta con Google.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-5 bg-cover bg-center" style={{backgroundImage: "url('https://i.postimg.cc/jdtHgNF9/Bg.jpg')"}}>
      <AuthCard
        isLoading={isLoading}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        onSignUp={handleSignUp}
        onSocialLogin={handleSocialLogin}
        fullName={fullName}
        setFullName={setFullName}
        username={username}
        setUsername={setUsername}
        birthDate={birthDate}
        setBirthDate={setBirthDate}
        gender={gender}
        setGender={setGender}
        // Props for signin form, not used here but required by the component
        rememberMe={false}
        setRememberMe={() => {}}
        onSignIn={() => {}}
        onForgotPassword={() => {}}
      />
    </div>
  );
}
