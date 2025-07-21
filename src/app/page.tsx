
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, BarChart, Folder, X, Check, Scissors, Library, PenSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const advantages = [
  {
    icon: <Scissors className="h-8 w-8 text-[#063C0F]" />,
    title: "Plantillas personalizables",
    description: "Ajusta formatos según tu estilo clínico en segundos.",
    image: "https://i.postimg.cc/tJ72VzD1/replicate-prediction-q6ywnaddbtfey0cr5wxghd1nhe.png",
    hint: "note template",
  },
  {
    icon: <Library className="h-8 w-8 text-[#063C0F]" />,
    title: "Historial centralizado",
    description: "Todo el proceso terapéutico en un solo lugar, con filtros por fecha, tema o cliente.",
    image: "https://i.postimg.cc/9Q6tXgNT/replicate-prediction-8i9j3rdx7krh80cr5x9s64jys0.png",
    hint: "patient chart",
  },
  {
    icon: <PenSquare className="h-8 w-8 text-[#063C0F]" />,
    title: "Notas y resúmenes automáticos",
    description: "Tu plataforma redacta la nota SOAP o DAP y extrae insights clave.",
    image: "https://i.postimg.cc/tJ72VzD1/replicate-prediction-q6ywnaddbtfey0cr5wxghd1nhe.png",
    hint: "automatic notes",
  },
];


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
                        <li><X className="text-red-500" /> Notas manuales que llevan horas tras cada sesión</li>
                        <li><X className="text-red-500" /> Dificultad para identificar patrones clínicos</li>
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

        <section className="advantages-section" id="features">
          <h2 className="advantages-title">Ventajas que notarás desde el primer día</h2>
          <Carousel className="w-full max-w-5xl mx-auto" opts={{ loop: true }}>
            <CarouselContent>
              {advantages.map((advantage, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card className="advantage-card">
                      <CardContent className="flex flex-col items-center text-center p-6">
                        <div className="advantage-image-container">
                           <Image src={advantage.image} alt={advantage.title} layout="fill" objectFit="cover" className="rounded-t-lg" data-ai-hint={advantage.hint} />
                        </div>
                        <div className="advantage-icon-wrapper">
                          {advantage.icon}
                        </div>
                        <h3 className="text-xl font-bold mt-4 text-[#063C0F]">{advantage.title}</h3>
                        <p className="text-gray-600 mt-2">{advantage.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>

        <section className="testimonials-section" id="testimonials">
          <h2>Lo que dicen nuestros usuarios</h2>
          <p className="subtitle">Psicólogos como tú ya están transformando su práctica con Zenda.</p>
          <div className="testimonials-container">
            <div className="testimonial-card">
              <p>"Zenda ha sido un antes y un después. La función de notas con IA me ahorra horas a la semana, permitiéndome enfocarme más en la terapia y menos en el papeleo."</p>
              <div className="author-info">
                <div className="author-avatar"></div>
                <div>
                  <span className="author-name">Dr. Ana Torres</span>
                  <span className="author-title">Psicóloga Clínica</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <p>"La interfaz es increíblemente intuitiva y minimalista. Mis pacientes adoran la facilidad para agendar y gestionar sus citas a través del portal. ¡Totalmente recomendado!"</p>
              <div className="author-info">
                <div className="author-avatar"></div>
                <div>
                  <span className="author-name">Lic. Carlos Vega</span>
                  <span className="author-title">Terapeuta Cognitivo-Conductual</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <p>"Finalmente una plataforma que entiende las necesidades de los psicólogos. La seguridad y la privacidad son robustas, lo que me da total tranquilidad para manejar la información sensible de mis pacientes."</p>
              <div className="author-info">
                <div className="author-avatar"></div>
                <div>
                  <span className="author-name">Dra. Sofía Ramos</span>
                  <span className="author-title">Psicoanalista</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="mission-vision-section" id="mission">
          <h2>Nuestra Misión y Visión</h2>
          <p className="subtitle">El porqué detrás de Zenda.</p>
          <div className="mission-vision-container">
            <div className="mission-card">
              <div className="icon-title">
                <Image src="https://img.icons8.com/ios-filled/50/ffffff/rocket.png" alt="Rocket Icon" width={30} height={30}/>
                <h3>Misión</h3>
              </div>
              <p>Facilitar el trabajo de los psicólogos mediante una plataforma inteligente que centraliza herramientas clínicas y administrativas, permitiéndoles dedicar más tiempo y atención plena a sus pacientes.
              Construimos tecnología que transforma la carga operativa en claridad, eficiencia y bienestar profesional, para que cada sesión cuente realmente.</p>
            </div>
            <div className="vision-card">
              <div className="icon-title">
                <Image src="https://img.icons8.com/ios-filled/50/ffffff/visible.png" alt="Eye Icon" width={30} height={30}/>
                <h3>Visión</h3>
              </div>
              <p>Ser la solución digital líder en Latinoamérica para psicólogos, redefiniendo la práctica clínica con IA accesible, intuitiva y profundamente humana.
              Queremos que cada profesional de la salud mental cuente con herramientas que lo liberen, no que lo limiten, y que Zenda sea sinónimo de cuidado, confianza e innovación en el acompañamiento terapéutico.</p>
            </div>
          </div>
        </section>
      </main>
      <footer>
        <div className="footer-container">
          <div className="footer-column">
            <h3>Zenda</h3>
            <p>Ilumina tu bienestar emocional con inteligencia artificial. Detecta abuso psicológico en conversaciones digitales de forma gratuita y privada.</p>
            <div className="footer-badges">
              <span>💜 100% Gratuito</span>
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
