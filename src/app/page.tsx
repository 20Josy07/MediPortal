
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  FilePenLine,
  Bell,
  LayoutGrid,
  CalendarDays,
  UserPlus,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ThemeToggle } from "@/components/theme-toggle";
import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";

const rotatingWords = ["estructurada.", "organizada.", "eficiente."];

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % rotatingWords.length);
    }, 3000); // Change word every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="flex flex-col items-center justify-center text-center bg-[#f1f5f6] dark:bg-background min-h-[80vh] px-4">
      <div className="z-10 flex flex-col items-center">
        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tighter text-foreground">
          Tu práctica,
          <br />
          <span key={currentIndex} className="text-primary animate-fade-in-up">
            {rotatingWords[currentIndex]}
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg md:text-xl text-foreground/80">
          Menos carga administrativa. Más presencia terapéutica. Recupera hasta 8 horas a la semana y dedícalas a lo que amas.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Button asChild size="lg">
            <Link href="/signup">Crear cuenta</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="#features">Ver funcionalidades</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};


const advantages = [
  {
    icon: <FilePenLine className="w-7 h-7 text-primary" />,
    title: "Automatización total de notas",
    description: "Genera tu documentación clínica mientras tú descansas.",
    image:
      "https://firebasestorage.googleapis.com/v0/b/alumbra-landing-page.firebasestorage.app/o/Automatizacion.png?alt=media&token=b6cc67d2-70a1-4df4-a6f8-b10d44c11758",
    hint: "automated documents",
  },
  {
    icon: <Bell className="w-7 h-7 text-primary" />,
    title: "Alertas y recordatorios automáticos",
    description: "Nunca pierdas una próxima sesión ni una tarea pendiente.",
    image:
      "https://firebasestorage.googleapis.com/v0/b/alumbra-landing-page.firebasestorage.app/o/Recordatorios%20(1).png?alt=media&token=8c286b40-2581-4d94-bcf7-993e7feeabb2",
    hint: "automatic alerts",
  },
  {
    icon: <LayoutGrid className="w-7 h-7 text-primary" />,
    title: "Dashboard de pacientes",
    description:
      "Visualiza estado, próximas citas y puntos clave de un vistazo.",
    image:
      "https://firebasestorage.googleapis.com/v0/b/alumbra-landing-page.firebasestorage.app/o/Dashboard%20(2).png?alt=media&token=7233384d-f95b-40e3-89fc-d9be22a0b482",
    hint: "patient dashboard",
  },
  {
    icon: <CalendarDays className="w-7 h-7 text-primary" />,
    title: "Integración con calendario",
    description:
      "Sincroniza Google Calendar, Outlook u otras herramientas en un clic.",
    image:
      "https://firebasestorage.googleapis.com/v0/b/alumbra-landing-page.firebasestorage.app/o/integracion%20calendario%20(1).png?alt=media&token=4e401a92-e2bc-483b-b861-25a2ef993087",
    hint: "calendar integration",
  },
];

const howItWorksSteps = [
  {
    number: 1,
    icon: <UserPlus className="h-8 w-8 text-primary" />,
    title: "Crea tu cuenta en minutos",
    description: "Regístrate de forma rápida y segura. Sin complicaciones.",
  },
  {
    number: 2,
    icon: <UserPlus className="h-8 w-8 text-primary" />,
    title: "Añade tus pacientes",
    description:
      "Crea perfiles con su historial, evolución y notas clínicas centralizadas.",
  },
  {
    number: 3,
    icon: <FilePenLine className="h-8 w-8 text-primary" />,
    title: "Configura tus plantillas",
    description:
      "Elige entre formatos como SOAP o DAP y personalízalos según tu estilo clínico.",
  },
  {
    number: 4,
    icon: <Sparkles className="h-8 w-8 text-primary" />,
    title: "Inicia tus sesiones",
    description: "Deja que Zenda genere notas e insights automáticamente.",
  },
];

const LandingHeader = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const logoSrc = mounted && resolvedTheme === "light"
      ? "https://i.postimg.cc/HntBCkhT/Logo-Zenda-Light.png"
      : "https://i.postimg.cc/BbB1NZZF/replicate-prediction-h8nxevgngdrge0cr5vb92hqb80.png";


  return (
    <header className="sticky top-0 z-50 flex h-[72px] w-full items-center border-b border-border bg-background/95 backdrop-blur-sm px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between">
        {/* Left Side */}
        <Link href="/" aria-label="Zenda Home" className="flex items-center gap-2">
          <Image
            alt="Zenda Logo"
            width={36}
            height={36}
            src={logoSrc}
            key={logoSrc}
          />
           <span className="font-bold text-xl text-foreground">ZENDA</span>
        </Link>

        {/* Right Side */}
        <nav className="flex items-center gap-4 md:gap-5">
          <ThemeToggle />
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "link" }),
              "hidden px-0 text-foreground hover:text-primary sm:inline-flex"
            )}
          >
            Iniciar sesión
          </Link>
          <Button asChild>
            <Link href="/signup">Crear cuenta</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};


