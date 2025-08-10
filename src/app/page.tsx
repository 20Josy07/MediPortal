
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, BarChart, Folder, Check, UserPlus, Calendar, Sparkles, FilePenLine, Bell, LayoutGrid, CalendarDays, BarChart2, X, Mail, Github, Twitter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ThemeToggle } from "@/components/theme-toggle";
import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import Autoplay from "embla-carousel-autoplay";

const advantages = [
  {
    icon: <FilePenLine className="w-7 h-7 text-primary" />,
    title: "Automatización total de notas",
    description: "Genera tu documentación clínica mientras tú descansas.",
    image: "https://firebasestorage.googleapis.com/v0/b/alumbra-landing-page.firebasestorage.app/o/Automatizacion.png?alt=media&token=b6cc67d2-70a1-4df4-a6f8-b10d44c11758",
    hint: "automated documents"
  },
  {
    icon: <Bell className="w-7 h-7 text-primary" />,
    title: "Alertas y recordatorios automáticos",
    description: "Nunca pierdas una próxima sesión ni una tarea pendiente.",
    image: "https://firebasestorage.googleapis.com/v0/b/alumbra-landing-page.firebasestorage.app/o/Recordatorios%20(1).png?alt=media&token=8c286b40-2581-4d94-bcf7-993e7feeabb2",
    hint: "automatic alerts"
  },
  {
    icon: <LayoutGrid className="w-7 h-7 text-primary" />,
    title: "Dashboard de pacientes",
    description: "Visualiza estado, próximas citas y puntos clave de un vistazo.",
    image: "https://firebasestorage.googleapis.com/v0/b/alumbra-landing-page.firebasestorage.app/o/Dashboard%20(2).png?alt=media&token=7233384d-f95b-40e3-89fc-d9be22a0b482",
    hint: "patient dashboard"
  },
  {
    icon: <CalendarDays className="w-7 h-7 text-primary" />,
    title: "Integración con calendario",
    description: "Sincroniza Google Calendar, Outlook u otras herramientas en un clic.",
    image: "https://firebasestorage.googleapis.com/v0/b/alumbra-landing-page.firebasestorage.app/o/integracion%20calendario%20(1).png?alt=media&token=4e401a92-e2bc-483b-b861-25a2ef993087",
    hint: "calendar integration"
  }
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
        description: "Crea perfiles con su historial, evolución y notas clínicas centralizadas.",
    },
    {
        number: 3,
        icon: <FilePenLine className="h-8 w-8 text-[#063C0F] dark:text-primary" />,
        title: "Configura tus plantillas",
        description: "Elige entre formatos como SOAP o DAP y personalízalos según tu estilo clínico.",
    },
    {
        number: 4,
        icon: <Sparkles className="h-8 w-8 text-[#063C0F] dark:text-primary" />,
        title: "Inicia tus sesiones",
        description: "Deja que Zenda genere notas e insights automáticamente.",
    }
]

