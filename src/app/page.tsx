
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  FilePenLine,
  UserPlus,
  Sparkles,
  CalendarDays,
  Bot
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
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
    <section className="flex flex-col items-center justify-center text-center bg-[#EEF2F1] dark:bg-background min-h-[80vh] px-4">
      <div className="z-10 flex flex-col items-center">
        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tighter text-foreground">
          Tu práctica,
          <br />
          <span
            key={currentIndex}
            className="inline-block text-primary animate-rotate-fade-in"
          >
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

const AgendaInteligente = () => (
    <div className="w-full h-full p-4 grid grid-cols-7 grid-rows-5 gap-1.5 z-10">
      {Array.from({ length: 35 }).map((_, i) => (
        <div key={i} className="bg-muted/50 rounded-sm"></div>
      ))}
      <div className="col-start-2 row-start-2 col-span-3 h-1.5 bg-primary/70 rounded-full self-center"></div>
      <div className="col-start-4 row-start-3 col-span-2 h-1.5 bg-accent/70 rounded-full self-center"></div>
      <div className="col-start-3 row-start-4 col-span-3 h-1.5 bg-primary/70 rounded-full self-center"></div>
    </div>
);

const NotasClinicas = () => (
    <div className="w-full h-full flex flex-col justify-center gap-2.5 relative z-10">
        <div className="flex items-center gap-2">
            <div className="feature-icon-wrapper p-2">
                <FilePenLine className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-foreground">Notas de Sesión</span>
        </div>
        <div className="space-y-2.5">
             {['w-[90%]', 'w-[100%]', 'w-[70%]', 'w-[85%]'].map((width, i) => (
                <div key={i} className="h-3 bg-muted rounded-full overflow-hidden">
                   <div className={cn("h-full bg-primary/60 rounded-full animate-fill-in", width)} style={{ animationDelay: `${i * 250}ms` }} ></div>
                </div>
            ))}
            <div className="h-3 w-[40%] bg-muted rounded-full overflow-hidden flex items-center">
                <div className="h-full w-full bg-primary/60 rounded-full animate-fill-in" style={{ animationDelay: '1000ms' }}></div>
                <div className="w-0.5 h-3/5 bg-primary animate-blink ml-0.5"></div>
            </div>
        </div>
    </div>
);

const AsistenteIA = () => (
    <div className="w-full h-full flex flex-col justify-end p-4 z-10">
      <div className="flex items-end justify-around w-full h-4/5">
        <div className="w-1/5 h-[60%] bg-primary/50 rounded-t-lg animate-bar-grow" style={{ animationDelay: '200ms' }}></div>
        <div className="w-1/5 h-[80%] bg-accent/50 rounded-t-lg animate-bar-grow" style={{ animationDelay: '400ms' }}></div>
        <div className="w-1/5 h-[40%] bg-primary/50 rounded-t-lg animate-bar-grow" style={{ animationDelay: '600ms' }}></div>
        <div className="w-1/5 h-[70%] bg-accent/50 rounded-t-lg animate-bar-grow" style={{ animationDelay: '800ms' }}></div>
      </div>
      <div className="w-full h-0.5 bg-muted mt-2"></div>
    </div>
);


const features = [
  {
    icon: CalendarDays,
    title: "Agenda inteligente y centralizada",
    description: "Gestiona todas tus citas en un solo lugar. Sincroniza tu calendario de Google y evita conflictos de horarios.",
    tile: <AgendaInteligente />,
  },
  {
    icon: FilePenLine,
    title: "Notas clínicas, sin esfuerzo",
    description: "Transcripción automática, plantillas SOAP/DAP y resúmenes con IA. Documenta tus sesiones en una fracción del tiempo.",
    tile: <NotasClinicas />,
  },
  {
    icon: Bot,
    title: "Tu asistente clínico con IA",
    description: "Obtén insights, detecta patrones y sigue la evolución de tus pacientes. Zenda te ayuda a ver más allá de las notas.",
    tile: <AsistenteIA />,
  }
];

const FeaturesSection = () => (
    <section id="features" className="features-section">
        <div className="features-section-container">
            <h2 className="features-section-title">Todo lo que necesitas, en un solo lugar</h2>
            <p className="features-section-subtitle">Zenda centraliza tus herramientas para que te enfoques en tus pacientes.</p>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 items-center">
                {features.map((feature, index) => (
                    <React.Fragment key={index}>
                        <div className={cn("feature-text-container", index === 2 && "md:order-2")}>
                            <div className="feature-icon-wrapper">
                                <feature.icon className="w-7 h-7" />
                            </div>
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-description">{feature.description}</p>
                        </div>
                        <div className={cn("flex items-center justify-center", index === 2 && "md:order-1")}>
                           <div className="animated-tile aspect-[1/1] w-full max-w-[400px]">
                             {feature.tile}
                           </div>
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    </section>
);


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
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <LandingHeader />

      <main className="flex-grow">
        
        <HeroSection />

        <FeaturesSection />

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