export default function Home() {
  const [mounted, setMounted] = useState(false);
  const autoplayPlugin = useRef<any>(null);

  useEffect(() => {
    setMounted(true);
    // Crea el plugin solo en cliente para evitar diferencias SSR/cliente
    autoplayPlugin.current = Autoplay({
      delay: 5000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <LandingHeader />

      <main className="flex-grow">
        
        <HeroSection />

        <section id="features" className="py-20 md:py-28 bg-secondary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-headline text-4xl md:text-5xl font-bold text-foreground">
                Ventajas que notarás desde el primer día
              </h2>
            </div>

            <Carousel
              className="w-full max-w-6xl mx-auto"
              opts={{ loop: true }}
              plugins={
                mounted && autoplayPlugin.current ? [autoplayPlugin.current] : []
              }
              onMouseEnter={() => autoplayPlugin.current?.stop()}
              onMouseLeave={() => autoplayPlugin.current?.reset()}
            >
              <CarouselContent>
                {advantages.map((advantage, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1 h-full">
                      <Card className="h-full flex flex-col group overflow-hidden bg-card border shadow-lg hover:shadow-2xl transition-shadow duration-300">
                        <CardContent className="flex flex-col items-center text-center p-6 flex-grow">
                          <div className="relative aspect-[16/10] w-full mb-6">
                            <Image
                              src={advantage.image}
                              alt={advantage.title}
                              fill
                              className="relative rounded-lg shadow-inner object-cover"
                              data-ai-hint={advantage.hint}
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          </div>
                          <div className="bg-primary/10 text-primary rounded-lg p-3 inline-block mb-4">
                            {advantage.icon}
                          </div>
                          <h3 className="font-headline text-2xl font-bold text-foreground mb-2">
                            {advantage.title}
                          </h3>
                          <p className="text-muted-foreground flex-grow">
                            {advantage.description}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex h-12 w-12 -left-16 bg-card hover:bg-card/90 border-2" />
              <CarouselNext className="hidden sm:flex h-12 w-12 -right-16 bg-card hover:bg-card/90 border-2" />
            </Carousel>
          </div>
        </section>

        <section className="how-it-works-section" id="how-it-works-steps">
          <h2 className="how-it-works-title">¿Cómo funciona?</h2>
          <p className="how-it-works-subtitle">
            Empieza a potenciar tus sesiones en cuatro simples pasos.
          </p>
          <div className="steps-container">
            {howItWorksSteps.map((step) => (
              <div key={step.number} className="step-card">
                <div className="step-icon-container">
                  <div className="step-icon-background">{step.icon}</div>
                  <div className="step-number">{step.number}</div>
                </div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="bg-background border-t border-border">
          <div className="container mx-auto py-12 px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
              <div>
                <h3 className="font-bold text-lg mb-4 text-foreground">ZENDA</h3>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto md:mx-0">
                  Impulsa tu práctica psicológica. Centraliza notas, seguimientos y patrones clínicos.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-4 text-foreground">Producto</h3>
                <ul className="space-y-2">
                  <li><Link href="#how-it-works-steps" className="text-sm text-muted-foreground hover:text-primary">¿Cómo funciona?</Link></li>
                  <li><Link href="#features" className="text-sm text-muted-foreground hover:text-primary">Funcionalidades</Link></li>
                  <li><Link href="/dashboard/support/chat" className="text-sm text-muted-foreground hover:text-primary">FAQ</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-4 text-foreground">Contacto</h3>
                <ul className="space-y-2">
                  <li><a href="mailto:hola@zenda.ai" className="text-sm text-muted-foreground hover:text-primary">hola@zenda.ai</a></li>
                  <li><a href="/terms" className="text-sm text-muted-foreground hover:text-primary">Términos y Condiciones</a></li>
                  <li><a href="/privacy" className="text-sm text-muted-foreground hover:text-primary">Política de privacidad</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-12 text-center text-xs text-muted-foreground">
              <p>&copy; {new Date().getFullYear()} Zenda. Todos los derechos reservados.</p>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}
