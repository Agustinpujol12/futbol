import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons'; // Asumo que este componente existe
import { createClient } from '@/lib/supabase/server';
import LogoutButton from './LogoutButton';

export async function Header() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 grid grid-cols-3 items-center border-b">
      
      {/* --- COLUMNA 1: LOGO (Izquierda) --- */}
      <div className="flex justify-start">
        <Link 
          href="/" 
          className="flex items-center gap-2"
          aria-label="Volver a la página de inicio"
        >
          <Logo className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-headline font-bold text-foreground">
            Global GoalGetters
          </h1>
        </Link>
      </div>

      {/* --- COLUMNA 2: NAVEGACIÓN (Centro) --- */}
      <nav className="flex justify-center gap-2">
        {/* Estos links solo aparecen si el usuario está logueado */}
        {user && (
          <>
            <Button asChild variant="ghost">
              <Link href="/">Inicio</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/leagues">Leagues</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </>
        )}
      </nav>

      {/* --- COLUMNA 3: USUARIO / AUTH (Derecha) --- */}
      <div className="flex justify-end items-center gap-2">
        {user ? (
          // Si el usuario SÍ está logueado
          <>
            <span className="text-sm hidden sm:inline text-muted-foreground">
              ¡Hola, {user.email?.split('@')[0]}!
            </span>
            <LogoutButton />
          </>
        ) : (
          // Si el usuario NO está logueado
          <>
            <Button asChild variant="ghost">
              <Link href="/login">Iniciar sesión</Link>
            </Button>
            <Button asChild>
              <Link href="/login">Registrarse</Link>
            </Button>
          </>
        )}
      </div>
      
    </header>
  );
}