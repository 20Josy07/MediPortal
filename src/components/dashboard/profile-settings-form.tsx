
"use client";

import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Loader2, Upload, Settings, KeyRound, Clock, ShieldCheck, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { updateUserProfile } from "@/lib/firebase";
import type { UserProfile } from "@/lib/types";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { cn } from "@/lib/utils";


const profileSchema = z.object({
  fullName: z.string().min(1, "El nombre completo es requerido."),
  email: z.string().email("Correo electrónico inválido."),
  phone: z.string().optional(),
  photoURL: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileSettingsFormProps {
  onSuccess?: () => void;
}

export function ProfileSettingsForm({ onSuccess }: ProfileSettingsFormProps) {
  const { user, userProfile, db } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      photoURL: "",
    },
  });

  const photoUrlValue = form.watch("photoURL");

  useEffect(() => {
    if (user || userProfile) {
      setIsFetching(true);
      const initialValues = {
        fullName: userProfile?.fullName || user?.displayName || "",
        email: userProfile?.email || user?.email || "",
        phone: userProfile?.phone || "",
        photoURL: userProfile?.photoURL || user?.photoURL || "",
      };
      form.reset(initialValues);
      setIsFetching(false);
    }
  }, [user, userProfile, form]);


  async function onSubmit(data: ProfileFormValues) {
    if (!user || !db) return;
    setIsLoading(true);
    try {
      await updateUserProfile(user, db, data);
      toast({
        title: "Perfil actualizado",
        description: "Tu información se ha guardado correctamente.",
      });
      await user.reload();
      onSuccess?.();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Error al guardar",
        description: "No se pudo actualizar tu perfil.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({
          variant: "destructive",
          title: "Archivo demasiado grande",
          description: "Por favor, selecciona una imagen de menos de 2MB.",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue("photoURL", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0][0] + names[names.length - 1][0];
    }
    return name.substring(0, 2);
  };

  return (
    <Card className="border-0 shadow-none">
       {isFetching ? (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        ) : (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CardHeader className="p-0">
              <div className="flex items-center gap-4">
                  <User className="h-6 w-6 text-muted-foreground" />
                  <div>
                  <CardTitle className="text-lg">Configuración del Perfil</CardTitle>
                  <CardDescription>Maneja tu información personal</CardDescription>
                  </div>
              </div>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                    <AvatarImage src={photoUrlValue || undefined} alt="User avatar" />
                    <AvatarFallback className="text-3xl">
                    {getInitials(form.getValues("fullName") || "U")}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-2">
                     <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="mr-2 h-4 w-4" />
                        Cambiar Foto
                     </Button>
                     <p className="text-xs text-muted-foreground">JPG, PNG, GIF. Máximo 2MB.</p>
                     <input 
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/png, image/jpeg, image/gif"
                      />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre Completo</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                        <FormLabel>Correo Electrónico</FormLabel>
                        <FormControl>
                            <Input {...field} disabled />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
            </div>
           
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Guardar Cambios de Perfil
                </Button>
            </div>
          </CardContent>

          <Separator />
          
          <div className="space-y-6">
             <CardHeader className="p-0">
              <div className="flex items-center gap-4">
                  <Settings className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <CardTitle className="text-lg">Configuración de cuenta</CardTitle>
                    <CardDescription>Maneja la seguridad y preferencias de tu cuenta.</CardDescription>
                  </div>
              </div>
            </CardHeader>

            <CardContent className="p-0 space-y-4">
              <Collapsible open={isPasswordOpen} onOpenChange={setIsPasswordOpen}>
                <CollapsibleTrigger asChild>
                  <button className="flex justify-between items-center w-full text-left p-3 border rounded-md hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <KeyRound className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-semibold">Cambiar contraseña</p>
                      </div>
                    </div>
                    <ChevronDown className={cn("h-5 w-5 transition-transform", isPasswordOpen && "rotate-180")} />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4 border border-t-0 rounded-b-md space-y-4">
                    <FormItem>
                      <FormLabel>Contraseña Actual</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" />
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormLabel>Nueva Contraseña</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" />
                      </FormControl>
                    </FormItem>
                </CollapsibleContent>
              </Collapsible>

              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">Zona horaria</p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">GMT-5 Colombia</span>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">Doble autenticación</p>
                  </div>
                </div>
                <Switch id="2fa-switch" />
              </div>
            </CardContent>
          </div>
          
           <div className="flex justify-end pt-4">
              <Button type="button" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Guardar Configuración
              </Button>
            </div>
        </form>
      </Form>
      )}
    </Card>
  );
}
