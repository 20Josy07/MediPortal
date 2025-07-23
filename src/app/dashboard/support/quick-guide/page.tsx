
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Calendar, NotebookText, LayoutDashboard, Lightbulb } from "lucide-react";

const guideSteps = [
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Paso 1: Registra a tus Pacientes",
    description: "Dirígete a la sección 'Pacientes' en el menú lateral. Haz clic en 'Agregar Paciente' para crear un nuevo perfil. Completa su información personal y de contacto. Desde aquí, podrás ver y gestionar la lista de todos tus pacientes.",
  },
  {
    icon: <Calendar className="h-8 w-8 text-primary" />,
    title: "Paso 2: Agenda tus Sesiones",
    description: "Ve a 'Sesiones' para acceder al calendario. Puedes agendar una nueva cita haciendo clic en el botón 'Agendar' o directamente sobre una fecha. Asigna un paciente, define la duración, el tipo de sesión y configura recordatorios automáticos.",
  },
  {
    icon: <NotebookText className="h-8 w-8 text-primary" />,
    title: "Paso 3: Utiliza las Notas Inteligentes",
    description: "En 'Notas Inteligentes', puedes seleccionar un paciente para empezar. Graba el audio de tu sesión para que la IA lo transcriba, o escribe notas manualmente. También puedes chatear con el asistente de IA para obtener resúmenes y análisis.",
  },
  {
    icon: <LayoutDashboard className="h-8 w-8 text-primary" />,
    title: "Paso 4: Explora tu Dashboard",
    description: "La sección 'Dashboard' te da una vista general de tu práctica. Revisa tus próximas sesiones, un resumen de pacientes activos y otras métricas clave para mantenerte organizado y al día.",
  },
];


export default function QuickGuidePage() {
    return (
        <div className="flex-1 space-y-8">
             <div>
                <h1 className="text-3xl font-bold tracking-tight">Guía Rápida de Zenda</h1>
                <p className="text-muted-foreground mt-1">
                    Un recorrido por las funcionalidades clave para potenciar tu práctica.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {guideSteps.map((step, index) => (
                    <Card key={index} className="flex flex-col">
                        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                           {step.icon}
                           <CardTitle className="text-xl">{step.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                           <p className="text-muted-foreground">{step.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="bg-primary/10 border-primary/20">
                <CardHeader className="flex flex-row items-center gap-4">
                    <Lightbulb className="h-6 w-6 text-primary" />
                    <CardTitle>¿Necesitas más ayuda?</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Si tienes más preguntas, no dudes en consultar nuestra sección de <a href="/dashboard/support/chat" className="font-semibold text-primary hover:underline">Preguntas Frecuentes</a> o contactar a nuestro equipo de soporte.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
