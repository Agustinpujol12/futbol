import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Gamepad2 } from 'lucide-react';

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

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2H21l-6.56 7.49L22 22h-6.828l-5.35-6.994L3.8 22H1l7.02-8.014L2 2h6.828l4.84 6.356L18.244 2Zm-2.395 18h1.885L8.17 4H6.15l9.699 16Z" />
  </svg>
);

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto text-lg">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

{/* Columna 1 */}
          <div className="flex flex-col space-y-4">
            {/* Le agregamos w-fit para ajustar la caja y el efecto de escala al pasar el mouse */}
            <Link href="/" className="w-fit inline-block transition-transform duration-300 hover:scale-105">
              <Image
                src="/assets/draft888.png"
                alt="Logo Draft8"
                // Sacamos el 'fill' y le damos la resolución base alta
                width={400}
                height={128}
                // Cambiamos h-12 por h-24 (el doble de grande) y w-auto para el ancho perfecto
                className="h-24 w-auto object-contain object-left"
              />
            </Link>

            <p className="text-muted-foreground leading-relaxed mt-2">
              La plataforma definitiva de fútbol fantasy. Arma tu equipo,
              compite en ligas y demuestra que eres el mejor manager.
            </p>
          </div>

          {/* Columna 2 */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-bold text-xl text-foreground">Navegación</h3>

            <ul className="space-y-3 text-muted-foreground">
              <li>
                <Link href="/" className="font-semibold hover:text-primary transition-colors">
                  Inicio
                </Link>
              </li>

              {/* NUEVO ENLACE: Cómo Jugar */}
              <li>
                <Link href="/como-jugar" className="font-semibold hover:text-primary transition-colors">
                  Cómo Jugar
                </Link>
              </li>

              <li>
                <Link href="/leagues" className="font-semibold hover:text-primary transition-colors">
                  Ligas
                </Link>
              </li>

              <li>
                <Link href="/mi-equipo" className="font-semibold hover:text-primary transition-colors">
                  Mi Equipo
                </Link>
              </li>

              <li>
                <Link href="/rendimiento" className="font-semibold hover:text-primary transition-colors">
                  Rendimiento
                </Link>
              </li>

              <li>
                <Link href="/tienda" className="font-semibold hover:text-primary transition-colors">
                  Tienda
                </Link>
              </li>

              <li>
                <Link href="/fixturemundial" className="font-semibold hover:text-primary transition-colors">
                  Mundial 2026
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3 */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-bold text-xl text-foreground">Soporte</h3>

            <ul className="space-y-3 text-muted-foreground">
              <li>
                <Link href="/rules" className="font-semibold hover:text-primary transition-colors">
                  Reglas del Juego
                </Link>
              </li>

              <li>
                <Link href="/faq" className="font-semibold hover:text-primary transition-colors">
                  Preguntas Frecuentes
                </Link>
              </li>

              <li>
                <Link href="/contact" className="font-semibold hover:text-primary transition-colors">
                  Contacto
                </Link>
              </li>

              <li>
                <a
                  href="https://discord.gg/fHV4yxsF76"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold hover:text-primary transition-colors"
                >
                  Reportar un Bug
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 4 */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-bold text-xl text-foreground">Comunidad</h3>

            <p className="text-muted-foreground leading-relaxed">
              Únete a nuestro servidor de Discord para noticias, torneos y
              soporte en vivo.
            </p>

            <a
              href="https://discord.gg/fHV4yxsF76"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white px-5 py-2.5 rounded-md transition-all transform hover:scale-105 w-fit font-semibold shadow-lg shadow-indigo-500/20"
            >
              <Gamepad2 className="h-5 w-5" />
              Unirse a Discord
            </a>
          </div>

        </div>
      </div>

      {/* Parte inferior */}
      <div className="border-t border-border bg-muted/20">
        <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">

          <div className="flex flex-col md:flex-row gap-3 md:gap-6 items-center">
            <p className="text-base text-muted-foreground text-center md:text-left">
              &copy; {new Date().getFullYear()} DRAFT8. Todos los derechos reservados.
            </p>

            <Link
              href="/legal"
              className="text-base text-muted-foreground hover:text-primary underline decoration-dotted transition-colors"
            >
              Términos y Privacidad
            </Link>
          </div>

          {/* Redes */}
          <div className="flex items-center gap-6">

            <a
              href="https://www.instagram.com/draft8_/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Instagram className="h-6 w-6" />
            </a>

            <a
              href="https://www.facebook.com/profile.php?id=61584882519363"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Facebook className="h-6 w-6" />
            </a>

            <a
              href="https://x.com/draft8_"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <XIcon className="h-6 w-6" />
            </a>

            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <TikTokIcon className="h-6 w-6" />
            </a>

          </div>
        </div>
      </div>
    </footer>
  );
}