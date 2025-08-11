
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  ArrowRight,
  FileText,
  Folder,
  UserPlus,
  Sparkles,
  FilePenLine,
  Bell,
  LayoutGrid,
  CalendarDays,
  BarChart2,
  X,
  Mail,
  Github,
  Twitter,
  Moon,
  Sun,
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
    icon: <UserPlus className="h-8 w-8 text-[#063C0F] dark:text-primary" />,
    title: "Crea tu cuenta en minutos",
    description: "Regístrate de forma rápida y segura. Sin complicaciones.",
  },
  {
    number: 2,
    icon: <UserPlus className="h-8 w-8 text-[#063C0F] dark:text-primary" />,
    title: "Añade tus pacientes",
    description:
      "Crea perfiles con su historial, evolución y notas clínicas centralizadas.",
  },
  {
    number: 3,
    icon: <FilePenLine className="h-8 w-8 text-[#063C0F] dark:text-primary" />,
    title: "Configura tus plantillas",
    description:
      "Elige entre formatos como SOAP o DAP y personalízalos según tu estilo clínico.",
  },
  {
    number: 4,
    icon: <Sparkles className="h-8 w-8 text-[#063C0F] dark:text-primary" />,
    title: "Inicia tus sesiones",
    description: "Deja que Zenda genere notas e insights automáticamente.",
  },
];

function HeroImage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evita hidratar con valores distintos por tema
  useEffect(() => setMounted(true), []);

  // Logo estable en SSR/primer render; cambia tras montar según tema
  const stableLogo =
    "https://i.postimg.cc/BbB1NZZF/replicate-prediction-h8nxevgngdrge0cr5vb92hqb80.png";
  const themedLogo =
    resolvedTheme === "light"
      ? "https://i.postimg.cc/HntBCkhT/Logo-Zenda-Light.png"
      : "https://i.postimg.cc/BbB1NZZF/replicate-prediction-h8nxevgngdrge0cr5vb92hqb80.png";

  const logoSrc = mounted ? themedLogo : stableLogo;

  return (
    <div className="relative w-full max-w-lg mx-auto flex flex-col items-center justify-center p-8 space-y-8 min-h-[480px]">
      <div className="w-32 h-32">
        <Image
          src={logoSrc}
          alt="Zenda Logo"
          width={128}
          height={128}
          loading="eager"
        />
      </div>
      <ul className="space-y-4 w-full max-w-sm">
        <li className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border shadow-sm">
          <FileText className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">
            Notas automáticas con resúmenes e insights clave
          </span>
        </li>
        <li className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border shadow-sm">
          <BarChart2 className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">
            Visualización de evolución y objetivos terapéuticos
          </span>
        </li>
        <li className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border shadow-sm">
          <Folder className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">
            Historial organizado y fácil de consultar
          </span>
        </li>
      </ul>
    </div>
  );
}

const LandingHeader = () => {
  const { setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 flex h-[72px] w-full items-center border-b border-border bg-background px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between">
        {/* Left Side */}
        <Link href="/" aria-label="Zenda Home">
          <Image
            alt="Zenda Logo"
            loading="lazy"
            width={36}
            height={36}
            src="https://i.postimg.cc/BbB1NZZF/replicate-prediction-h8nxevgngdrge0cr5vb92hqb80.png"
          />
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
        <section className="hero-section bg-hero dark:bg-background">
          <div className="hero-content">
            <div className="tag">
              <span>
                Análisis Clínico • Notas Instantáneas • Seguimiento Visual
              </span>
            </div>
            <h1 className="leading-tighter">
              <span className="text-[#063C0F] dark:text-primary">
                Mejora la<br />
                calidad de tus<br />
                sesiones con
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#2A7F34] to-[#81D486] bg-clip-text text-transparent">
                Zenda
              </span>
            </h1>
            <p>
              Zenda te ayuda a simplificar tu práctica para que puedas enfocarte
              en lo que más importa: tus pacientes
            </p>
            <div className="buttons mt-8">
              <Button
                asChild
                size="lg"
                className="group font-body font-bold w-full sm:w-auto shadow-lg shadow-primary/30 transition-all duration-300 bg-[#357D3D] text-primary-foreground hover:bg-[#357D3D]/90"
              >
                <Link href="/login">
                  Quiero potenciar mis sesiones
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="py-4 px-8 rounded-lg text-base font-bold text-[#063C0F] border-[#063C0F] bg-white dark:text-primary dark:border-primary dark:bg-transparent"
                id="how-it-works-button"
              >
                <Link href="#how-it-works-steps">Ver como funciona</Link>
              </Button>
            </div>
          </div>

          <div className="hero-image">
            <HeroImage />
          </div>
        </section>

        <section id="features" className="py-20 md:py-28 bg-transparent">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-headline text-4xl md:text-5xl font-bold text-foreground">
                Ventajas que notarás desde el primer día
              </h2>
            </div>

            {/* Carousel: plugin solo después de montar */}
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
                          <div className="bg-accent/20 text-accent-foreground rounded-lg p-3 inline-block mb-4">
                            {advantage.icon}
                          </div>
                          <h3 className="font-headline text-2xl font-bold text-foreground mb-2">
                            {advantage.title}
                          </h3>
                          <p className="text-foreground/80 flex-grow">
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
      </main>

      <footer className="bg-background border-t border-border">
        <div className="container mx-auto max-w-[1200px] px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-foreground">
          <div>
            <h3 className="font-bold text-xl mb-4">Zenda</h3>
            <p className="text-muted-foreground">
              Impulsa tu práctica psicológica. Centraliza notas, seguimientos y
              patrones clínicos para enfocarte en lo más importante: tus
              pacientes.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-xl mb-4">Producto</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="#how-it-works-steps" className="hover:text-primary">
                  Cómo funciona
                </Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-primary">
                  Funcionalidades
                </Link>
              </li>
              <li>
                <Link href="/dashboard/support/chat" className="hover:text-primary">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary">
                  Política de privacidad
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-xl mb-4">Contacto</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <a href="mailto:info@zendapsi.com" className="hover:text-primary">
                  info@zendapsi.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Github className="w-5 h-5" />
                <a href="#" className="hover:text-primary">
                  GitHub
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Twitter className="w-5 h-5" />
                <a href="#" className="hover:text-primary">
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

    