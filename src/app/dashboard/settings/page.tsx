
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { User, Bell, Shield, Settings2 } from "lucide-react";

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
    content: "Aquí puedes gestionar tus preferencias de notificaciones.",
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
