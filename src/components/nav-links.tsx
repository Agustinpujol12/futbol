'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"

export function NavLinks() {
  const pathname = usePathname()

  const linkClass = (path: string) =>
    `block px-3 py-2 font-bold text-lg whitespace-nowrap
     transition-colors duration-200 rounded-md
     ${
       pathname === path
         ? "text-primary hover:text-primary/80"
         : "text-muted-foreground hover:text-primary"
     }`

  return (
    <>
      <Link href="/" className={linkClass("/")}>
        Inicio
      </Link>

      <Link href="/como-jugar" className={linkClass("/como-jugar")}>
        Cómo Jugar
      </Link>

      <Link href="/leagues" className={linkClass("/leagues")}>
        Ligas
      </Link>

      <Link href="/mi-equipo" className={linkClass("/dashboard")}>
        Mi Equipo
      </Link>

      <Link href="/rendimiento" className={linkClass("/rendimiento")}>
        Rendimiento
      </Link>

      <Link href="/tienda" className={linkClass("/tienda")}>
        Tienda
      </Link>

      <Link href="/fixturemundial" className={linkClass("/fixturemundial")}>
        Mundial 2026
      </Link>
    </>
  )
}