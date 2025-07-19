
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="fixed top-0 w-full bg-[#301744] shadow-md z-50 border-b border-[#301744]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link className="flex items-center" href="/">
              <Image alt="Alumbra Logo" loading="lazy" width="36" height="36" src="https://i.postimg.cc/59L8Lbsj/og-image.png" style={{color: 'transparent'}} />
              <span className="ml-2 text-xs font-semibold text-white border border-white/50 px-2 py-0.5 rounded-full">BETA</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-8 text-white">
              <Link className="text-white hover:text-white/80 transition-all duration-300 ease-in-out relative group text-base font-medium" href="/">
                Inicio
                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
              </Link>
              <Link className="text-white hover:text-white/80 transition-all duration-300 ease-in-out relative group text-base font-medium" href="#testimonials">
                Testimonios
                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
              </Link>
              <Link className="text-white hover:text-white/80 transition-all duration-300 ease-in-out relative group text-base font-medium" href="#mission">
                Misión
                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
              </Link>
              <a className="inline-flex items-center justify-center whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 bg-white hover:bg-gray-100 text-alumbra-purple font-semibold px-6 py-2 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 text-base" href="/login">
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
                <span>✨ Fácil • Privado • Impulsado por IA</span>
            </div>
            <h1><span className="alumbra-highlight">Alumbra</span>: Organiza tus citas, notas y evolución clínica desde un solo lugar.</h1>
            <p>Alumbra te ayuda a simplificar tu práctica para que puedas enfocarte en lo que más importa: tus pacientes</p>
            <div className="buttons">
                <Button asChild className="primary-button"><Link href="/login">Inicia sesión ahora</Link></Button>
                <Button asChild className="secondary-button !text-gray-800 border-gray-800 hover:bg-gray-800 hover:text-white" id="how-it-works-button"><Link href="#how-it-works">Ver como funciona</Link></Button>
            </div>
          </div>
          <div className="hero-image">
             <Image 
                src="https://i.postimg.cc/6QghnGQg/Psicologo.png" 
                alt="Psicólogo usando Alumbra en una tablet" 
                width={600}
                height={600}
                className="rounded-lg max-w-md w-full h-auto"
                style={{ filter: 'drop-shadow(0 20px 25px rgba(0, 0, 0, 0.4))' }}
                data-ai-hint="psychologist tablet"
                priority
              />
          </div>
        </section>

        <section className="how-it-works-section" id="how-it-works">
          <h2>¿Cómo funciona Alumbra?</h2>
          <p className="subtitle">En solo 3 pasos simples, obtén claridad sobre tus relaciones digitales</p>
          <div className="steps-container">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="icon-circle">
                <Image src="https://img.icons8.com/ios-filled/50/ffffff/document.png" alt="Document Icon" width={40} height={40}/>
              </div>
              <h3>Regístrate</h3>
              <p>Crea tu cuenta en minutos y configura tu perfil profesional. Es rápido, fácil y seguro.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <div className="icon-circle">
                <Image src="https://img.icons8.com/ios-filled/50/ffffff/user.png" alt="User Icon" width={40} height={40}/>
              </div>
              <h3>Organiza tu agenda</h3>
              <p>Importa tus pacientes y empieza a agendar citas. Nuestro calendario inteligente te lo pone facil</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <div className="icon-circle">
                <Image src="https://img.icons8.com/ios-filled/50/ffffff/bar-chart.png" alt="Bar Chart Icon" width={40} height={40}/>
              </div>
              <h3>Potencia tu práctica</h3>
              <p>Usa nuestras herramientas de IA para generar notas, resúmenes y seguir la evolución de tus pacientes.</p>
            </div>
          </div>
        </section>

        <section className="features-section">
          <h2>Funcionalidades que te protegen</h2>
          <p className="subtitle">Herramientas poderosas diseñadas para tu bienestar emocional y privacidad</p>
          <div className="features-container">
            <div className="feature-card">
              <div className="icon-circle-small">
                <Image src="https://img.icons8.com/ios-filled/50/ffffff/lightning-bolt.png" alt="Lightning Bolt Icon" width={30} height={30}/>
              </div>
              <h3>Agenda Inteligente</h3>
              <p>Gestiona tus citas, recordatorios automáticos y disponibilidad en un solo lugar.</p>
            </div>
            <div className="feature-card">
              <div className="icon-circle-small">
                <Image src="https://img.icons8.com/ios-filled/50/ffffff/brain.png" alt="Brain Icon" width={30} height={30}/>
              </div>
              <h3>Notas de Sesión con IA</h3>
              <p>Genera notas SOAP y resúmenes clínicos estructurados automáticamente.</p>
            </div>
            <div className="feature-card">
              <div className="icon-circle-small">
                <Image src="https://img.icons8.com/ios-filled/50/ffffff/heart-outline.png" alt="Heart Icon" width={30} height={30}/>
              </div>
              <h3>Seguimiento de Evolución</h3>
              <p>Visualiza el progreso de tus pacientes con gráficos y métricas claras.</p>
            </div>
            <div className="feature-card">
              <div className="icon-circle-small">
                <Image src="https://img.icons8.com/ios-filled/50/ffffff/shield.png" alt="Shield Icon" width={30} height={30}/>
              </div>
              <h3>Máxima Privacidad</h3>
              <p>Cumplimiento HIPAA y encriptación de extremo a extremo para proteger tus datos.</p>
            </div>
            <div className="feature-card">
              <div className="icon-circle-small">
                <Image src="https://img.icons8.com/ios-filled/50/ffffff/smartphone.png" alt="Smartphone Icon" width={30} height={30}/>
              </div>
              <h3>Portal del Paciente</h3>
              <p>Un espacio seguro para que tus pacientes accedan a su información y citas.</p>
            </div>
            <div className="feature-card">
              <div className="icon-circle-small">
                <Image src="https://img.icons8.com/ios-filled/50/ffffff/community.png" alt="Community Icon" width={30} height={30}/>
              </div>
              <h3>Facturación Simplificada</h3>
              <p>Crea y envía facturas a tus pacientes de forma sencilla e integrada.</p>
            </div>
          </div>
        </section>

        <section className="testimonials-section" id="testimonials">
          <h2>Lo que dicen nuestros usuarios</h2>
          <p className="subtitle">Psicólogos como tú ya están transformando su práctica con Alumbra.</p>
          <div className="testimonials-container">
            <div className="testimonial-card">
              <p>"Alumbra ha sido un antes y un después. La función de notas con IA me ahorra horas a la semana, permitiéndome enfocarme más en la terapia y menos en el papeleo."</p>
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
          <p className="subtitle">El porqué detrás de Alumbra.</p>
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
              Queremos que cada profesional de la salud mental cuente con herramientas que lo liberen, no que lo limiten, y que Alumbra sea sinónimo de cuidado, confianza e innovación en el acompañamiento terapéutico.</p>
            </div>
          </div>
        </section>
      </main>
      <footer>
        <div className="footer-container">
          <div className="footer-column">
            <h3>Alumbra</h3>
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
              <li><a href="mailto:hola@alumbra.ai">✉️ hola@alumbra.ai</a></li>
              <li><a href="#">🐙 GitHub</a></li>
              <li><a href="#">🐦 Twitter</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Alumbra. Hecho con 💜 para proteger tu bienestar emocional.</p>
        </div>
      </footer>
    </div>
  );
}
