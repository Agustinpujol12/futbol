import Link from 'next/link';
import { Logo } from '@/components/icons'; // Asegúrate de importar tu logo
import { Facebook, Instagram, Twitter, Disc, Gamepad2 } from 'lucide-react'; // Iconos de lucide-react

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
            </ul>
          </div>

          {/* Columna 3: Soporte */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-bold text-foreground">Soporte</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <span className="cursor-not-allowed hover:text-primary transition-colors">Centro de Ayuda</span>
              </li>
              <li>
                <span className="cursor-not-allowed hover:text-primary transition-colors">Reglas del Juego</span>
              </li>
              <li>
                <span className="cursor-not-allowed hover:text-primary transition-colors">Reportar un Bug</span>
              </li>
              <li>
                <span className="cursor-not-allowed hover:text-primary transition-colors">Contacto</span>
              </li>
            </ul>
          </div>

          {/* Columna 4: Comunidad */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-bold text-foreground">Comunidad</h3>
            <p className="text-sm text-muted-foreground">
              Únete a nuestro servidor de Discord para noticias, torneos y soporte en vivo.
            </p>
            <button className="flex items-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white px-4 py-2 rounded-md transition-colors w-fit font-medium text-sm">
              <Gamepad2 className="h-4 w-4" />
              Unirse a Discord
            </button>
          </div>
        </div>
      </div>

      {/* --- SECCIÓN INFERIOR (REDES Y COPYRIGHT) --- */}
      <div className="border-t border-border bg-muted/20">
        <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Copyright */}
          <p className="text-sm text-muted-foreground text-center md:text-left">
            &copy; {new Date().getFullYear()} Global GoalGetters. Todos los derechos reservados.
          </p>

          {/* Iconos Sociales */}
          <div className="flex items-center gap-6">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter (X)</span>
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}