
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  FilePenLine,
  UserPlus,
  Sparkles,
  CalendarDays,
  Bot,
  LayoutGrid,
  FileText,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const RotatingWords = ({ words }: { words: string[] }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const wordInterval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 2500); // Time each word is displayed

    return () => clearInterval(wordInterval);
  }, [words.length]);

  return (
    <span className="inline-block relative w-full text-center h-20">
      {words.map((word, i) => (
        <span
          key={word}
          className={cn(
            "absolute inset-0 transition-opacity duration-300",
            i === index ? "opacity-100" : "opacity-0"
          )}
        >
          {word}
        </span>
      ))}
    </span>
  );
};

const HeroSection = () => {
  return (
    <section className="flex flex-col items-center justify-center text-center bg-secondary min-h-[80vh] px-4 py-16">
      <div className="z-10 flex flex-col max-w-4xl mx-auto items-center">
        <div className="max-w-md">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tighter">
                <span className="text-foreground">Tu práctica,</span>
                <br />
                <span className="text-primary">
                    <RotatingWords words={["eficiente.", "organizada.", "estructurada."]} />
                </span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-foreground/80 max-w-lg mx-auto">
                Menos carga administrativa. Más presencia terapéutica. Recupera horas en tu semana y dedícalas a lo que amas.
            </p>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center w-full max-w-md">
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
  <div className="z-10 w-full h-full p-4 flex flex-col gap-2.5">
    <div className="grid grid-cols-5 gap-2">
      {['L', 'M', 'M', 'J', 'V'].map((day, index) => (
        <div key={`${day}-${index}`} className="text-center text-xs font-bold text-muted-foreground">{day}</div>
      ))}
    </div>
    <div className="relative flex-grow grid grid-cols-5 grid-rows-4 gap-1.5">
      {/* Evento 1 */}
      <div className="absolute top-[10%] left-[2%] w-[38%] h-6 bg-primary/70 rounded-md"></div>
      {/* Evento 2 */}
      <div className="absolute top-[35%] left-[42%] w-[56%] h-6 bg-accent/70 rounded-md"></div>
      {/* Evento 3 */}
      <div className="absolute top-[60%] left-[22%] w-[36%] h-6 bg-primary/70 rounded-md"></div>
    </div>
  </div>
);


const NotasClinicas = () => (
    <div className="z-10 w-full h-full flex flex-col justify-center gap-2.5 relative p-4">
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
  <div className="z-10 w-full h-full flex flex-col justify-end p-4">
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
    <section id="features" className="features-section bg-background">
        <div className="features-section-container">
            <h2 className="features-section-title">Todo lo que necesitas, en un solo lugar</h2>
            <p className="features-section-subtitle">Zenda centraliza tus herramientas para que te enfoques en tus pacientes.</p>
            <div className="mt-16 space-y-16">
              {features.map((feature, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 items-center">
                    {/* Columna de Texto */}
                    <div className={"flex flex-col items-start text-left"}>
                        <div className="feature-icon-wrapper">
                            <feature.icon className="w-7 h-7" />
                        </div>
                        <h3 className="feature-title mt-4">{feature.title}</h3>
                        <p className="feature-description mt-2">{feature.description}</p>
                    </div>

                    {/* Columna de Ilustración */}
                    <div className={"flex justify-center"}>
                        <div className="animated-tile aspect-[4/3] w-full max-w-[400px]">
                           {feature.tile}
                        </div>
                    </div>
                </div>
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


const benefits = [
  {
    icon: FileText,
    title: "Notas listas en minutos",
    description: "Transcribe tus audios y parte de un borrador (SOAP/DAP) para editar y guardar sin empezar de cero."
  },
  {
    icon: LayoutGrid,
    title: "Todo centralizado",
    description: "Pacientes, sesiones y notas en un solo lugar. Encuentra lo que necesitas en segundos."
  },
  {
    icon: Sparkles,
    title: "Flujo simple, menos clics",
    description: "Plantillas, atajos y guardado automático para reducir tareas repetitivas y enfocarte en la sesión."
  }
];

const BenefitsSection = () => (
  <section className="py-20 md:py-28 bg-background border-t border-b border-border">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground">
          Todo en orden, sin esfuerzo.
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Pacientes, sesiones y notas en un solo lugar.
        </p>
      </div>
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {benefits.map((benefit, index) => (
          <div key={index} className="rounded-xl bg-card border border-border p-8 shadow-sm flex flex-col items-center text-center">
            <div className="bg-primary/10 text-primary rounded-lg p-3 inline-block mb-6">
              <benefit.icon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">{benefit.title}</h3>
            <p className="text-base text-muted-foreground flex-grow">{benefit.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

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

        <BenefitsSection />

        <footer className="bg-background">
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
                  <li><a href="mailto:contacto@zendapsi.com" className="text-sm text-muted-foreground hover:text-primary">contacto@zendapsi.com</a></li>
                  <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">Términos y Condiciones</Link></li>
                  <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">Política de privacidad</Link></li>
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
