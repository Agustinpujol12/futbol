import Link from 'next/link';
import { Logo } from '@/components/icons'; // Asegúrate de que esta ruta sea correcta
import { Facebook, Instagram, Twitter, Gamepad2 } from 'lucide-react'; 

// Componente para el icono de TikTok (SVG personalizado)
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    height="1em" 
    width="1em" 
    className={className}
  >
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
  </svg>
);

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      {/* --- SECCIÓN SUPERIOR (COLUMNAS) --- */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Columna 1: Marca / Info */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-2">
              <Logo className="h-8 w-8 text-primary" />
              <span className="text-xl font-headline font-bold text-foreground">
                Global GoalGetters
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              La plataforma definitiva de fútbol fantasy. Arma tu equipo, compite en ligas y demuestra que eres el mejor manager.
            </p>
          </div>

          {/* Columna 2: Atajos (Navegación) */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-bold text-foreground">Navegación</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
              </li>
              <li>
                <Link href="/leagues" className="hover:text-primary transition-colors">Ligas</Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
              </li>
              <li>
                <Link href="/rendimiento" className="hover:text-primary transition-colors">Rendimiento</Link>
              </li>
              <li>
                <Link href="/tienda" className="hover:text-primary transition-colors">Tienda</Link>
              </li>
              <li>
                <Link href="/fixturemundial" className="hover:text-primary transition-colors">Mundial 2026</Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Soporte */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-bold text-foreground">Soporte</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              
              {/* Enlace a Reglas */}
              <li>
                <Link 
                  href="/rules" 
                  className="hover:text-primary transition-colors"
                >
                  Reglas del Juego
                </Link>
              </li>

              {/* Enlace a Preguntas Frecuentes */}
              <li>
                <Link 
                  href="/faq" 
                  className="hover:text-primary transition-colors"
                >
                  Preguntas Frecuentes
                </Link>
              </li>

              {/* Enlace a Contacto */}
              <li>
                <Link 
                  href="/contact" 
                  className="hover:text-primary transition-colors"
                >
                  Contacto
                </Link>
              </li>

              {/* Bug -> Discord */}
              <li>
                <a 
                  href="https://discord.gg/fHV4yxsF76" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Reportar un Bug
                </a>
              </li>

            </ul>
          </div>

          {/* Columna 4: Comunidad */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-bold text-foreground">Comunidad</h3>
            <p className="text-sm text-muted-foreground">
              Únete a nuestro servidor de Discord para noticias, torneos y soporte en vivo.
            </p>
            
            {/* Botón Discord Destacado */}
            <a 
              href="https://discord.gg/fHV4yxsF76"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white px-4 py-2 rounded-md transition-all transform hover:scale-105 w-fit font-medium text-sm shadow-lg shadow-indigo-500/20"
            >
              <Gamepad2 className="h-5 w-5" />
              Unirse a Discord
            </a>
          </div>
        </div>
      </div>

      {/* --- SECCIÓN INFERIOR (REDES Y COPYRIGHT) --- */}
      <div className="border-t border-border bg-muted/20">
        <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Copyright y Legales Unificados */}
          <div className="flex flex-col md:flex-row gap-2 md:gap-6 items-center">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              &copy; {new Date().getFullYear()} Global GoalGetters. Todos los derechos reservados.
            </p>
            
            {/* ✅ AQUÍ ESTÁ EL NUEVO LINK LEGAL */}
            <Link 
              href="/legal" 
              className="text-xs text-muted-foreground hover:text-primary underline decoration-dotted transition-colors"
            >
              Términos y Privacidad
            </Link>
          </div>

          {/* ICONOS SOCIALES */}
          <div className="flex items-center gap-6">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </a>
            
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </a>
            
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter (X)</span>
            </a>

            {/* Icono de TikTok */}
            <a 
              href="https://tiktok.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <TikTokIcon className="h-5 w-5" />
              <span className="sr-only">TikTok</span>
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}