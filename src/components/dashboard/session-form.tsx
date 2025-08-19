
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, addMinutes, areIntervalsOverlapping } from "date-fns";
import { es } from "date-fns/locale";
import type { Patient, Session } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Bell, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";
import { sendReminder } from "@/ai/flows/send-reminders-flow";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import { useSession } from "next-auth/react";
import { createCalendarEvent } from "@/app/auth/googlecalendarservices";

const formSchema = z.object({
  patientId: z.string().min(1, { message: "Debes seleccionar un paciente." }),
  date: z.date({
    required_error: "La fecha de la sesión es obligatoria.",
  }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Introduce una hora válida en formato HH:mm.",
  }),
  duration: z.string().min(1, { message: "La duración es obligatoria." }),
  customDuration: z.number().optional(),
  type: z.enum(["Individual", "Pareja", "Familiar"]),
  status: z.enum(["Confirmada", "Pendiente", "Cancelada", "No asistió"]),
  remindPsychologist: z.boolean(),
  remindPatient: z.boolean(),
  syncGoogleCalendar: z.boolean(),
});

type SessionFormValues = z.infer<typeof formSchema>;

interface SessionFormProps {
  session?: Session | null;
  patients: Patient[];
  sessions: Session[];
  onSubmit: (data: Omit<Session, "id">) => void;
  onCancel: () => void;
  initialDate?: Date;
}

