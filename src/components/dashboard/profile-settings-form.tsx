
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Loader2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { getUserProfile, updateUserProfile } from "@/lib/firebase";
import type { UserProfile } from "@/lib/types";

const profileSchema = z.object({
  fullName: z.string().min(1, "El nombre completo es requerido."),
  email: z.string().email("Correo electrónico inválido."),
  phone: z.string().optional(),
  licenseNumber: z.string().optional(),
  specialization: z.string().optional(),
  photoURL: z.string().url({ message: "Por favor, introduce una URL válida." }).optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileSettingsFormProps {
  onSuccess?: () => void;
}

export function ProfileSettingsForm({ onSuccess }: ProfileSettingsFormProps) {
  const { user, db } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      licenseNumber: "",
      specialization: "",
      photoURL: "",
    },
  });

  const photoUrlValue = form.watch("photoURL");

  useEffect(() => {
    async function loadProfile() {
      if (!user || !db) return;
      setIsFetching(true);
      try {
        const profile = await getUserProfile(db, user.uid);
        const initialValues = {
          fullName: profile?.fullName || user.displayName || "",
          email: profile?.email || user.email || "",
          phone: profile?.phone || "",
          licenseNumber: profile?.licenseNumber || "",
          specialization: profile?.specialization || "",
          photoURL: profile?.photoURL || user.photoURL || "",
        };
        form.reset(initialValues);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          variant: "destructive",
          title: "Error al cargar el perfil",
          description: "No se pudieron obtener los datos de tu perfil.",
        });
      } finally {
        setIsFetching(false);
      }
    }
    loadProfile();
  }, [user, db, form, toast]);


  async function onSubmit(data: ProfileFormValues) {
    if (!user || !db) return;
    setIsLoading(true);
    try {
      await updateUserProfile(user, db, data);
      toast({
        title: "Perfil actualizado",
        description: "Tu información se ha guardado correctamente.",
      });
      // Force a reload of the user object to get the new photoURL
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
             <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                    <AvatarImage src={photoUrlValue || undefined} alt="User avatar" />
                    <AvatarFallback className="text-2xl">
                    {getInitials(form.getValues("fullName") || "U")}
                    </AvatarFallback>
                </Avatar>
                <div className="w-full">
                     <FormField
                      control={form.control}
                      name="photoURL"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL de la Foto de Perfil</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/photo.jpg" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
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
            <FormField
              control={form.control}
              name="licenseNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Licencia</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="specialization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Especialización</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una especialización" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="clinical_psychology">
                        Psicología Clínica
                      </SelectItem>
                      <SelectItem value="cognitive_behavioral">
                        Terapia Cognitivo-Conductual
                      </SelectItem>
                      <SelectItem value="psychoanalysis">
                        Psicoanálisis
                      </SelectItem>
                      <SelectItem value="humanistic_psychology">
                        Psicología Humanista
                      </SelectItem>
                    </SelectContent>
                  </Select>
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
