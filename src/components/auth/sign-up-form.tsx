
"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock, User, Calendar } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SignUpFormProps {
  onSubmit: (e: React.FormEvent) => void
  isLoading: boolean
}

export function SignUpForm({
  onSubmit,
  isLoading,
}: SignUpFormProps) {
    const [showPassword, setShowPassword] = useState(false)
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [birthDate, setBirthDate] = useState("")
    const [gender, setGender] = useState("")

  return (
    <form onSubmit={onSubmit} className="space-y-4">
        {/* Full Name */}
        <div className="relative">
        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
        <Input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="bg-black/20 border border-white/10 rounded-2xl h-14 text-white pl-12"
            placeholder="Nombre completo"
            required
        />
        </div>

        {/* Email */}
        <div className="relative">
        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
        <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-black/20 border border-white/10 rounded-2xl h-14 text-white pl-12"
            placeholder="Correo electrónico"
            required
        />
        </div>

        {/* Username */}
        <div className="relative">
        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
        <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-black/20 border border-white/10 rounded-2xl h-14 text-white pl-12"
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
            className="bg-black/20 border border-white/10 rounded-2xl h-14 text-white pr-12"
            placeholder="Contraseña"
            required
        />
        <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60"
        >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
        </div>

        {/* Birth Date */}
        <div className="relative">
        <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
        <Input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="bg-black/20 border border-white/10 rounded-2xl h-14 text-white pl-12"
            required
        />
        </div>

        {/* Gender */}
        <div className="relative">
        <Select value={gender} onValueChange={setGender}>
            <SelectTrigger className="bg-black/20 border border-white/10 rounded-2xl h-14 text-white">
            <SelectValue placeholder="Seleccionar género" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border border-white/10 rounded-xl text-white">
            <SelectItem value="masculino">Masculino</SelectItem>
            <SelectItem value="femenino">Femenino</SelectItem>
            <SelectItem value="otro">Otro</SelectItem>
            <SelectItem value="prefiero-no-decir">Prefiero no decir</SelectItem>
            </SelectContent>
        </Select>
        </div>

        {/* Create account button */}
        <Button
            type="submit"
            className="w-full bg-white/20 hover:bg-white/30 text-white font-medium rounded-2xl h-14 mt-8"
            disabled={isLoading}
        >
            {isLoading ? "Creando cuenta..." : "Crear cuenta"}
        </Button>
    </form>
  )
}
