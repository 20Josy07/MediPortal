
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
import { User, Loader2, Upload } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { updateUserProfile } from "@/lib/firebase";
import type { UserProfile } from "@/lib/types";

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
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
            <User className="h-6 w-6 text-muted-foreground" />
            <div>
            <CardTitle className="text-lg">Configuración del Perfil</CardTitle>
            <CardDescription>Maneja tu información personal</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        {isFetching ? (
            <div className="flex justify-center items-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    Guardar Cambios
                </Button>
            </div>
          </form>
        </Form>
        )}
      </CardContent>
    </Card>
  );
}
