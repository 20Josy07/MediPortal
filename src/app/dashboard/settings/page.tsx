
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { User, Bell, Shield, Settings2, CreditCard, Puzzle, KeyRound, Eye, Smartphone, Calendar, Video, MessageSquare, Mail, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { deleteUserAccount } from "@/lib/firebase";


const NotificationSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-3">
            <Bell className="h-5 w-5 text-muted-foreground mt-1" />
            <div>
            <Label htmlFor="reminders-switch" className="font-semibold">Activar/desactivar recordatorios</Label>
            <p className="text-sm text-muted-foreground">Controla todos los recordatorios de citas.</p>
            </div>
        </div>
        <Switch id="reminders-switch" defaultChecked />
      </div>
      <Separator />
      <div>
        <h4 className="text-base font-semibold mb-4">Canal Preferido</h4>
        <RadioGroup defaultValue="email" className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="email" />
                <Label htmlFor="email" className="flex items-center gap-2"><Mail className="h-4 w-4" /> Correo Electrónico</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="whatsapp" id="whatsapp" />
                <Label htmlFor="whatsapp" className="flex items-center gap-2"><MessageSquare className="h-4 w-4" /> WhatsApp</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="sms" id="sms" />
                <Label htmlFor="sms" className="flex items-center gap-2">📱 SMS</Label>
            </div>
        </RadioGroup>
      </div>
       <Separator />
       <div>
        <h4 className="text-base font-semibold mb-4">Frecuencia</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
             <Select defaultValue="24h">
              <SelectTrigger id="frequency">
                <SelectValue placeholder="Seleccionar..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">1 día antes</SelectItem>
                <SelectItem value="1h">1 hora antes</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <Separator />
      <div>
        <h4 className="text-base font-semibold mb-4">Notificar a</h4>
        <RadioGroup defaultValue="both" className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="patient" id="patient" />
                <Label htmlFor="patient">Solo al paciente</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="me" id="me" />
                <Label htmlFor="me">Solo a mí</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="both" id="both" />
                <Label htmlFor="both">A ambos</Label>
            </div>
        </RadioGroup>
      </div>
    </div>
);


const IntegrationSettings = () => (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <Label htmlFor="google-calendar-switch" className="font-semibold">Google Calendar</Label>
            </div>
            <Switch id="google-calendar-switch" />
        </div>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Video className="h-5 w-5 text-muted-foreground" />
                <Label htmlFor="zoom-meet-switch" className="font-semibold">Zoom / Meet</Label>
            </div>
            <Switch id="zoom-meet-switch" />
        </div>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                <Label htmlFor="whatsapp-switch" className="font-semibold">WhatsApp</Label>
            </div>
            <Switch id="whatsapp-switch" />
        </div>
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <Label htmlFor="payments-switch" className="font-semibold">Pasarela de Pagos</Label>
            </div>
            <Switch id="payments-switch" />
        </div>
    </div>
);

const settingsItems = [
  {
    icon: Bell,
    title: "Notificaciones",
    description: "Ajusta cómo y cuándo recibes recordatorios.",
    content: <NotificationSettings />,
  },
  {
    icon: Puzzle,
    title: "Integraciones",
    description: "Conecta tus herramientas favoritas.",
    content: <IntegrationSettings />,
  },
];

export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground mt-1">
          Configura tu cuenta y las preferencias de la aplicación
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {settingsItems.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg bg-card">
            <AccordionTrigger className="p-6 hover:no-underline">
              <div className="flex items-center gap-4">
                <item.icon className="h-5 w-5 text-muted-foreground" />
                <div className="text-left">
                  <p className="font-semibold text-base">{item.title}</p>
                  <p className="text-sm text-muted-foreground font-normal">{item.description}</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-6 pt-0">
                {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="flex justify-end">
        <Button>Guardar Cambios</Button>
      </div>
    </div>
  );
}
