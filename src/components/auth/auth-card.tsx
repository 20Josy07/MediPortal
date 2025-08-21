
"use client"

import type React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SignInForm } from "./sign-in-form"
import { SignUpForm } from "./sign-up-form"
import { SocialLogin } from "./social-login"

interface AuthCardProps {
  isLoading: boolean
  email: string
  setEmail: (email: string) => void
  password: string
  setPassword: (password: string) => void
  rememberMe: boolean
  setRememberMe: (remember: boolean) => void
  onSignIn: (e: React.FormEvent) => void
  onSignUp: (e: React.FormEvent) => void
  onSocialLogin: (provider: string) => void
  onForgotPassword: () => void
  fullName: string
  setFullName: (name: string) => void
}

export function AuthCard({
  isLoading,
  email,
  setEmail,
  password,
  setPassword,
  rememberMe,
  setRememberMe,
  onSignIn,
  onSignUp,
  onSocialLogin,
  onForgotPassword,
  fullName,
  setFullName,
}: AuthCardProps) {
  
  return (
    <div className="w-full max-w-md mx-auto">
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-2xl">
            <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-black/30 backdrop-blur-sm rounded-full p-1 border border-white/10">
                    <TabsTrigger
                    value="signin"
                    className="px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=inactive]:text-white/60 hover:text-white hover:bg-white/5"
                    >
                    Iniciar Sesión
                    </TabsTrigger>
                    <TabsTrigger
                    value="signup"
                    className="px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=inactive]:text-white/60 hover:text-white hover:bg-white/5"
                    >
                    Registrarse
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="signin">
                    <h1 className="text-3xl font-normal text-white my-8 text-center">Bienvenido de vuelta</h1>
                    <SignInForm
                        onSubmit={onSignIn}
                        isLoading={isLoading}
                        email={email}
                        setEmail={setEmail}
                        password={password}
                        setPassword={setPassword}
                        rememberMe={rememberMe}
                        setRememberMe={setRememberMe}
                        onForgotPassword={onForgotPassword}
                    />
                </TabsContent>
                <TabsContent value="signup">
                    <h1 className="text-3xl font-normal text-white my-8 text-center">Crear una cuenta</h1>
                    <SignUpForm
                        onSubmit={onSignUp}
                        isLoading={isLoading}
                        password={password}
                        setPassword={setPassword}
                        fullName={fullName}
                        setFullName={setFullName}
                        email={email}
                        setEmail={setEmail}
                    />
                </TabsContent>

                <div className="flex items-center my-8">
                    <div className="flex-1 h-px bg-white/10"></div>
                    <span className="px-4 text-white/40 text-sm font-medium">O CONTINÚA CON</span>
                    <div className="flex-1 h-px bg-white/10"></div>
                </div>

                <SocialLogin onSocialLogin={onSocialLogin} isLoading={isLoading} />
                
                <p className="text-center text-white/40 text-sm mt-8">
                    Al continuar, aceptas nuestros Términos y Servicios
                </p>
            </Tabs>
        </div>
    </div>
  )
}
