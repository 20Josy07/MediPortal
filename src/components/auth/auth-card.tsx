"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Eye, EyeOff, User, Calendar } from "lucide-react"
import { Checkbox } from "../ui/checkbox"
import Link from "next/link"

interface AuthCardProps {
  isLoading: boolean
  email: string
  setEmail: (email: string) => void
  password: string
  setPassword: (password: string) => void
  rememberMe: boolean
  setRememberMe: (remember: boolean) => void
  fullName: string
  setFullName: (name: string) => void
  username: string
  setUsername: (username: string) => void
  birthDate: string
  setBirthDate: (date: string) => void
  gender: string
  setGender: (gender: string) => void
  onSignIn: (e: React.FormEvent) => void
  onSignUp: (e: React.FormEvent) => void
  onSocialLogin: (provider: string) => void
  onForgotPassword: () => void
}

export function AuthCard({
  isLoading,
  email,
  setEmail,
  password,
  setPassword,
  rememberMe,
  setRememberMe,
  fullName,
  setFullName,
  username,
  setUsername,
  birthDate,
  setBirthDate,
  gender,
  setGender,
  onSignIn,
  onSignUp,
  onSocialLogin,
  onForgotPassword,
}: AuthCardProps) {
  const [activeTab, setActiveTab] = useState("signup")
  const [showPassword, setShowPassword] = useState(false)

  const handleRedirect = () => {
    window.open("https://www.youtube.com/@diecastbydollarall", "_blank")
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-2xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-3xl">
        {/* Header with tabs */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex bg-black/30 backdrop-blur-sm rounded-full p-1 border border-white/10">
            <button
              onClick={() => setActiveTab("signup")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                activeTab === "signup"
                  ? "bg-white/20 backdrop-blur-sm text-white border border-white/20 shadow-lg"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              Registrarse
            </button>
            <button
              onClick={() => setActiveTab("signin")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                activeTab === "signin"
                  ? "bg-white/20 backdrop-blur-sm text-white border border-white/20 shadow-lg"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              Iniciar Sesión
            </button>
          </div>
        </div>

        {/* Titles translated to Spanish */}
        <h1 className="text-3xl font-normal text-white mb-8 transition-all duration-300 text-center">
          {activeTab === "signup" ? "Crear una cuenta" : "Bienvenido de vuelta"}
        </h1>

        <div className="relative overflow-hidden">
          <div
            className={`transition-all duration-500 ease-in-out transform ${
              activeTab === "signup" ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 absolute inset-0"
            }`}
          >
            {/* Signup Form completely renovated with new fields */}
            <form onSubmit={onSignUp} className="space-y-4">
              {/* Full Name */}
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 transition-colors duration-200" />
                <Input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl h-14 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-0 pl-12 text-base transition-all duration-200 hover:bg-black/30 focus:bg-black/30"
                  placeholder="Nombre completo"
                  required
                />
              </div>

              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 transition-colors duration-200" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl h-14 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-0 pl-12 text-base transition-all duration-200 hover:bg-black/30 focus:bg-black/30"
                  placeholder="Correo electrónico"
                  required
                />
              </div>

              {/* Username */}
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 transition-colors duration-200" />
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl h-14 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-0 pl-12 text-base transition-all duration-200 hover:bg-black/30 focus:bg-black/30"
                  placeholder="Nombre de usuario"
                  required
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl h-14 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-0 pr-12 text-base transition-all duration-200 hover:bg-black/30 focus:bg-black/30"
                  placeholder="Contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Birth Date */}
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 transition-colors duration-200" />
                <Input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl h-14 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-0 pl-12 text-base transition-all duration-200 hover:bg-black/30 focus:bg-black/30"
                  required
                />
              </div>

              {/* Gender */}
              <div className="relative">
                <Select value={gender} onValueChange={setGender} required>
                  <SelectTrigger className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl h-14 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-0 text-base transition-all duration-200 hover:bg-black/30 focus:bg-black/30">
                    <SelectValue placeholder="Seleccionar género" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 backdrop-blur-sm border border-white/10 rounded-xl">
                    <SelectItem value="masculino" className="text-white hover:bg-white/10">
                      Masculino
                    </SelectItem>
                    <SelectItem value="femenino" className="text-white hover:bg-white/10">
                      Femenino
                    </SelectItem>
                    <SelectItem value="otro" className="text-white hover:bg-white/10">
                      Otro
                    </SelectItem>
                    <SelectItem value="prefiero-no-decir" className="text-white hover:bg-white/10">
                      Prefiero no decir
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Create account button */}
              <Button
                type="submit"
                className="w-full bg-white/20 backdrop-blur-sm border border-white/20 hover:bg-white/30 text-white font-medium rounded-2xl h-14 mt-8 text-base transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading ? "Creando cuenta..." : "Crear cuenta"}
              </Button>
            </form>
          </div>

          <div
            className={`transition-all duration-500 ease-in-out transform ${
              activeTab === "signin" ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 absolute inset-0"
            }`}
          >
            {/* Signin Form translated */}
            <form onSubmit={onSignIn} className="space-y-4">
              {/* Email field */}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 transition-colors duration-200" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl h-14 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-0 pl-12 text-base transition-all duration-200 hover:bg-black/30 focus:bg-black/30"
                  placeholder="Ingresa tu correo electrónico"
                />
              </div>

              {/* Password field */}
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl h-14 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-0 pr-12 text-base transition-all duration-200 hover:bg-black/30 focus:bg-black/30"
                  placeholder="Ingresa tu contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Remember me and forgot password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                   <Checkbox
                    id="remember-me"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(Boolean(checked))}
                    className="w-4 h-4 rounded border border-white/20 bg-black/20 text-white data-[state=checked]:bg-white/30 data-[state=checked]:border-white/30"
                  />
                  <label htmlFor="remember-me" className="text-white/60 text-sm">Recordarme</label>
                </label>
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-white/60 hover:text-white text-sm transition-colors duration-200"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              {/* Sign in button */}
              <Button
                type="submit"
                className="w-full bg-white/20 backdrop-blur-sm border border-white/20 hover:bg-white/30 text-white font-medium rounded-2xl h-14 mt-8 text-base transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
            </form>
          </div>
        </div>

        {/* Divider translated */}
        <div className="flex items-center my-8">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="px-4 text-white/40 text-sm font-medium">
            O CONTINÚA CON
          </span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => onSocialLogin("google")}
            className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl h-14 px-8 flex items-center justify-center hover:bg-black/30 transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-white font-medium">Google</span>
          </button>
        </div>

        {/* Terms text translated */}
        <p className="text-center text-white/40 text-sm mt-8">
          {activeTab === "signup"
            ? "Al crear una cuenta, aceptas nuestros Términos y Servicios"
            : "Al iniciar sesión, aceptas nuestros Términos y Servicios"}
        </p>
      </div>
    </div>
  )
}