function HeroImage() {
  const { resolvedTheme } = useTheme();
  const [logoSrc, setLogoSrc] = useState("https://i.postimg.cc/BbB1NZZF/replicate-prediction-h8nxevgngdrge0cr5vb92hqb80.png"); // Default to dark

  useEffect(() => {
    setLogoSrc(resolvedTheme === 'dark' 
      ? "https://i.postimg.cc/BbB1NZZF/replicate-prediction-h8nxevgngdrge0cr5vb92hqb80.png" 
      : "https://i.postimg.cc/HntBCkhT/Logo-Zenda-Light.png");
  }, [resolvedTheme]);
  
  return (
    <div className="relative w-full max-w-lg mx-auto flex flex-col items-center justify-center p-8 space-y-8 min-h-[480px]">
      <div>
        <Image
          src={logoSrc}
          alt="Zenda Logo"
          width={128}
          height={128}
          loading="eager"
          key={resolvedTheme}
        />
      </div>
      <ul className="space-y-4 w-full max-w-sm">
          <li className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border shadow-sm">
              <FileText className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Notas automáticas con resúmenes e insights clave</span>
          </li>
          <li className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border shadow-sm">
              <BarChart2 className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Visualización de evolución y objetivos terapéuticos</span>
          </li>
          <li className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border shadow-sm">
              <Folder className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Historial organizado y fácil de consultar</span>
          </li>
      </ul>
    </div>
  );
}

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const autoplayPlugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="fixed top-0 w-full bg-[#18441E] dark:bg-background dark:border-b dark:border-border z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between ">
            <Link className="flex items-center" href="/">
              <Image alt="Zenda Logo" loading="lazy" width="36" height="36" src="https://i.postimg.cc/BbB1NZZF/replicate-prediction-h8nxevgngdrge0cr5vb92hqb80.png" style={{color: 'transparent'}} />
              <span className="ml-2 text-xs font-semibold text-white dark:text-foreground border border-white/50 dark:border-border px-2 py-0.5 rounded-full">BETA</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link className="text-white dark:text-foreground hover:text-white/80 dark:hover:text-primary transition-all duration-300 ease-in-out relative group text-base font-medium" href="/">
                Inicio
                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white dark:bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
              </Link>
              <Link className="text-white dark:text-foreground hover:text-white/80 dark:hover:text-primary transition-all duration-300 ease-in-out relative group text-base font-medium" href="#features">
                Ventajas
                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white dark:bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
              </Link>
              <Link className="text-white dark:text-foreground hover:text-white/80 dark:hover:text-primary transition-all duration-300 ease-in-out relative group text-base font-medium" href="#how-it-works-steps">
                Funcionalidades
                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white dark:bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
              </Link>
              <a className="inline-flex items-center justify-center whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 bg-white hover:bg-white/90 text-[#063C0F] dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90 font-semibold px-6 py-2 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 text-base" href="/login">
                Iniciar sesión
              </a>
            </nav>
            <button 
              onClick={toggleMenu}
              className="md:hidden text-white dark:text-foreground focus:outline-none focus:ring-2 focus:ring-white rounded-md p-1" 
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="h-8 w-8" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu">
                  <line x1="4" x2="20" y1="12" y2="12"></line>
                  <line x1="4" x2="20" y1="6" y2="6"></line>
                  <line x1="4" x2="20" y1="18" y2="18"></line>
                </svg>
              )}
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && (
        <div 
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMenuOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="flex flex-col space-y-4 py-4">
            <Link 
              href="/" 
              className="text-white dark:text-foreground hover:text-white/80 dark:hover:text-primary py-2 text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link 
              href="#features" 
              className="text-white dark:text-foreground hover:text-white/80 dark:hover:text-primary py-2 text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Ventajas
            </Link>
            <Link 
              href="#how-it-works-steps" 
              className="text-white dark:text-foreground hover:text-white/80 dark:hover:text-primary py-2 text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Funcionalidades
            </Link>
            <a 
              href="/login" 
              className="inline-flex items-center justify-center bg-white hover:bg-white/90 text-[#063C0F] dark:bg-primary dark:text-primary-foreground font-semibold px-6 py-2 rounded-lg shadow transition-all duration-300 text-base"
              onClick={() => setIsMenuOpen(false)}
            >
              Iniciar sesión
            </a>
          </nav>
        </div>
        )}
      </header>

      <main className="flex-grow pt-20">
        <section className="hero-section bg-hero dark:bg-background">
          <div className="hero-content">
            <div className="tag">
                <span>Análisis Clínico • Notas Instantáneas • Seguimiento Visual</span>
            </div>
            <h1 className="leading-tighter">
              <span className="text-[#063C0F] dark:text-primary">
                Mejora la<br />calidad de tus<br />sesiones con
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#2A7F34] to-[#81D486] bg-clip-text text-transparent">Zenda</span>
            </h1>
            <p>Zenda te ayuda a simplificar tu práctica para que puedas enfocarte en lo que más importa: tus pacientes</p>
            <div className="buttons mt-8">
                <Button asChild size="lg" className="group font-body font-bold w-full sm:w-auto shadow-lg shadow-primary/30 transition-all duration-300 bg-[#357D3D] text-primary-foreground hover:bg-[#357D3D]/90">
                    <Link href="/login">
                        Quiero potenciar mis sesiones
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                </Button>
                <Button asChild variant="outline" className="py-4 px-8 rounded-lg text-base font-bold text-[#063C0F] border-[#063C0F] bg-white dark:text-primary dark:border-primary dark:bg-transparent" id="how-it-works-button"><Link href="#how-it-works-steps">Ver como funciona</Link></Button>
            </div>
          </div>
          <div className="hero-image">
             <HeroImage />
          </div>
        </section>

        <section className="comparison-section" id="how-it-works">
            <h2 className="comparison-title">Un antes y un después en tu consulta</h2>
            <div className="comparison-container">
                <div className="before-card">
                    <h3>Antes</h3>
                    <ul>
                        <li><X className="text-red-500" /> Terminabas cada sesión con horas de escritura manual</li>
                        <li><X className="text-red-500" /> Costaba conectar los puntos entre sesiones y pacientes</li>
                        <li><X className="text-red-500" /> Fragmentos de información dispersa</li>
                    </ul>
                </div>
                <div className="after-card">
                    <h3>Después</h3>
                    <ul>
                        <li><Check className="text-green-500" /> Notas automáticas con resúmenes e insights clave</li>
                        <li><Check className="text-green-500" /> Visualización de evolución y objetivos terapéuticos</li>
                        <li><Check className="text-green-500" /> Historial organizado y fácil de consultar</li>
                    </ul>
                </div>
            </div>
        </section>

        <section id="features" className="py-20 md:py-28 bg-transparent">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-headline text-4xl md:text-5xl font-bold text-foreground">Ventajas que notarás desde el primer día</h2>
            </div>
            <Carousel 
                className="w-full max-w-6xl mx-auto"
                opts={{ loop: true }}
                plugins={[autoplayPlugin.current]}
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
                          <h3 className="font-headline text-2xl font-bold text-foreground mb-2">{advantage.title}</h3>
                          <p className="text-foreground/80 flex-grow">{advantage.description}</p>
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
            <p className="how-it-works-subtitle">Empieza a potenciar tus sesiones en cuatro simples pasos.</p>
            <div className="steps-container">
                {howItWorksSteps.map((step) => (
                    <div key={step.number} className="step-card">
                        <div className="step-icon-container">
                            <div className="step-icon-background">
                                {step.icon}
                            </div>
                            <div className="step-number">{step.number}</div>
                        </div>
                        <h3 className="step-title">{step.title}</h3>
                        <p className="step-description">{step.description}</p>
                    </div>
                ))}
            </div>
        </section>
      </main>
      <ThemeToggle />
      <footer>
        <div className="footer-container">
          <div className="footer-column">
            <h3>Zenda</h3>
            <p>Impulsa tu práctica psicológica. Centraliza notas, seguimientos y patrones clínicos para enfocarte en lo más importante: tus pacientes.</p>
          </div>
          <div className="footer-column">
            <h3>Producto</h3>
            <ul>
              <li><Link href="#how-it-works-steps">Cómo funciona</Link></li>
              <li><Link href="#features">Funcionalidades</Link></li>
              <li><Link href="/dashboard/support/chat">FAQ</Link></li>
              <li><Link href="/terms">Términos y Condiciones</Link></li>
              <li><Link href="/privacy">Política de privacidad</Link></li>
              <li><Link href="/data-deletion">Eliminación de Datos</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Contacto</h3>
            <ul>
              <li><a href="mailto:hola@zenda.ai" className="flex items-center gap-2"><Mail className="h-4 w-4" /> hola@zenda.ai</a></li>
              <li><a href="#" className="flex items-center gap-2"><Github className="h-4 w-4" /> GitHub</a></li>
              <li><a href="#" className="flex items-center gap-2"><Twitter className="h-4 w-4" /> Twitter</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Zenda.</p>
        </div>
      </footer>
    </div>
  );
}