export function SessionForm({
  session,
  patients,
  sessions,
  onSubmit,
  onCancel,
  initialDate,
}: SessionFormProps) {
  const { toast } = useToast();
  const { user, userProfile } = useAuth();
  const { data: nextAuthSession } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<SessionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: session?.patientId || "",
      date: session?.date || initialDate || new Date(),
      time: session ? format(session.date, "HH:mm") : "09:00",
      duration: session?.duration ? String(session.duration) : "45",
      customDuration: (session?.duration && ![30, 45, 60, 90].includes(session.duration) ? session.duration : undefined) || 0,
      type: session?.type || "Individual",
      status: session?.status || "Pendiente",
      remindPsychologist: session?.remindPsychologist ?? true,
      remindPatient: session?.remindPatient ?? true,
      syncGoogleCalendar: true,
    },
  });

  const durationValue = form.watch("duration");
  const timeValue = form.watch("time");
  const dateValue = form.watch("date");
  const customDurationValue = form.watch("customDuration");
  
  const getEndTime = () => {
    const [hours, minutes] = timeValue.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) return "";
    
    const startDate = new Date(dateValue);
    startDate.setHours(hours, minutes);

    const durationInMinutes = durationValue === "custom" 
        ? (customDurationValue || 0) 
        : parseInt(durationValue, 10);
    
    if (isNaN(durationInMinutes)) return "";
        
    const endDate = addMinutes(startDate, durationInMinutes);
    return format(endDate, "p", { locale: es });
  };
  
  useEffect(() => {
    if(session?.duration && ![30, 45, 60, 90].includes(session.duration)) {
      form.setValue("duration", "custom");
    }
  }, [session, form]);

  async function handleSubmit(values: SessionFormValues) {
    setIsSubmitting(true);
    try {
        const [hours, minutes] = values.time.split(":").map(Number);
        const combinedDateTime = new Date(values.date);
        combinedDateTime.setHours(hours, minutes, 0, 0);

        const durationInMinutes = values.duration === "custom" ? (values.customDuration || 0) : parseInt(values.duration, 10);
        const endDate = addMinutes(combinedDateTime, durationInMinutes);
        
        const newSessionInterval = { start: combinedDateTime, end: endDate };

        const hasOverlap = sessions.some(existingSession => {
        if (session && existingSession.id === session.id) {
            return false;
        }
        const existingSessionInterval = { start: existingSession.date, end: existingSession.endDate };
        return areIntervalsOverlapping(newSessionInterval, existingSessionInterval, { inclusive: false });
        });

        if (hasOverlap) {
            form.setError("time", {
                type: "manual",
                message: "Esta cita se solapa con otra. Ajusta duración o cambia la hora."
            });
            setIsSubmitting(false);
            return;
        }

        const selectedPatient = patients.find((p) => p.id === values.patientId);

        if (!selectedPatient) {
            form.setError("patientId", { message: "Paciente no encontrado." });
            setIsSubmitting(false);
            return;
        }

        if (values.syncGoogleCalendar) {
          const accessToken = (nextAuthSession as any)?.accessToken;
            if (!accessToken) {
                toast({
                    variant: "destructive",
                    title: "No vinculado a Google Calendar",
                    description: "Para sincronizar, primero vincula tu cuenta de Google desde el calendario."
                });
            } else {
                 try {
                    await createCalendarEvent(accessToken, {
                        summary: `Sesión con ${selectedPatient.name}`,
                        description: `Sesión de terapia ${values.type}.`,
                        start: {
                            dateTime: combinedDateTime.toISOString(),
                            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                        },
                        end: {
                            dateTime: endDate.toISOString(),
                            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                        },
                        attendees: [{ email: selectedPatient.email }],
                    });

                    toast({ title: "Evento creado en Google Calendar." });
                } catch (googleError: any) {
                    console.error('Error al sincronizar con Google Calendar:', googleError);
                    toast({
                        variant: "destructive",
                        title: "Error al sincronizar con Google Calendar",
                        description: googleError.message || "La sesión se guardará localmente pero no se pudo sincronizar. Intenta vincular tu cuenta de nuevo."
                    });
                }
            }
        }
        
        const sessionData: Omit<Session, "id"> = {
            patientId: values.patientId,
            patientName: selectedPatient.name,
            date: combinedDateTime,
            endDate: endDate,
            duration: durationInMinutes,
            type: values.type,
            status: values.status,
            remindPatient: values.remindPatient,
            remindPsychologist: values.remindPsychologist,
        };
        
        if (values.remindPatient || values.remindPsychologist) {
            try {
            await sendReminder({
                patientName: selectedPatient.name,
                patientEmail: selectedPatient.email,
                patientPhone: selectedPatient.phone,
                sessionDate: combinedDateTime.toISOString(),
                reminderType: values.remindPatient && values.remindPsychologist 
                ? 'both' 
                : values.remindPatient 
                    ? 'patient' 
                    : 'psychologist',
            });
            toast({ title: "Recordatorios programados." });
            } catch (e) {
                console.error(e);
                toast({ 
                    variant: "destructive", 
                    title: "Error al programar recordatorios",
                    description: "La sesión se guardará pero los recordatorios no se pudieron programar."
                });
            }
        }
        
        onSubmit(sessionData);
        
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        toast({
            variant: "destructive",
            title: "Error al procesar la solicitud",
            description: "Ocurrió un error inesperado. Por favor, inténtalo de nuevo."
        });
    } finally {
        setIsSubmitting(false);
    }
  }
    

  return (
    <div className="max-h-[80vh] overflow-y-auto px-6 py-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="patientId"
            render={({ field }) => (
              <FormItem>
              <FormLabel>Paciente</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                  <SelectTrigger>
                      <SelectValue placeholder="Selecciona un paciente" />
                  </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                  {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                      {patient.name}
                      </SelectItem>
                  ))}
                  </SelectContent>
              </Select>
              <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
              <FormItem className="flex flex-col">
                  <FormLabel>Fecha</FormLabel>
                  <Popover>
                  <PopoverTrigger asChild>
                      <FormControl>
                      <Button
                          variant={"outline"}
                          className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                          )}
                      >
                          {field.value ? (
                          format(field.value, "PPP", { locale: es })
                          ) : (
                          <span>Elige una fecha</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                      </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date("1900-01-01")}
                      initialFocus
                      locale={es}
                      />
                  </PopoverContent>
                  </Popover>
                  <FormMessage />
              </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
              <FormItem>
                  <FormLabel>Hora de Inicio</FormLabel>
                  <FormControl>
                  <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
              </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
          <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                  <FormItem>
                      <FormLabel>Duración</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                          <SelectTrigger>
                              <SelectValue placeholder="Selecciona duración" />
                          </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                              <SelectItem value="30">30 minutos</SelectItem>
                              <SelectItem value="45">45 minutos</SelectItem>
                              <SelectItem value="60">60 minutos</SelectItem>
                              <SelectItem value="90">90 minutos</SelectItem>
                              <SelectItem value="custom">Personalizado</SelectItem>
                          </SelectContent>
                      </Select>
                      <FormMessage />
                  </FormItem>
                  )}
              />
              <div>
              <FormLabel>Hora de Fin</FormLabel>
              <Input type="text" value={getEndTime()} disabled className="bg-muted" />
              </div>
          </div>
          {durationValue === 'custom' && (
              <FormField
              control={form.control}
              name="customDuration"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>Duración Personalizada (minutos)</FormLabel>
                  <FormControl>
                      <Input 
                          type="number"
                          placeholder="Ej: 50"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                      />
                  </FormControl>
                  <FormMessage />
                  </FormItem>
              )}
              />
          )}

          <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
              <FormItem>
              <FormLabel>Tipo de Sesión</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                  <SelectTrigger>
                      <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                  <SelectItem value="Individual">Individual</SelectItem>
                  <SelectItem value="Pareja">Pareja</SelectItem>
                  <SelectItem value="Familiar">Familiar</SelectItem>
                  </SelectContent>
              </Select>
              <FormMessage />
              </FormItem>
          )}
          />
          <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
              <FormItem>
              <FormLabel>Estado</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                  <SelectTrigger>
                      <SelectValue placeholder="Selecciona un estado" />
                  </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                  <SelectItem value="Confirmada">Confirmada</SelectItem>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                  <SelectItem value="Cancelada">Cancelada</SelectItem>
                  <SelectItem value="No asistió">No asistió</SelectItem>
                  </SelectContent>
              </Select>
              <FormMessage />
              </FormItem>
          )}
          />

          <Separator className="!my-6"/>
          
           <div className="space-y-4">
              <FormField
                  control={form.control}
                  name="syncGoogleCalendar"
                  render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                              <FormLabel>Sincronizar con Google Calendar</FormLabel>
                               <FormDescription className="text-xs">
                                  Crea un evento en tu calendario principal.
                              </FormDescription>
                          </div>
                          <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} disabled={!(userProfile as any)?.googleTokens} />
                          </FormControl>
                      </FormItem>
                  )}
              />
              <FormField
                  control={form.control}
                  name="remindPatient"
                  render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                              <FormLabel>Recordar a paciente</FormLabel>
                              <FormDescription className="text-xs">
                                  Notificación por WhatsApp.
                              </FormDescription>
                          </div>
                          <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                      </FormItem>
                  )}
              />
          </div>

          <div className="flex justify-end gap-2 pt-6">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Guardando...' : 'Guardar Sesión'}
          </Button>
          </div>
        </form>
      </Form>
    </div>
    );
}
