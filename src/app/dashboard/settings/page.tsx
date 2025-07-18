
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { User, Bell, Shield, Settings2, Mail, MessageSquare } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";


const NotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-base font-semibold mb-4">Recordatorios de Citas</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground mt-1" />
              <div>
                <Label htmlFor="email-notifications" className="font-semibold">Notificaciones por Correo Electrónico</Label>
                <p className="text-sm text-muted-foreground">Recibir recordatorios de citas por correo electrónico.</p>
              </div>
            </div>
            <Switch id="email-notifications" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
             <div className="flex items-start gap-3">
              <MessageSquare className="h-5 w-5 text-muted-foreground mt-1" />
              <div>
                <Label htmlFor="whatsapp-notifications" className="font-semibold">Notificaciones de WhatsApp</Label>
                <p className="text-sm text-muted-foreground">Recibir recordatorios por WhatsApp.</p>
              </div>
            </div>
            <Switch id="whatsapp-notifications" />
          </div>
        </div>
      </div>
      <Separator />
       <div>
        <h4 className="text-base font-semibold mb-4">Temporización de Recordatorios</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first-reminder">Primer Recordatorio</Label>
             <Select defaultValue="24h">
              <SelectTrigger id="first-reminder">
                <SelectValue placeholder="Seleccionar..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1 hora antes</SelectItem>
                <SelectItem value="12h">12 horas antes</SelectItem>
                <SelectItem value="24h">24 horas antes</SelectItem>
                 <SelectItem value="48h">48 horas antes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="second-reminder">Segundo Recordatorio</Label>
            <Select defaultValue="1h">
              <SelectTrigger id="second-reminder">
                <SelectValue placeholder="Seleccionar..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Ninguno</SelectItem>
                <SelectItem value="1h">1 hora antes</SelectItem>
                <SelectItem value="2h">2 horas antes</SelectItem>
                <SelectItem value="3h">3 horas antes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
);


const settingsItems = [
  {
    icon: User,
    title: "Configuración del Perfil",
    description: "Administra tu información personal",
    content: "Aquí puedes gestionar la configuración de tu perfil.",
  },
  {
    icon: Bell,
    title: "Notificaciones",
    description: "Configura las preferencias de recordatorios y alertas",
    content: <NotificationSettings />,
  },
  {
    icon: Shield,
    title: "Seguridad",
    description: "Gestiona la configuración de seguridad de tu cuenta",
    content: "Aquí puedes gestionar la configuración de seguridad.",
  },
  {
    icon: Settings2,
    title: "Configuración de la Clínica",
    description: "Configura la información y preferencias de la clínica",
    content: "Aquí puedes gestionar la configuración de tu clínica.",
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
