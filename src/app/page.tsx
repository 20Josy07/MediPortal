
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, BarChart, Folder, X, Check, UserPlus, Calendar, Sparkles, FilePenLine, Bell, LayoutGrid, CalendarDays } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

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
        icon: <UserPlus className="h-8 w-8 text-[#063C0F]" />,
        title: "Crea tu cuenta en minutos",
        description: "Regístrate de forma rápida y segura. Sin complicaciones.",
    },
    {
        number: 2,
        icon: <UserPlus className="h-8 w-8 text-[#063C0F]" />,
        title: "Añade tus pacientes",
        description: "Crea perfiles con su historial, evolución y notas clínicas centralizadas.",
    },
    {
        number: 3,
        icon: <FilePenLine className="h-8 w-8 text-[#063C0F]" />,
        title: "Configura tus plantillas",
        description: "Elige entre formatos como SOAP o DAP y personalízalos según tu estilo clínico.",
    },
    {
        number: 4,
        icon: <Sparkles className="h-8 w-8 text-[#063C0F]" />,
        title: "Inicia tus sesiones",
        description: "Deja que Zenda genere notas e insights automáticamente.",
    }
]


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="fixed top-0 w-full bg-[#18441E] z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link className="flex items-center" href="/">
              <Image alt="Zenda Logo" loading="lazy" width="36" height="36" src="https://i.postimg.cc/BbB1NZZF/replicate-prediction-h8nxevgngdrge0cr5vb92hqb80.png" style={{color: 'transparent'}} />
              <span className="ml-2 text-xs font-semibold text-white border border-white/50 px-2 py-0.5 rounded-full">BETA</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link className="text-white hover:text-white/80 transition-all duration-300 ease-in-out relative group text-base font-medium" href="/">
                Inicio
                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
              </Link>
              <Link className="text-white hover:text-white/80 transition-all duration-300 ease-in-out relative group text-base font-medium" href="#how-it-works">
                Ventajas
                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
              </Link>
              <Link className="text-white hover:text-white/80 transition-all duration-300 ease-in-out relative group text-base font-medium" href="#features">
                Funcionalidades
                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
              </Link>
              <a className="inline-flex items-center justify-center whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 bg-white hover:bg-white/90 text-[#063C0F] font-semibold px-6 py-2 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 text-base" href="/login">
                Iniciar sesión
              </a>
            </nav>
            <button className="md:hidden text-white focus:outline-none focus:ring-2 focus:ring-white rounded-md" aria-label="Toggle menu">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line></svg>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-20">
        <section className="hero-section bg-hero">
          <div className="hero-content text-gray-800">
            <div className="tag">
                <span>Análisis Clínico • Notas Instantáneas • Seguimiento Visual</span>
            </div>
            <h1 className="leading-tighter">
              <span className="text-[#063C0F]">
                Mejora la<br />calidad de tus<br />sesiones con
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#2A7F34] to-[#81D486] bg-clip-text text-transparent">Zenda</span>
            </h1>
            <p className="text-black">Zenda te ayuda a simplificar tu práctica para que puedas enfocarte en lo que más importa: tus pacientes</p>
            <div className="buttons">
                <Button asChild size="lg" className="group font-body font-bold w-full sm:w-auto shadow-lg shadow-primary/30 transition-all duration-300 bg-[#357D3D] text-primary-foreground hover:bg-[#357D3D]/90">
                    <Link href="/login">
                        Quiero potenciar mis sesiones
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                </Button>
                <Button asChild variant="outline" className="py-4 px-8 rounded-lg text-base font-bold text-[#063C0F] border-[#063C0F] border-2 bg-white" id="how-it-works-button"><Link href="#how-it-works">Ver como funciona</Link></Button>
            </div>
          </div>
          <div className="hero-image">
             <div
              className="relative flex items-center justify-center gap-8 bg-hero rounded-2xl p-8 shadow-lg max-w-4xl mx-auto bg-cover bg-center"
              style={{ backgroundImage: "url('https://i.postimg.cc/90JczQjX/replicate-prediction-rrhfmdd58drg80cr5w9t956axw.png')" }}
            >
              <div className="absolute inset-0 bg-black/30 rounded-2xl"></div>
              <div className="relative z-10 flex flex-col gap-4 w-full max-w-md">
                <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm">
                  <FileText className="h-6 w-6 text-[#1a3b2c]" />
                  <span className="text-[#1a3b2c] font-medium">Notas automáticas con resúmenes e insights clave</span>
                </div>
                <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm">
                  <BarChart className="h-6 w-6 text-[#1a3b2c]" />
                  <span className="text-[#1a3b2c] font-medium">Visualización de evolución y objetivos terapéuticos</span>
                </div>
                <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm">
                  <Folder className="h-6 w-6 text-[#1a3b2c]" />
                  <span className="text-[#1a3b2c] font-medium">Historial organizado y fácil de consultar</span>
                </div>
              </div>
            </div>
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
            <Carousel className="w-full max-w-6xl mx-auto" opts={{ loop: true }}>
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
      <footer>
        <div className="footer-container">
          <div className="footer-column">
            <h3>Zenda</h3>
            <p>Impulsa tu práctica psicológica. Centraliza notas, seguimientos y patrones clínicos para enfocarte en lo más importante: tus pacientes.</p>
            <div className="footer-badges">
              <span>Herramientas clínicas</span>
              <span>🛡️ Privado</span>
            </div>
          </div>
          <div className="footer-column">
            <h3>Producto</h3>
            <ul>
              <li><Link href="#">Cómo funciona</Link></li>
              <li><Link href="#">Funcionalidades</Link></li>
              <li><Link href="#">FAQ</Link></li>
              <li><Link href="#">Política de privacidad</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Contacto</h3>
            <ul>
              <li><a href="mailto:hola@zenda.ai">✉️ hola@zenda.ai</a></li>
              <li><a href="#">🐙 GitHub</a></li>
              <li><a href="#">🐦 Twitter</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Zenda. Hecho con 💜 para proteger tu bienestar emocional.</p>
        </div>
      </footer>
    </div>
  );
}
