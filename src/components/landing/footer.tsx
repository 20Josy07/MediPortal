import Link from "next/link";

export function LandingFooter() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-secondary py-16 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-2xl font-bold mb-4">Alumbra</h3>
            <p className="text-gray-400 mb-4 max-w-xs">
              Ilumina tu bienestar emocional con inteligencia artificial. Detecta abuso psicológico en conversaciones digitales de forma gratuita y privada.
            </p>
            <div className="flex gap-4">
              <span className="bg-background text-xs font-bold px-3 py-1.5 rounded-full">💜 100% Gratuito</span>
              <span className="bg-background text-xs font-bold px-3 py-1.5 rounded-full">🛡️ Privado</span>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-6">Producto</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-gray-400 hover:text-[hsl(var(--highlight-yellow))]">Cómo funciona</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-[hsl(var(--highlight-yellow))]">Funcionalidades</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-[hsl(var(--highlight-yellow))]">FAQ</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-[hsl(var(--highlight-yellow))]">Política de privacidad</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-6">Contacto</h3>
            <ul className="space-y-3">
              <li><a href="mailto:hola@alumbra.ai" className="text-gray-400 hover:text-[hsl(var(--highlight-yellow))]">✉️ hola@alumbra.ai</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[hsl(var(--highlight-yellow))]">🐙 GitHub</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[hsl(var(--highlight-yellow))]">🐦 Twitter</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-gray-600 border-t border-white/10 mt-12 pt-8">
          <p>© {currentYear} Alumbra. Hecho con 💜 para proteger tu bienestar emocional.</p>
        </div>
      </div>
    </footer>
  );
}
