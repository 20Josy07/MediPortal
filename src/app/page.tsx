import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { LandingHeader } from "@/components/landing/header";
import { LandingFooter } from "@/components/landing/footer";

const icon = (name: string) => `https://img.icons8.com/ios-filled/50/ffffff/${name}.png`;

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <LandingHeader />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="flex flex-col lg:flex-row items-center justify-center gap-6 px-4 py-8 sm:px-8 md:px-12 lg:min-h-[calc(100vh-80px)]">
          <div className="flex-1 max-w-3xl text-center lg:text-left">
            <div className="inline-block bg-secondary text-sm font-bold text-gray-300 px-4 py-2 rounded-full mb-4">
              <span>✨ Fácil • Privado • Impulsado por IA</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-3">
              <span className="alumbra-highlight">Alumbra</span>: Organiza tus citas, notas y evolución clínica desde un solo lugar.
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 mb-8">
              Alumbra te ayuda a simplificar tu práctica para que puedas enfocarte en lo que más importa: tus pacientes
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild className="primary-button-gradient rounded-full px-8 py-6 text-base font-bold transition-transform duration-200 ease-in-out">
                <Link href="/login">Inicia sesión ahora</Link>
              </Button>
              <Button variant="outline" className="rounded-full px-8 py-6 text-base font-bold border-2 border-primary bg-transparent text-white hover:bg-primary/30 hover:text-white transition-transform duration-200 ease-in-out hover:-translate-y-0.5">
                Ver como funciona
              </Button>
            </div>
          </div>
          <div className="flex-1 flex justify-center items-center mt-8 lg:mt-0">
            <div className="bg-input border border-border rounded-lg w-full max-w-xl shadow-2xl">
              <div className="flex items-center gap-2 px-4 py-3 bg-border relative">
                <div className="flex gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#FF605C]"></span>
                  <span className="w-3 h-3 rounded-full bg-[#FFBD44]"></span>
                  <span className="w-3 h-3 rounded-full bg-[#00CA4E]"></span>
                </div>
                <span className="absolute left-1/2 -translate-x-1/2 text-sm font-bold text-gray-300">Análisis de conversación</span>
              </div>
              <div className="p-6 font-mono text-sm text-gray-200">
                <p>Eres estúpido, ¿cómo pudiste hacer eso? ¡Eres un idiota!</p>
                <p>Cálmate, fue un error...</p>
                <p>¡Un error! Siempre arruinas todo. No sirves para nada.</p>
                <br />
                <div className="bg-muted p-3 rounded flex justify-between items-center font-bold text-sm mt-4">
                  <span className="text-gray-400">ESTADO EMOCIONAL</span>
                  <span className="text-destructive">⛔ Negativo</span>
                </div>
                 <div className="bg-muted p-3 rounded flex justify-between items-center font-bold text-sm mt-2">
                  <span className="text-gray-400">ALERTA</span>
                  <span className="text-destructive">⚠ Abuso / Manipulación</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-16 sm:py-24 bg-secondary text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">¿Cómo funciona Alumbra?</h2>
            <p className="text-lg text-gray-400 mb-12">En solo 3 pasos simples, obtén claridad sobre tus relaciones digitales</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-background rounded-xl p-8 shadow-lg relative transition-transform hover:-translate-y-2">
                <div className="absolute top-4 left-4 text-5xl font-extrabold text-white/10">1</div>
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#FF007F] to-[#A020F0] flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Image src={icon("document")} alt="Document Icon" width={40} height={40} />
                </div>
                <h3 className="text-2xl font-bold mb-3">Regístrate</h3>
                <p className="text-gray-400">Crea tu cuenta en minutos y configura tu perfil profesional. Es rápido, fácil y seguro.</p>
              </div>
              <div className="bg-background rounded-xl p-8 shadow-lg relative transition-transform hover:-translate-y-2">
                <div className="absolute top-4 left-4 text-5xl font-extrabold text-white/10">2</div>
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#FF007F] to-[#A020F0] flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Image src={icon("user")} alt="User Icon" width={40} height={40} />
                </div>
                <h3 className="text-2xl font-bold mb-3">Organiza tu agenda</h3>
                <p className="text-gray-400">Importa tus pacientes y empieza a agendar citas. Nuestro calendario inteligente te lo pone facil</p>
              </div>
              <div className="bg-background rounded-xl p-8 shadow-lg relative transition-transform hover:-translate-y-2">
                <div className="absolute top-4 left-4 text-5xl font-extrabold text-white/10">3</div>
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#FF007F] to-[#A020F0] flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Image src={icon("bar-chart")} alt="Bar Chart Icon" width={40} height={40} />
                </div>
                <h3 className="text-2xl font-bold mb-3">Potencia tu práctica</h3>
                <p className="text-gray-400">Usa nuestras herramientas de IA para generar notas, resúmenes y seguir la evolución de tus pacientes.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 sm:py-24 bg-background text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">Funcionalidades que te protegen</h2>
            <p className="text-lg text-gray-400 mb-12">Herramientas poderosas diseñadas para tu bienestar emocional y privacidad</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: "lightning-bolt", title: "Agenda Inteligente", desc: "Gestiona tus citas, recordatorios automáticos y disponibilidad en un solo lugar." },
                { icon: "brain", title: "Notas de Sesión con IA", desc: "Genera notas SOAP y resúmenes clínicos estructurados automáticamente." },
                { icon: "heart-outline", title: "Seguimiento de Evolución", desc: "Visualiza el progreso de tus pacientes con gráficos y métricas claras." },
                { icon: "shield", title: "Máxima Privacidad", desc: "Cumplimiento HIPAA y encriptación de extremo a extremo para proteger tus datos." },
                { icon: "smartphone", title: "Portal del Paciente", desc: "Un espacio seguro para que tus pacientes accedan a su información y citas." },
                { icon: "community", title: "Facturación Simplificada", desc: "Crea y envía facturas a tus pacientes de forma sencilla e integrada." }
              ].map(feature => (
                <div key={feature.title} className="bg-secondary rounded-xl p-8 shadow-lg transition-transform hover:-translate-y-2">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#FF007F] to-[#A020F0] flex items-center justify-center mx-auto mb-6 shadow-md">
                    <Image src={icon(feature.icon)} alt={`${feature.title} Icon`} width={30} height={30} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-sm text-gray-400">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-16 sm:py-24 bg-secondary text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">Lo que dicen nuestros usuarios</h2>
            <p className="text-lg text-gray-400 mb-12">Psicólogos como tú ya están transformando su práctica con Alumbra.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-background text-left flex flex-col justify-between">
                <CardContent className="pt-6">
                  <p className="text-gray-300 mb-6 flex-grow">"Alumbra ha sido un antes y un después. La función de notas con IA me ahorra horas a la semana, permitiéndome enfocarme más en la terapia y menos en el papeleo."</p>
                  <div className="flex items-center gap-4 mt-auto">
                    <Avatar><div className="w-12 h-12 rounded-full bg-gray-700"></div></Avatar>
                    <div>
                      <p className="font-bold">Dr. Ana Torres</p>
                      <p className="text-sm text-gray-500">Psicóloga Clínica</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-background text-left flex flex-col justify-between">
                <CardContent className="pt-6">
                  <p className="text-gray-300 mb-6 flex-grow">"La interfaz es increíblemente intuitiva y minimalista. Mis pacientes adoran la facilidad para agendar y gestionar sus citas a través del portal. ¡Totalmente recomendado!"</p>
                  <div className="flex items-center gap-4 mt-auto">
                    <Avatar><div className="w-12 h-12 rounded-full bg-gray-700"></div></Avatar>
                    <div>
                      <p className="font-bold">Lic. Carlos Vega</p>
                      <p className="text-sm text-gray-500">Terapeuta Cognitivo-Conductual</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-background text-left flex flex-col justify-between">
                <CardContent className="pt-6">
                  <p className="text-gray-300 mb-6 flex-grow">"Finalmente una plataforma que entiende las necesidades de los psicólogos. La seguridad y la privacidad son robustas, lo que me da total tranquilidad para manejar la información sensible de mis pacientes."</p>
                  <div className="flex items-center gap-4 mt-auto">
                    <Avatar><div className="w-12 h-12 rounded-full bg-gray-700"></div></Avatar>
                    <div>
                      <p className="font-bold">Dra. Sofía Ramos</p>
                      <p className="text-sm text-gray-500">Psicoanalista</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Mission/Vision Section */}
        <section id="mission" className="py-16 sm:py-24 bg-background text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">Nuestra Misión y Visión</h2>
            <p className="text-lg text-gray-400 mb-12">El porqué detrás de Alumbra.</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
              <div className="bg-secondary rounded-xl p-8 text-left">
                <div className="flex items-center gap-4 mb-6">
                  <Image src={icon("rocket")} alt="Rocket Icon" width={30} height={30} />
                  <h3 className="text-3xl font-bold">Misión</h3>
                </div>
                <p className="text-gray-300">Facilitar el trabajo de los psicólogos mediante una plataforma inteligente que centraliza herramientas clínicas y administrativas, permitiéndoles dedicar más tiempo y atención plena a sus pacientes. Construimos tecnología que transforma la carga operativa en claridad, eficiencia y bienestar profesional, para que cada sesión cuente realmente.</p>
              </div>
              <div className="bg-secondary rounded-xl p-8 text-left">
                <div className="flex items-center gap-4 mb-6">
                  <Image src={icon("visible")} alt="Eye Icon" width={30} height={30} />
                  <h3 className="text-3xl font-bold">Visión</h3>
                </div>
                <p className="text-gray-300">Ser la solución digital líder en Latinoamérica para psicólogos, redefiniendo la práctica clínica con IA accesible, intuitiva y profundamente humana. Queremos que cada profesional de la salud mental cuente con herramientas que lo liberen, no que lo limiten, y que Alumbra sea sinónimo de cuidado, confianza e innovación en el acompañamiento terapéutico.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
